
/*
 *  Copyright (C) 2019-2022  didierfred@gmail.com 
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
import { isNetworkResource, isDataResource, debug } from "./script/utils";
import { RulesManager } from "./script/rulesManager";
import { computeEcoIndex, getEcoIndexGrade, computeGreenhouseGasesEmissionfromEcoIndex , computeWaterConsumptionfromEcoIndex} from "./script/ecoIndex";

let backgroundPageConnection;
let currentRulesChecker;
let lastAnalyseStartingTime = 0;
let measuresAcquisition;
let analyseBestPractices = false;
let rulesManager = new RulesManager();
rulesManager.registerRules();

function initUI() {
  document.getElementById('launchAnalyse').addEventListener('click', (e) => launchAnalyse());
  document.getElementById('clearBrowserCache').addEventListener('click', (e) => clearBrowserCache());
  document.getElementById('saveAnalyse').addEventListener('click', (e) => storeAnalysisInHistory());
  document.getElementById('viewHistory').addEventListener('click', (e) => viewHistory());
  document.getElementById('analyseBestPracticesCheckBox').addEventListener('click', (e) => setAnalyseBestPractices());

  // Set best practices
  rulesManager.getRulesId().forEach(loadHTMLBestPractice);

  // Set a listener for each plus button (detail best practice )
  let links = document.getElementsByClassName("bestPracticeLink");
  for (var i = 0; i < links.length; i++) {
    const id = links.item(i).id;
    document.getElementById(id).addEventListener('click', (e) => {
      //On désactive le comportement du lien
      e.preventDefault();
      switchElementVisibiliy(id + "TextRow");
    });
  }

  // Set a listener for each plus link ( detail comment )
  links = document.getElementsByClassName("detailCommentLink");
  for (var i = 0; i < links.length; i++) {
    const id = links.item(i).id;
    document.getElementById(id).addEventListener('click', (e) => {
      //On désactive le comportement du lien
      e.preventDefault();
      switchElementVisibiliy(id + "TextRow");
    });
  }
}

function loadHTMLBestPractice(ruleId) {
  let html = "";
  html += "<td>";
  html += "<a href=\"#\" id=\"" + ruleId + "_Detail\" class=\"bestPracticeLink\">";
  html += browser.i18n.getMessage("rule_" + ruleId);
  html += "</a>";
  html += "</td>";
  html += "<td style=\"width:30px\"> <img id=\"" + ruleId + "_status\" src=\"icons/A.png\"></td>";
  html += "<td> <span id=\"" + ruleId + "_comment\"> </span> <a href=\"#\" id=\"" + ruleId + "_DetailComment\" class=\"detailCommentLink\" hidden><span class=\"caret\"></span></a></td>";

  var newTR = document.createElement("tr");
  newTR.innerHTML = html;
  document.getElementById("bestPracticesTable").appendChild(newTR);


  html = "";
  html += "<td colspan=\"3\">";
  html += "<p class=\"bestPracticeDetail\">" + browser.i18n.getMessage("rule_" + ruleId + "_DetailDescription"); "</p>";
  html += "</td>";

  newTR = document.createElement("tr");
  newTR.id = ruleId + "_DetailTextRow";
  newTR.hidden = true;
  newTR.innerHTML = html;
  document.getElementById("bestPracticesTable").appendChild(newTR);

  html = "";
  html += "<td colspan=\"3\">";
  html += "<p id=\"" + ruleId + "_DetailCommentText\" class=\"bestPracticeDetailComment\"> </p>";
  html += "</td>";

  newTR = document.createElement("tr");
  newTR.id = ruleId + "_DetailCommentTextRow";
  newTR.hidden = true;
  newTR.innerHTML = html;
  document.getElementById("bestPracticesTable").appendChild(newTR);

}

function setUnsupportedRuleAnalyse(ruleId) {
  console.log("ruleId=" + ruleId);
  document.getElementById(ruleId + "_status").src = "";
  document.getElementById(ruleId + "_comment").innerHTML = browser.i18n.getMessage("unsupportedRuleAnalyse");
}


function refreshUI() {
  const measures = measuresAcquisition.getMeasures();
  document.getElementById("ecoIndexView").removeAttribute('hidden');
  document.getElementById("requestNumber").innerHTML = measures.nbRequest;

  if (measures.responsesSizeUncompress != 0) document.getElementById("responsesSize").innerHTML = Math.round(measures.responsesSize / 1000) + " (" + Math.round(measures.responsesSizeUncompress / 1000) + ")";
  else document.getElementById("responsesSize").innerHTML = Math.round(measures.responsesSize / 1000);

  document.getElementById("domSize").innerHTML = measures.domSize;
  document.getElementById("ecoIndex").innerHTML = measures.ecoIndex;
  document.getElementById("grade").innerHTML = '<span class="grade ' + measures.grade + '">' + measures.grade + '</span>';
  document.getElementById("waterConsumption").innerHTML = measures.waterConsumption;
  document.getElementById("greenhouseGasesEmission").innerHTML = measures.greenhouseGasesEmission;
  if (analyseBestPractices) {
    document.getElementById("bestPracticesView").hidden = false;
    currentRulesChecker.getAllRules().forEach(showEcoRuleOnUI);
  }
  else document.getElementById("bestPracticesView").hidden = true;
}

function showEcoRuleOnUI(rule) {
  if (rule !== undefined) {
    document.getElementById(rule.id + "_status").src = "icons/" + rule.complianceLevel + ".png";
    document.getElementById(rule.id + "_comment").innerHTML = rule.comment;

    if (rule.detailComment.length > 0) {
      document.getElementById(rule.id + "_DetailComment").hidden = false;
      document.getElementById(rule.id + "_DetailCommentText").innerHTML = rule.detailComment;
    }
    else {
      if (document.getElementById(rule.id + "_DetailComment")) {
        document.getElementById(rule.id + "_DetailComment").hidden = true;
        document.getElementById(rule.id + "_DetailCommentText").innerHTML = "";
        document.getElementById(rule.id + "_DetailCommentTextRow").hidden = true;
      }
    }

  }
}

function viewHistory() {
  if (browser.tabs) browser.tabs.query({ currentWindow: true }, loadHistoryTab);
  // browser.tabs is not accessible in old chromium version 
  else window.open(browser.runtime.getURL("/histo.html"));
}


function loadHistoryTab(tabs) {
  var history_tab;
  // search for config tab
  for (let tab of tabs) {
    if (tab.url.startsWith(browser.runtime.getURL(""))) history_tab = tab;
  }
  // config tab exits , put the focus on it
  if (history_tab) {
    browser.tabs.reload(history_tab.id);
    browser.tabs.update(history_tab.id, { active: true });
  }
  // else create a new tab
  else browser.tabs.create({ url: browser.runtime.getURL("/histo.html") });
}



function setAnalyseBestPractices() {
  analyseBestPractices = document.getElementById('analyseBestPracticesCheckBox').checked;
  if (!analyseBestPractices) document.getElementById("bestPracticesView").hidden = true;
}

function switchElementVisibiliy(id) {
  if (document.getElementById(id).hidden) document.getElementById(id).hidden = false;
  else document.getElementById(id).hidden = true;

}

initPanel();

function initPanel() {  
  openBackgroundPageConnection();
  initUI();
  let notCompatibleRules = rulesManager.getRulesNotCompatibleWithCurrentBrowser();
  notCompatibleRules.forEach(rule => setUnsupportedRuleAnalyse(rule));
}

function openBackgroundPageConnection() {
  backgroundPageConnection = browser.runtime.connect({
    name: "greenDevPanel-page"
  });
  backgroundPageConnection.onMessage.addListener((frameMeasures) => {
    handleResponseFromBackground(frameMeasures);
    refreshUI();
  });

  backgroundPageConnection.onDisconnect.addListener( () => {
    console.warn("Background connection is closed , try to open it again ");
    openBackgroundPageConnection();
  })
}

function handleResponseFromBackground(frameMeasures) {
  if (isOldAnalyse(frameMeasures.analyseStartingTime)) {
    debug(() => `Analyse is too old for url ${frameMeasures.url} , time = ${frameMeasures.analyseStartingTime}`);
    return;
  }
  measuresAcquisition.aggregateFrameMeasures(frameMeasures);
}


function clearBrowserCache()
{
  // calling the method browser.browsingData.remove() from the devtool is not working for firefox 
  // we need to do it form the background script , so we send a message to the background script to do it   
  backgroundPageConnection.postMessage({
    clearBrowserCache: true
  });

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

  let scriptToInject = "analyseFrame.js";
  if (analyseBestPractices) scriptToInject = "analyseFrameWithBestPractices.js"
  // Launch analyse via injection of a script in each frame of the current tab
  backgroundPageConnection.postMessage({
    clearBrowserCache: false,
    tabId: browser.devtools.inspectedWindow.tabId,
    scriptToInject: scriptToInject
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
      "printStyleSheetsNumber": 0,
      "inlineStyleSheetsNumber": 0,
      "inlineJsScriptsNumber": 0,
      "imagesResizedInBrowser": [],
      "bestPracticeDetails": {}
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

      measures.printStyleSheetsNumber += frameMeasures.printStyleSheetsNumber;
      if (measures.inlineStyleSheetsNumber < frameMeasures.inlineStyleSheetsNumber) measures.inlineStyleSheetsNumber = frameMeasures.inlineStyleSheetsNumber;
      if ((frameMeasures.inlineJsScript.length > 0) && (browser.devtools.inspectedWindow.getResources)) {
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
    browser.devtools.network.getHAR((har) => {

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
              measures.responsesSize += entry.response.bodySize?entry.response.bodySize:0;
              measures.responsesSizeUncompress += entry.response.content.size?entry.response.content.size:0;
            }

        });
        if (analyseBestPractices) localRulesChecker.sendEvent('harReceived',measures);

        computeEcoIndexMeasures(measures);
        refreshUI();
      }
    });
  }


  function getResourcesMeasure() {
    if (browser.devtools.inspectedWindow.getResources) browser.devtools.inspectedWindow.getResources((resources) => {
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
      if ((resourceToAnalyse.type === 'script') && (resourceToAnalyse.url.includes("analyseFrame.js"))) return;

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
