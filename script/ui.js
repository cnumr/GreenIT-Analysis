/*
 *  Copyright (C) 2019-2021  didierfred@gmail.com 
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

function initUI() {
  document.getElementById('launchAnalyse').addEventListener('click', (e) => launchAnalyse());
  document.getElementById('clearBrowserCache').addEventListener('click', (e) => clearBrowserCache());
  document.getElementById('saveAnalyse').addEventListener('click', (e) => storeAnalysisInHistory());
  document.getElementById('viewHistory').addEventListener('click', (e) => viewHistory());
  document.getElementById('helpButton').addEventListener('click', (e) => viewHelp());
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
  html += chrome.i18n.getMessage("rule_" + ruleId);
  html += "</a>";
  html += "</td>";
  html += "<td style=\"width:30px\"> <img id=\"" + ruleId + "_status\" src=\"icons/A.png\"></td>";
  html += "<td> <span id=\"" + ruleId + "_comment\"> </span> <a href=\"#\" id=\"" + ruleId + "_DetailComment\" class=\"detailCommentLink\" hidden>.....</a> </td>";

  var newTR = document.createElement("tr");
  newTR.innerHTML = html;
  document.getElementById("bestPracticesTable").appendChild(newTR);


  html = "";
  html += "<td colspan=\"3\">";
  html += "<p class=\"bestPracticeDetail\">" + chrome.i18n.getMessage("rule_" + ruleId + "_DetailDescription"); "</p>";
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
  document.getElementById(ruleId + "_comment").innerHTML = chrome.i18n.getMessage("unsupportedRuleAnalyse");
}


function refreshUI() {
  const measures = measuresAcquisition.getMeasures();
  document.getElementById("ecoIndexView").hidden = false;
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
  if (chrome.tabs) chrome.tabs.query({ currentWindow: true }, loadHistoryTab);
  // chrome.tabs is not accessible in old chromium version 
  else window.open("history.html");
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
  window.open("https://github.com/cnumr/GreenIT-Analysis/blob/V2.1.1/README.md");
}


function setAnalyseBestPractices() {
  analyseBestPractices = document.getElementById('analyseBestPracticesCheckBox').checked;
  if (!analyseBestPractices) document.getElementById("bestPracticesView").hidden = true;
}

function switchElementVisibiliy(id) {
  if (document.getElementById(id).hidden) document.getElementById(id).hidden = false;
  else document.getElementById(id).hidden = true;

}
