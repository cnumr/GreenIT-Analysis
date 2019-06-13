

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. 
 *
 * @author didierfred@gmail.com
 */



let backgroundPageConnection;
let rules;
let lastAnalyseStartingTime = 0;
let measuresAcquisition;
let url = "";
let analyseBestPractices = false;


initPanel();

function initPanel() {
  openBackgroundPageConnection();
  document.getElementById('launchAnalyse').addEventListener('click', (e) => launchAnalyse());
  document.getElementById('saveAnalyse').addEventListener('click', (e) => storeAnalysisInHistory());
  document.getElementById('viewHistory').addEventListener('click', (e) => viewHistory());
  document.getElementById('helpButton').addEventListener('click', (e) => viewHelp());
  document.getElementById('analyseBestPracticesCheckBox').addEventListener('click', (e) => setAnalyseBestPractices());
}

function openBackgroundPageConnection() {
  backgroundPageConnection = chrome.runtime.connect({
    name: "greenDevPanel-page"
  });
  backgroundPageConnection.onMessage.addListener((frameMeasures) => {
    // Handle responses from the background page
    aggregateFrameMeasures(frameMeasures);
    refreshUI();
  });
}

function aggregateFrameMeasures(frameMeasures) {
  //debug(() => `receive from frameAnalyse.js ${JSON.stringify(frameMeasures)}`);
  //logFrameMeasures(frameMeasures);

  if (isOldAnalyse(frameMeasures.analyseStartingTime)) {
    debug(() => `Analyse is too old for url ${frameMeasures.url} , time = ${frameMeasures.analyseStartingTime}`);
    return;
  }
  let measures = measuresAcquisition.getMeasures();

  measures.domSize += frameMeasures.domSize;
  computeEcoIndexMeasures(measures);

  if (analyseBestPractices) {
    measures.pluginsNumber += frameMeasures.pluginsNumber;

    if (measures.styleSheetsNumber < frameMeasures.styleSheetsNumber) measures.styleSheetsNumber = frameMeasures.styleSheetsNumber;
    measures.printStyleSheetsNumber += frameMeasures.printStyleSheetsNumber;
    if (measures.inlineStyleSheetsNumber < frameMeasures.inlineStyleSheetsNumber) measures.inlineStyleSheetsNumber = frameMeasures.inlineStyleSheetsNumber;
    measures.emptySrcTagNumber += frameMeasures.emptySrcTagNumber;
    if (frameMeasures.inlineJsScript.length > 0) analyseJsCode(frameMeasures.inlineJsScript, "inline", measures);
    if (measures.inlineJsScriptsNumber < frameMeasures.inlineJsScriptsNumber) measures.inlineJsScriptsNumber = frameMeasures.inlineJsScriptsNumber;

    measures.imageResizedInBrowserNumber += frameMeasures.imageResizedInBrowserNumber;

    if (measures.cssFontFaceRuleNumber < frameMeasures.cssFontFaceRuleNumber) measures.cssFontFaceRuleNumber = frameMeasures.cssFontFaceRuleNumber;


    rules.checkRule('plugins', measures);
    rules.checkRule('styleSheets', measures);
    rules.checkRule('printStyleSheets', measures);
    rules.checkRule('emptySrcTag', measures);
    rules.checkRule('jsValidate', measures);
    rules.checkRule('externalizeCss', measures);
    rules.checkRule('externalizeJs', measures);
    rules.checkRule('dontResizeImageInBrowser', measures);
    rules.checkRule('useStandardTypefaces', measures);
  }
}

function logFrameMeasures(frameMeasures) {
  debug(() => `Analyse form frame : ${frameMeasures.url}, analyseStartingTime : ${frameMeasures.analyseStartingTime}DomSize:${frameMeasures.domSize},Plugins:${frameMeasures.pluginsNumber},StyleSheets:${frameMeasures.styleSheetsNumber},Print StyleSheets:${frameMeasures.printStyleSheetsNumber},Inline StyleSheets:${frameMeasures.inlineStyleSheetsNumber},Empty Src Tag:${frameMeasures.emptySrcTagNumber},Inline Js Scripts:${frameMeasures.inlineJsScriptsNumber},css Font Face:${frameMeasures.cssFontFaceRuleNumber}`);
}

function isOldAnalyse(startingTime) { return (startingTime < lastAnalyseStartingTime) };

function computeEcoIndexMeasures(measures)
{
measures.ecoIndex = computeEcoIndex(measures.domSize, measures.nbRequest, Math.round(measures.responsesSize / 1000));
measures.waterConsumption = computeWaterConsumptionfromEcoIndex(measures.ecoIndex);
measures.greenhouseGasesEmission = computeGreenhouseGasesEmissionfromEcoIndex(measures.ecoIndex);
measures.grade = getEcoIndexGrade(measures.ecoIndex);
}

function refreshUI() {
  const measures = measuresAcquisition.getMeasures();
  document.getElementById("ecoIndexView").hidden = false;
  document.getElementById("requestNumber").innerHTML = measures.nbRequest;
  
  if (measures.responsesSizeUncompress!=0) document.getElementById("responsesSize").innerHTML = Math.round(measures.responsesSize / 1000) + " (" + Math.round(measures.responsesSizeUncompress / 1000) + ")";
  else document.getElementById("responsesSize").innerHTML = Math.round(measures.responsesSize / 1000);
  
  document.getElementById("domSize").innerHTML = measures.domSize;
  document.getElementById("ecoIndex").innerHTML = measures.ecoIndex;
  document.getElementById("grade").innerHTML = '<span class="grade ' + measures.grade + '">' + measures.grade + '</span>';
  document.getElementById("waterConsumption").innerHTML = measures.waterConsumption;
  document.getElementById("greenhouseGasesEmission").innerHTML = measures.greenhouseGasesEmission;
  if (analyseBestPractices) {
    document.getElementById("bestPracticesView").hidden = false;
    rules.getAllRules().forEach(showEcoRuleOnUI);
  }
  else document.getElementById("bestPracticesView").hidden = true;
}

function showEcoRuleOnUI(rule) {
  //debug(() => "rule =" + JSON.stringify(rule)); 
  if (rule !== undefined) {
    let status = "NOK";
    if (rule.isRespected) status = "OK";
    document.getElementById(rule.id + "_status").src = "icons/" + status + ".png";
    document.getElementById(rule.id + "_comment").innerHTML = rule.comment;
  }
}

function launchAnalyse() {
  let now = Date.now();

  // To avoid parallel analyse , force 1 secondes between analysis 
  if (now - lastAnalyseStartingTime < 1000) {
    debug(() => "Ignore click");
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
    scriptToInject: "script/analyseFrame.js",
    analyseBestPractices: analyseBestPractices
  });
  measuresAcquisition.startMeasuring();
}


function analyseJsCode(code, url, measures) {

  measures.jsErrorsNumber += computeNumberOfErrorsInJSCode(code, url);
  rules.checkRule("jsValidate", measures);
  refreshUI();
}


function MeasuresAcquisition(rules) {

  let measures;
  let localRules = rules;

  this.initializeMeasures = () => {
    measures = {
      "url": "",
      "domSize": 0,
      "nbRequest": 0,
      "responsesSize": 0,
      "responsesSizeUncompress": 0,
      "ecoIndex": 100,
      "grade": 'A',
      "waterConsumption": 0,
      "greenhouseGasesEmission": 0,
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
      "staticResourcesNumberWithETags": 0,
      "compressibleResourcesNumber": 0,
      "compressibleResourcesNumberCompressed": 0,
      "imageResizedInBrowserNumber": 0,
      "cssFontFaceRuleNumber": 0
    };
  }

  this.startMeasuring = function () {
    getNetworkMeasure();
    if (analyseBestPractices) getResourcesMeasure();
  }

  this.getMeasures = () => measures;


  getNetworkMeasure = () => {
    chrome.devtools.network.getHAR((har) => {
      let entries = har.entries;

      // Get the "mother" url 
      if (entries.length > 0) {
        measures.url = entries[0].request.url;
      }
      let domains = [];
      if (entries.length) {
        measures.nbRequest = entries.length;
        entries.map(entry => {
          console.log("entries = " + JSON.stringify(entry));
          
		  // If chromium : 
		  // _transferSize represent the real data volume transfert 
		  // while content.size represent the size of the page which is uncompress
		  if (entry.response._transferSize) {
			  measures.responsesSize += entry.response._transferSize;
			  measures.responsesSizeUncompress += entry.response.content.size;
		  }
		  else measures.responsesSize += entry.response.content.size;
		  
          if (analyseBestPractices) {
            if (isStaticRessource(entry)) {
              measures.staticResourcesNumber++;
              //debug(() => `resource ${entry.request.url} is cacheable `);
              if (hasValidCacheHeaders(entry)) {
                measures.staticResourcesNumberWithCacheHeaders++;
                debug(() => `resource ${entry.request.url} is cached `);
              }
              else debug(() => `resource ${entry.request.url} is not cached `);
              if (isRessourceUsingETag(entry)) {
                measures.staticResourcesNumberWithETags++;
                debug(() => `resource ${entry.request.url} is using ETags `);
              }
              else debug(() => `resource ${entry.request.url} is not using ETags `);
            }
            if (isCompressibleResource(entry)) {
              measures.compressibleResourcesNumber++;
              //debug(() => `resource ${entry.request.url} is compressible `);
              if (isResourceCompressed(entry)) {
                measures.compressibleResourcesNumberCompressed++;
                debug(() => `resource ${entry.request.url} is compressed `);
              }
              else debug(() => `resource ${entry.request.url} is not compressed `);
            }
            let domain = getDomainFromUrl(entry.request.url);
            if (domains.indexOf(domain) === -1) {
              domains.push(domain);
              debug(() => `found domain ${domain}`);
            }
          }
        });
        if (analyseBestPractices) {
          measures.domainsNumber = domains.length;
          localRules.checkRule("httpRequests", measures);
          localRules.checkRule("domainsNumber", measures);
          localRules.checkRule("addExpiresOrCacheControlHeaders", measures);
          localRules.checkRule("useETags", measures);
          localRules.checkRule("compressHttp", measures);
        }
        computeEcoIndexMeasures(measures);
        refreshUI();
      }
    });
  }


  function getResourcesMeasure() {
    chrome.devtools.inspectedWindow.getResources((resources) => {
      resources.map(resource => {
        if ((resource.type === 'script') || (resource.type === 'stylesheet')) {
          let resourceAnalyser = new ResourceAnalyser(resource);
          resourceAnalyser.analyse();
        }
      });
    });
  }




  function ResourceAnalyser(resource) {
    let resourceToAnalyse = resource;

    this.analyse = () => resourceToAnalyse.getContent(this.analyseJs);

    this.analyseJs = (code) => {
      // exclude from analyse the injected script 
      if (resourceToAnalyse.type === 'script')
        if (!resourceToAnalyse.url.includes("script/analyseFrame.js")) {
          analyseJsCode(code, resourceToAnalyse.url, measures);
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
    localRules.checkRule("minifiedJs", measures);
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
    localRules.checkRule("minifiedCss", measures);
    refreshUI();
  }
}

/**
Add to the history the result of an analyse
**/
function storeAnalysisInHistory() {
  let measures = measuresAcquisition.getMeasures();
  if (!measures) return;

  var analyse_history;
  var string_analyse_history = localStorage.getItem("analyse_history");

  if (string_analyse_history) {
    analyse_history = JSON.parse(string_analyse_history);
    analyse_history.reverse();
    analyse_history.push({
      resultDate: new Date(),
      url: measures.url,
      nbRequest: measures.nbRequest,
      responsesSize: Math.round(measures.responsesSize / 1000),
      domSize: measures.domSize,
      greenhouseGasesEmission: measures.greenhouseGasesEmission,
      waterConsumption: measures.waterConsumption,
      ecoIndex: measures.ecoIndex,
      grade: measures.grade
    });
    analyse_history.reverse();
  }
  else analyse_history = [{
    resultDate: new Date(),
    url: measures.url,
    nbRequest: measures.nbRequest,
    responsesSize: Math.round(measures.responsesSize / 1000),
    domSize: measures.domSize,
    greenhouseGasesEmission: measures.greenhouseGasesEmission,
    waterConsumption: measures.waterConsumption,
    ecoIndex: measures.ecoIndex,
    grade: measures.grade
  }];


  localStorage.setItem("analyse_history", JSON.stringify(analyse_history));
}


function viewHistory() {
  if (chrome.tabs) chrome.tabs.query({ currentWindow: true }, loadHistoryTab);
  // chrome.tabs is not accessible in old chromium version 
  else  window.open("history.html");
}


function loadHistoryTab(tabs) {
  var history_tab;
  // search for config tab
  for (let tab of tabs) {
    if (tab.url.startsWith(chrome.extension.getURL(""))) history_tab = tab;
  }
  // config tab exits , put the focus on it
  if (history_tab) {
    chrome.tabs.reload(history_tab.id);
    chrome.tabs.update(history_tab.id, { active: true });
  }
  // else create a new tab
  else chrome.tabs.create({ url: "history.html" });

}


function viewHelp() { 
  window.open("https://github.com/didierfred/GreenIT-Analysis");
}


function setAnalyseBestPractices() {
  analyseBestPractices = document.getElementById('analyseBestPracticesCheckBox').checked ;
  if (!analyseBestPractices) document.getElementById("bestPracticesView").hidden = true;
}
