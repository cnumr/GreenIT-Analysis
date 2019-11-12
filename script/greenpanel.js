

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. 
 *
 * @author didierfred@gmail.com
 */

let backgroundPageConnection;
let currentRules;
let lastAnalyseStartingTime = 0;
let measuresAcquisition;
let analyseBestPractices = false;

initPanel();

function initPanel() {
  openBackgroundPageConnection();

  // if method chrome.devtools.inspectedWindow.getResources is not implemented (ex: firefox)
  // These rules cannot be computed
  if (!chrome.devtools.inspectedWindow.getResources) {
    setUnsupportedRuleAnalyse("minifiedJs");
    setUnsupportedRuleAnalyse("jsValidate");
    setUnsupportedRuleAnalyse("minifiedCss");
    setUnsupportedRuleAnalyse("optimizeSvg");
  }
  initUI();
}

function openBackgroundPageConnection() {
  backgroundPageConnection = chrome.runtime.connect({
    name: "greenDevPanel-page"
  });
  backgroundPageConnection.onMessage.addListener((frameMeasures) => {
    handleResponseFromBackground(frameMeasures);
    refreshUI();
  });
}

function handleResponseFromBackground(frameMeasures) {
  if (isOldAnalyse(frameMeasures.analyseStartingTime)) {
    debug(() => `Analyse is too old for url ${frameMeasures.url} , time = ${frameMeasures.analyseStartingTime}`);
    return;
  }
  measuresAcquisition.aggregateFrameMeasures(frameMeasures);
}


function isOldAnalyse(startingTime) { return (startingTime < lastAnalyseStartingTime) }

function computeEcoIndexMeasures(measures) {
  measures.ecoIndex = computeEcoIndex(measures.domSize, measures.nbRequest, Math.round(measures.responsesSize / 1000));
  measures.waterConsumption = computeWaterConsumptionfromEcoIndex(measures.ecoIndex);
  measures.greenhouseGasesEmission = computeGreenhouseGasesEmissionfromEcoIndex(measures.ecoIndex);
  measures.grade = getEcoIndexGrade(measures.ecoIndex);
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
  currentRules = new Rules();
  measuresAcquisition = new MeasuresAcquisition(currentRules);
  measuresAcquisition.initializeMeasures();

  // Launch analyse via injection of a script in each frame of the current tab
  backgroundPageConnection.postMessage({
    tabId: chrome.devtools.inspectedWindow.tabId,
    scriptToInject: "script/analyseFrame.js",
    analyseBestPractices: analyseBestPractices
  });
  measuresAcquisition.startMeasuring();
}


function MeasuresAcquisition(rules) {

  let measures;
  let localRules = rules;
  let nbGetHarTry = 0;

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
      "printStyleSheetsNumber": 0,
      "inlineStyleSheetsNumber": 0,
      "minifiedCssNumber": 0,
      "cssShouldBeMinified": [],
      "totalCss": 0,
      "emptySrcTagNumber": 0,
      "jsErrors": new Map(),
      "inlineJsScriptsNumber": 0,
      "minifiedJsNumber": 0,
      "jsShouldBeMinified": [],
      "totalJs": 0,
      "svgShouldBeOptimized": [],
      "imagesResizedInBrowser": [],
      "cssFontFace": []
    };
  }

  this.startMeasuring = function () {
    getNetworkMeasure();
    if (analyseBestPractices) getResourcesMeasure();
  }

  this.getMeasures = () => measures;

  this.aggregateFrameMeasures = function (frameMeasures) {
    measures.domSize += frameMeasures.domSize;
    computeEcoIndexMeasures(measures);

    if (analyseBestPractices) {
      measures.pluginsNumber += frameMeasures.pluginsNumber;

      measures.printStyleSheetsNumber += frameMeasures.printStyleSheetsNumber;
      if (measures.inlineStyleSheetsNumber < frameMeasures.inlineStyleSheetsNumber) measures.inlineStyleSheetsNumber = frameMeasures.inlineStyleSheetsNumber;
      measures.emptySrcTagNumber += frameMeasures.emptySrcTagNumber;
      if ((frameMeasures.inlineJsScript.length > 0) && (chrome.devtools.inspectedWindow.getResources)) analyseJsCode(frameMeasures.inlineJsScript, "inline");
      if (measures.inlineJsScriptsNumber < frameMeasures.inlineJsScriptsNumber) measures.inlineJsScriptsNumber = frameMeasures.inlineJsScriptsNumber;

      measures.imagesResizedInBrowser = frameMeasures.imagesResizedInBrowser;
      measures.cssFontFace = frameMeasures.cssFontFace;

      localRules.checkRule('plugins', measures);
      localRules.checkRule('printStyleSheets', measures);
      localRules.checkRule('emptySrcTag', measures);
      if (chrome.devtools.inspectedWindow.getResources) localRules.checkRule('jsValidate', measures);
      localRules.checkRule('externalizeCss', measures);
      localRules.checkRule('externalizeJs', measures);
      localRules.checkRule('dontResizeImageInBrowser', measures);
      localRules.checkRule('imageDownloadedNotDisplayed', measures);
      localRules.checkRule('useStandardTypefaces', measures);
    }
  }



  const getNetworkMeasure = () => {
    chrome.devtools.network.getHAR((har) => {

      console.log("Start network measure...");
      // only account for network traffic, filtering resources embedded through data urls
      let entries = har.entries.filter(entry => isNetworkResource(entry));

      // Get the "mother" url 
      if (entries.length > 0) measures.url = entries[0].request.url;
      else {
        // Bug with firefox  when we first get har.entries when starting the plugin , we need to ask again to have it 
        if (nbGetHarTry < 1) {
          debug(() => 'No entries, try again to get HAR in 1s');
          nbGetHarTry++;
          setTimeout(getNetworkMeasure, 1000);
        }
      }

      measures.entries = entries;
      if (entries.length) {
        measures.nbRequest = entries.length;
        entries.forEach(entry => {
          // If chromium : 
          // _transferSize represent the real data volume transfert 
          // while content.size represent the size of the page which is uncompress
          if (entry.response._transferSize) {
            measures.responsesSize += entry.response._transferSize;
            measures.responsesSizeUncompress += entry.response.content.size;
          }
          else {
            // In firefox , entry.response.content.size can sometimes be undefined 
            if (entry.response.content.size) measures.responsesSize += entry.response.content.size;
            //debug(() => `entry size = ${entry.response.content.size} , responseSize = ${measures.responsesSize}`);
          }
        });
        if (analyseBestPractices) {
          localRules.checkRule("styleSheets", measures);
          localRules.checkRule("httpRequests", measures);
          localRules.checkRule("domainsNumber", measures);
          localRules.checkRule("addExpiresOrCacheControlHeaders", measures);
          localRules.checkRule("useETags", measures);
          localRules.checkRule("compressHttp", measures);
          localRules.checkRule("maxCookiesLength", measures);
          localRules.checkRule("noCookieForStaticRessources", measures);
          localRules.checkRule("noRedirect", measures);
          localRules.checkRule("optimizeBitmapImages", measures);
        }
        computeEcoIndexMeasures(measures);
        refreshUI();
      }
    });
  }

  function getResourcesMeasure() {
    if (chrome.devtools.inspectedWindow.getResources) chrome.devtools.inspectedWindow.getResources((resources) => {
      resources.forEach(resource => {
        if (resource.url.startsWith("file") || resource.url.startsWith("http")) {
          if ((resource.type === 'script') || (resource.type === 'stylesheet') || (resource.type === 'image')) {
            let resourceAnalyser = new ResourceAnalyser(resource);
            resourceAnalyser.analyse();
          }
        }
      });
    });
  }

  function ResourceAnalyser(resource) {
    let resourceToAnalyse = resource;

    this.analyse = () => resourceToAnalyse.getContent(this.analyseJs);

    this.analyseJs = (code) => {
      // exclude from analyse the injected script 
      console.log("Resource = " + JSON.stringify(resource));
      if (resourceToAnalyse.type === 'script') {
        if (!resourceToAnalyse.url.includes("script/analyseFrame.js")) {
          analyseJsCode(code, resourceToAnalyse.url);
          analyseMinifiedJs(code, resourceToAnalyse.url);
        }
      }
      else if (resourceToAnalyse.type === 'stylesheet') analyseMinifiedCss(code, resourceToAnalyse.url);
      else if ((resourceToAnalyse.type === 'image') && isSvgUrl(resourceToAnalyse.url)) analyseSvg(code, resourceToAnalyse.url);
      refreshUI();
    }
  }

  function analyseMinifiedJs(code, url) {
    measures.totalJs++;
    if (isMinified(code)) measures.minifiedJsNumber++;
    else measures.jsShouldBeMinified.push(url);
    localRules.checkRule("minifiedJs", measures);
  }

  function analyseMinifiedCss(code, url) {
    measures.totalCss++;
    if (isMinified(code)) measures.minifiedCssNumber++;
    else measures.cssShouldBeMinified.push(url);
    localRules.checkRule("minifiedCss", measures);
  }

  function analyseJsCode(code, url) {
    let errorNumber = computeNumberOfErrorsInJSCode(code, url);
    if (errorNumber > 0) {
      measures.jsErrors.set(url, errorNumber);
      localRules.checkRule("jsValidate", measures);
      refreshUI();
    }
  }

  function analyseSvg(code, url) {
    console.log("analyse svg : " + url);
    if (!isSvgOptimized(window.atob(code)))  // code is in base64 , decode base64 data with atob
    {
      const svg = {url:url,size:code.length}
      measures.svgShouldBeOptimized.push(svg);
      localRules.checkRule("optimizeSvg", measures);
    }
    
  }
}

/**
Add to the history the result of an analyse
**/
function storeAnalysisInHistory() {
  let measures = measuresAcquisition.getMeasures();
  if (!measures) return;

  var analyse_history = [];
  var string_analyse_history = localStorage.getItem("analyse_history");
  var analyse_to_store = {
    resultDate: new Date(),
    url: measures.url,
    nbRequest: measures.nbRequest,
    responsesSize: Math.round(measures.responsesSize / 1000),
    domSize: measures.domSize,
    greenhouseGasesEmission: measures.greenhouseGasesEmission,
    waterConsumption: measures.waterConsumption,
    ecoIndex: measures.ecoIndex,
    grade: measures.grade
  };

  if (string_analyse_history) {
    analyse_history = JSON.parse(string_analyse_history);
    analyse_history.reverse();
    analyse_history.push(analyse_to_store);
    analyse_history.reverse();
  }
  else analyse_history.push(analyse_to_store);


  localStorage.setItem("analyse_history", JSON.stringify(analyse_history));
}
