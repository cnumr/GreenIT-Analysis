

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
var ecoRules;
var measures;


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
  // debug(() => `receive from frameAnalyse.js ${JSON.stringify(frameMeasures)}`);
  measures.domSize += frameMeasures.domSize;
  measures.ecoIndex = calculEcoIndex(measures.domSize, measures.nbRequest, Math.round(measures.responsesSize / 1000));
  measures.grade = getEcoIndexGrade(measures.ecoIndex);
  measures.pluginsNumber += frameMeasures.pluginsNumber;
  if (measures.pluginsNumber > 0) setRuleValues("plugins", false, measures.pluginsNumber + " plugin(s) found");

  if (measures.styleSheetsNumber < frameMeasures.styleSheetsNumber) {
    measures.styleSheetsNumber = frameMeasures.styleSheetsNumber;
    if (measures.styleSheetsNumber > 2) setRuleValues("styleSheets", false, measures.styleSheetsNumber + " stylesheets found for at least one frame");
  }
  measures.printStyleSheetsNumber += frameMeasures.printStyleSheetsNumber;
  if (measures.printStyleSheetsNumber > 0) setRuleValues("printStyleSheets", true, measures.printStyleSheetsNumber + " print StyleSheet(s) found");

  if (measures.inlineStyleSheetsNumber < frameMeasures.inlineStyleSheetsNumber) {
    measures.inlineStyleSheetsNumber = frameMeasures.inlineStyleSheetsNumber;
    if (measures.inlineStyleSheetsNumber > 0) setRuleValues("externalizeCss", false, measures.inlineStyleSheetsNumber + " inline stylesheets found ");
  }
  measures.emptySrcTagNumber += frameMeasures.emptySrcTagNumber;
  if (measures.emptySrcTagNumber > 0) setRuleValues("emptySrcTag", false, measures.emptySrcTagNumber + " empty src tag(s) found");

  if (frameMeasures.inlineJsScript.length > 0) analyseJsCode(frameMeasures.inlineJsScript, "inline");

  if (measures.inlineJsScriptsNumber < frameMeasures.inlineJsScriptsNumber) {
    measures.inlineJsScriptsNumber = frameMeasures.inlineJsScriptsNumber;
    if (measures.inlineJsScriptsNumber > 0) setRuleValues("externalizeJs", (measures.inlineJsScriptsNumber < 2), measures.inlineJsScriptsNumber + " inline  javascripts found ");
  }
}

function setRuleValues(ruleId, isRespected, comment) {
  if (isRespected) ecoRules.get(ruleId).status = "OK";
  else ecoRules.get(ruleId).status = "NOK"
  ecoRules.get(ruleId).comment = comment;
}

function refreshUI() {
  document.getElementById("results").hidden = false;
  document.getElementById("requestNumber").innerHTML = measures.nbRequest;
  document.getElementById("responsesSize").innerHTML = measures.responsesSize / 1000 + "(" + measures.responsesSizeUncompress / 1000 + ")";
  document.getElementById("domSize").innerHTML = measures.domSize;
  document.getElementById("ecoIndex").innerHTML = measures.ecoIndex;
  document.getElementById("grade").innerHTML = '<span class="grade ' + measures.grade + '">' + measures.grade + '</span>';
  ecoRules.forEach(showEcoRuleOnUI);
}

function showEcoRuleOnUI(ecoRule) {
  if (ecoRule !== undefined) {
    document.getElementById(ecoRule.ruleId + "_status").src = "icons/" + ecoRule.status + ".png";
    document.getElementById(ecoRule.ruleId + "_comment").innerHTML = ecoRule.comment;
  }
}

function launchAnalyse() {
  initializeMeasures();
  initializeEcoRules()
  // Launch analyse via injection of a script in each frame of the current tab
  backgroundPageConnection.postMessage({
    tabId: chrome.devtools.inspectedWindow.tabId,
    scriptToInject: "script/analyseFrame.js"
  });
  getNetworkMeasure();
  getResourcesMeasure();
}


function initializeMeasures() {
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
    "staticResourcesNumber":0,
    "staticResourcesNumberWithCacheHeaders":0
  };
}


function initializeEcoRules() {
  ecoRules = new Map();
  ecoRules.set("plugins", { ruleId: "plugins", status: "OK", comment: "No plugin found" });
  ecoRules.set("styleSheets", { ruleId: "styleSheets", status: "OK", comment: "Not more that 2 stylesheets per frame found" });
  ecoRules.set("printStyleSheets", { ruleId: "printStyleSheets", status: "NOK", comment: "No print stylesheet found" });
  ecoRules.set("externalizeCss", { ruleId: "externalizeCss", status: "OK", comment: "No inline stylesheet found" });
  ecoRules.set("minifiedCss", { ruleId: "minifiedCss", status: "OK", comment: "No css found" });
  ecoRules.set("emptySrcTag", { ruleId: "emptySrcTag", status: "OK", comment: "No empty src tags found" });
  ecoRules.set("jsValidate", { ruleId: "jsValidate", status: "OK", comment: "Javascript validate" });
  ecoRules.set("externalizeJs", { ruleId: "externalizeJs", status: "OK", comment: "No inline JavaScript" });
  ecoRules.set("minifiedJs", { ruleId: "minifiedJs", status: "OK", comment: "No js found" });
  ecoRules.set("httpRequests", { ruleId: "httpRequests", status: "OK", comment: "" });
  ecoRules.set("domainsNumber", { ruleId: "domainsNumber", status: "OK", comment: "" });
  ecoRules.set("addExpiresOrCacheControlHeaders", { ruleId: "addExpiresOrCacheControlHeaders", status: "OK", comment: "" });
}


function getNetworkMeasure() {
  chrome.devtools.network.getHAR(function (har) {
    var entries = har.entries;
    var domains = [];
    if (entries.length) {
      measures.nbRequest = entries.length;
      for (var i = 0; i < entries.length; ++i) {
        console.log("entries = " + JSON.stringify(entries[i]));
        measures.responsesSize += entries[i].response._transferSize;
        measures.responsesSizeUncompress += entries[i].response.content.size;
        if (isStaticRessource(entries[i])) {
          measures.staticResourcesNumber++;
          if (hasValidCacheHeaders(entries[i])) measures.staticResourcesNumberWithCacheHeaders++;
        }
        let domain = getDomainFromUrl(entries[i].request.url);
        if (domains.indexOf(domain) === -1) {
          domains.push(domain);
          debug(() => `found domain ${domain}`);
        }
      }
      setRuleValues("httpRequests", (measures.nbRequest < 27), measures.nbRequest + " HTTP request(s) ");
      measures.domainsNumber = domains.length;
      setRuleValues("domainsNumber", (measures.domainsNumber < 3), domains.length + " domain(s) found");
      if (measures.staticResourcesNumber>0) {
        const cacheHeaderRatio = measures.staticResourcesNumberWithCacheHeaders / measures.staticResourcesNumber * 100;
        debug(() => `static ressource ${measures.staticResourcesNumber}`);
        debug(() => `static ressource with cache header ${measures.staticResourcesNumberWithCacheHeaders}`);
        setRuleValues("addExpiresOrCacheControlHeaders", (cacheHeaderRatio >= 95), cacheHeaderRatio + " % ressources cached");
      }
      refreshUI();
    }
  });
}



function getResourcesMeasure() {
  chrome.devtools.inspectedWindow.getResources(function (resources) {
    for (let i = 0; i < resources.length; ++i) {
      debug(() => `resource =  ${JSON.stringify(resources[i])}`);
      if ((resources[i].type === 'script') || (resources[i].type === 'stylesheet')) {
        let resourceAnalyser = new ResourceAnalyser(resources[i]);
        resourceAnalyser.analyse();
      }
    }
  });
}


function analyseJsCode(code, url) {

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
  if (measures.jsErrorsNumber > 0) setRuleValues("jsValidate", false, measures.jsErrorsNumber + " javascript error(s) found");
  refreshUI();
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
        analyseJsCode(code, resourceToAnalyse.url);
        analyseMinifiedJs(code, resourceToAnalyse.url);
      }
    if (resourceToAnalyse.type === 'stylesheet') analyseMinifiedCss(code, resourceToAnalyse.url);

  }
}


function analyseMinifiedJs(code, url) {
  measures.totalJs++;
  if (isMinified(code)) {
    measures.minifiedJsNumber++;
    debug(() => `${url} is minified`);
  }
  else debug(() => `${url} is not minified`);
  measures.percentMinifiedJs = measures.minifiedJsNumber / measures.totalJs * 100;
  setRuleValues("minifiedJs", (measures.percentMinifiedJs >= 95), measures.percentMinifiedJs + " % (" + measures.minifiedJsNumber + "/" + measures.totalJs + ") minified javascript ");
  refreshUI();
}


function analyseMinifiedCss(code, url) {
  measures.totalCss++;
  if (isMinified(code)) {
    measures.minifiedCssNumber++;
    debug(() => `${url} is minified`);
  }
  else debug(() => `${url} is not minified`);
  measures.percentMinifiedCss = measures.minifiedCssNumber / measures.totalCss * 100;
  setRuleValues("minifiedCss", (measures.percentMinifiedCss >= 95), measures.percentMinifiedCss + " % (" + measures.minifiedCssNumber + "/" + measures.totalCss + ") minified stylesheet ");
  refreshUI();
}

//});


