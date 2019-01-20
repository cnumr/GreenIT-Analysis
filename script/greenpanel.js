

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. 
 *
 * @author didierfred@gmail.com
 */

const DEBUG = true;

requirejs.config({
  //By default load any module IDs from script
  baseUrl: 'script',
});

// Load module require.js
requirejs(['esprima'],
  function (esprima) {
    console.log("Load esprima module");
  });


var backgroundPageConnection;
var rules;
var lastAnalyseStartingTime = 0;
var measuresAcquisition;

initPanel();

function initPanel() {
  openBackgroundPageConnection();
  document.getElementById('launchAnalyse').addEventListener('click', function (e) { launchAnalyse(); });
}

function openBackgroundPageConnection() {
  backgroundPageConnection = chrome.runtime.connect({
    name: "greenDevPanel-page"
  });
  backgroundPageConnection.onMessage.addListener(function (frameMeasures) {
    // Handle responses from the background page
    aggregateFrameMeasures(frameMeasures);
    refreshUI();
  });
}

function aggregateFrameMeasures(frameMeasures) {
  //debug(() => `receive from frameAnalyse.js ${JSON.stringify(frameMeasures)}`);
  logFrameMeasures(frameMeasures);

  if (isOldAnalyse(frameMeasures.analyseStartingTime)) {
    debug(() => `Analyse is too old for url ${frameMeasures.url} , time = ${frameMeasures.analyseStartingTime}`);
    return;
  }
  let measures = measuresAcquisition.getMeasures();

  measures.domSize += frameMeasures.domSize;
  measures.ecoIndex = calculEcoIndex(measures.domSize, measures.nbRequest, Math.round(measures.responsesSize / 1000));
  measures.grade = getEcoIndexGrade(measures.ecoIndex);
  measures.pluginsNumber += frameMeasures.pluginsNumber;

  if (measures.styleSheetsNumber < frameMeasures.styleSheetsNumber) measures.styleSheetsNumber = frameMeasures.styleSheetsNumber;
  measures.printStyleSheetsNumber += frameMeasures.printStyleSheetsNumber;
  if (measures.inlineStyleSheetsNumber < frameMeasures.inlineStyleSheetsNumber) measures.inlineStyleSheetsNumber = frameMeasures.inlineStyleSheetsNumber;
  measures.emptySrcTagNumber += frameMeasures.emptySrcTagNumber;
  if (frameMeasures.inlineJsScript.length > 0) analyseJsCode(frameMeasures.inlineJsScript, "inline",measures);
  if (measures.inlineJsScriptsNumber < frameMeasures.inlineJsScriptsNumber) measures.inlineJsScriptsNumber = frameMeasures.inlineJsScriptsNumber;

  measures.imageResizedInBrowserNumber += frameMeasures.imageResizedInBrowserNumber;

  rules.checkRule('plugins', measures);
  rules.checkRule('styleSheets', measures);
  rules.checkRule('printStyleSheets', measures);
  rules.checkRule('emptySrcTag', measures);
  rules.checkRule('jsValidate', measures);
  rules.checkRule('externalizeCss', measures);
  rules.checkRule('dontResizeImageInBrowser',measures);
}

function logFrameMeasures(frameMeasures) {
  debug(() => `Analyse form frame : ${frameMeasures.url}, analyseStartingTime : ${frameMeasures.analyseStartingTime}DomSize:${frameMeasures.domSize},Plugins:${frameMeasures.pluginsNumber},StyleSheets:${frameMeasures.styleSheetsNumber},Print StyleSheets:${frameMeasures.printStyleSheetsNumber},Inline StyleSheets:${frameMeasures.inlineStyleSheetsNumber},Empty Src Tag:${frameMeasures.emptySrcTagNumber},Inline Js Scripts:${frameMeasures.inlineJsScriptsNumber}`);
}

function isOldAnalyse(startingTime) {
  return (startingTime < lastAnalyseStartingTime);
}

function refreshUI() {
  const measures = measuresAcquisition.getMeasures();
  document.getElementById("results").hidden = false;
  document.getElementById("requestNumber").innerHTML = measures.nbRequest;
  document.getElementById("responsesSize").innerHTML = measures.responsesSize / 1000 + "(" + measures.responsesSizeUncompress / 1000 + ")";
  document.getElementById("domSize").innerHTML = measures.domSize;
  document.getElementById("ecoIndex").innerHTML = measures.ecoIndex;
  document.getElementById("grade").innerHTML = '<span class="grade ' + measures.grade + '">' + measures.grade + '</span>';
  rules.getAllRules().forEach(showEcoRuleOnUI);
}

function showEcoRuleOnUI(rule) {
  //debug(() => "rule =" + JSON.stringify(rule)); 
  if (rule !== undefined) {
    var status = "NOK";
    if (rule.isRespected) status = "OK";
    document.getElementById(rule.id + "_status").src = "icons/" + status + ".png";
    document.getElementById(rule.id + "_comment").innerHTML = rule.comment;
  }
}

function launchAnalyse() {
  var now = Date.now();

  // To avoid parallel analyse , force 1 secondes between analysis 
  if (now - lastAnalyseStartingTime < 1000) {
    debug (()=> "Ignore click");
    return;
  }
  lastAnalyseStartingTime = now;
  debug(() => `Starting new analyse , time = ${lastAnalyseStartingTime}`);
  rules = new Rules();
  measuresAcquisition = new MeasuresAcquisition(rules);
  measuresAcquisition.initializeMeasures();

  // Launch analyse via injection of a script in each frame of the current tab
  backgroundPageConnection.postMessage({
    tabId: chrome.devtools.inspectedWindow.tabId,
    scriptToInject: "script/analyseFrame.js"
  });
  measuresAcquisition.startMeasuring();
}


function analyseJsCode(code, url, measures) {

  try {
    const syntax = require("esprima").parse(code, { tolerant: true, sourceType: 'script', loc: true });
    if (syntax.errors) {
      if (syntax.errors.length > 0) {
        measures.jsErrorsNumber += syntax.errors.length;
        debug(() => `url ${url} : ${Syntax.errors.length} errors`);
      }
    }
  } catch (err) {
    measures.jsErrorsNumber++;
    debug(() => `url ${url} : ${err} `);
  }
  rules.checkRule("jsValidate", measures);
  refreshUI();
}


function MeasuresAcquisition(rules) {
  
  let measures ; 
  let localRules = rules;

  this.initializeMeasures = function() {
    measures = {       
      "domSize": 0,
      "nbRequest": 0,
      "responsesSize": 0,
      "responsesSizeUncompress": 0,
      "ecoIndex": 100,
      "grade": 'A',
      "pluginsNumber": 0,
      "styleSheetsNumber": 0,
      "printStyleSheetsNumber": 0,
      "inlineStyleSheetsNumber": 0,
      "minifiedCssNumber": 0,
      "totalCss": 0,
      "percentMinifiedCss": 0,
      "emptySrcTagNumber": 0,
      "jsErrorsNumber": 0,
      "inlineJsScriptsNumber": 0,
      "minifiedJsNumber": 0,
      "totalJs": 0,
      "percentMinifiedJs": 0,
      "domainsNumber": 0,
      "staticResourcesNumber": 0,
      "staticResourcesNumberWithCacheHeaders": 0,
      "staticResourcesNumberWithETags":0,
      "compressibleResourcesNumber": 0,
      "compressibleResourcesNumberCompressed": 0,
      "imageResizedInBrowserNumber":0
    };
  }

  this.startMeasuring = function() {
    getNetworkMeasure();
    getResourcesMeasure();
  }

  this.getMeasures = function() {
    return measures;
  }

  function getNetworkMeasure() {
    chrome.devtools.network.getHAR(function (har) {
      var entries = har.entries;
      var domains = [];
      if (entries.length) {
        measures.nbRequest = entries.length;
        for (var i = 0; i < entries.length; ++i) {
          //console.log("entries = " + JSON.stringify(entries[i]));
          measures.responsesSize += entries[i].response._transferSize;
          measures.responsesSizeUncompress += entries[i].response.content.size;
          if (isStaticRessource(entries[i])) {
            measures.staticResourcesNumber++;
            //debug(() => `resource ${entries[i].request.url} is cacheable `);
            if (hasValidCacheHeaders(entries[i])) {
              measures.staticResourcesNumberWithCacheHeaders++;
              //debug(() => `resource ${entries[i].request.url} is cached `);
            }
            // else  debug(() => `resource ${entries[i].request.url} is not cached `);
            if (isRessourceUsingETag(entries[i])) measures.staticResourcesNumberWithETags++;
          }
          if (isCompressibleResource(entries[i])) {
            measures.compressibleResourcesNumber++;
            //debug(() => `resource ${entries[i].request.url} is compressible `);
            if (isResourceCompressed(entries[i])) {
              measures.compressibleResourcesNumberCompressed++;
              //debug(() => `resource ${entries[i].request.url} is compressed `);
            }
            //else  debug(() => `resource ${entries[i].request.url} is not compressed `);
          }
          let domain = getDomainFromUrl(entries[i].request.url);
          if (domains.indexOf(domain) === -1) {
            domains.push(domain);
            //debug(() => `found domain ${domain}`);
          }
        }
        measures.domainsNumber = domains.length;
        localRules.checkRule("httpRequests", measures);
        localRules.checkRule("domainsNumber", measures);
        localRules.checkRule("addExpiresOrCacheControlHeaders", measures);
        localRules.checkRule("useETags", measures);
        localRules.checkRule("compressHttp", measures);
        refreshUI();
      }
    });
  }


  function getResourcesMeasure() {
    chrome.devtools.inspectedWindow.getResources(function (resources) {
      for (let i = 0; i < resources.length; ++i) {
        if ((resources[i].type === 'script') || (resources[i].type === 'stylesheet')) {
          let resourceAnalyser = new ResourceAnalyser(resources[i]);
          resourceAnalyser.analyse();
        }
      }
    });
  }


  

  function ResourceAnalyser(resource) {
    var resourceToAnalyse = resource;

    this.analyse = function () {
      resourceToAnalyse.getContent(this.analyseJs);
    };

    this.analyseJs = function (code) {
      // exclude from analyse the injected script 
      if (resourceToAnalyse.type === 'script')
        if (!resourceToAnalyse.url.includes("script/analyseFrame.js")) {
          analyseJsCode(code, resourceToAnalyse.url,measures);
          analyseMinifiedJs(code, resourceToAnalyse.url);
        }
      if (resourceToAnalyse.type === 'stylesheet') analyseMinifiedCss(code, resourceToAnalyse.url);

    }
  }


  function analyseMinifiedJs(code, url) {
    measures.totalJs++;
    if (isMinified(code)) {
      measures.minifiedJsNumber++;
      //debug(() => `${url} is minified`);
    }
    //else debug(() => `${url} is not minified`);
    measures.percentMinifiedJs = measures.minifiedJsNumber / measures.totalJs * 100;
    localRules.checkRule("minifiedJs", measures);
    refreshUI();
  }


  function analyseMinifiedCss(code, url) {
    measures.totalCss++;
    if (isMinified(code)) {
      measures.minifiedCssNumber++;
      //debug(() => `${url} is minified`);
    }
    //else debug(() => `${url} is not minified`);
    measures.percentMinifiedCss = measures.minifiedCssNumber / measures.totalCss * 100;
    localRules.checkRule("minifiedCss", measures);
    refreshUI();
  }
}



