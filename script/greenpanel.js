
/*
 *  Copyright (C) 2019  didierfred@gmail.com 
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as published
 *  by the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

let backgroundPageConnection;
let currentRulesChecker;
let lastAnalyseStartingTime = 0;
let measuresAcquisition;
let analyseBestPractices = false;

initPanel();

function initPanel() {  
  openBackgroundPageConnection();
  initUI();
  let notCompatibleRules = rulesManager.getRulesNotCompatibleWithCurrentBrowser();
  notCompatibleRules.forEach(rule => setUnsupportedRuleAnalyse(rule));
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
  const rawEcoIndex = computeEcoIndex(measures.domSize, measures.nbRequest, Math.round(measures.responsesSize / 1000));
  measures.ecoIndex = rawEcoIndex.toFixed(2);
  measures.waterConsumption = computeWaterConsumptionfromEcoIndex(rawEcoIndex);
  measures.greenhouseGasesEmission = computeGreenhouseGasesEmissionfromEcoIndex(rawEcoIndex);
  measures.grade = getEcoIndexGrade(rawEcoIndex);
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
  currentRulesChecker = rulesManager.getNewRulesChecker();
  measuresAcquisition = new MeasuresAcquisition(currentRulesChecker);
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
  let localRulesChecker = rules;
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
      "emptySrcTagNumber": 0,
      "inlineJsScriptsNumber": 0,
      "imagesResizedInBrowser": []
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
      if ((frameMeasures.inlineJsScript.length > 0) && (chrome.devtools.inspectedWindow.getResources)) {
        const resourceContent = { 
          url:"inline js",
          type:"script",
          content:frameMeasures.inlineJsScript
        }
        localRulesChecker.sendEvent('resourceContentReceived',measures,resourceContent);
      }
      if (measures.inlineJsScriptsNumber < frameMeasures.inlineJsScriptsNumber) measures.inlineJsScriptsNumber = frameMeasures.inlineJsScriptsNumber;

      measures.imagesResizedInBrowser = frameMeasures.imagesResizedInBrowser;

      localRulesChecker.sendEvent('frameMeasuresReceived',measures);

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
      measures.dataEntries = har.entries.filter(entry => isDataResource(entry)); // embeded data urls

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
        if (analyseBestPractices) localRulesChecker.sendEvent('harReceived',measures);

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

    this.analyse = () => resourceToAnalyse.getContent(this.analyseContent);

    this.analyseContent = (code) => {
      // exclude from analyse the injected script 
      if ((resourceToAnalyse.type === 'script') && (resourceToAnalyse.url.includes("script/analyseFrame.js"))) return;

      let resourceContent = {
        url: resourceToAnalyse.url,
        type : resourceToAnalyse.type,
        content: code
      };
      localRulesChecker.sendEvent('resourceContentReceived',measures,resourceContent);
      
      refreshUI();
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
