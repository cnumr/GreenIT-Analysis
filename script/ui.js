
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. 
 *
 * @author didierfred@gmail.com
 */

function initUI() {
  document.getElementById('launchAnalyse').addEventListener('click', (e) => launchAnalyse());
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
  html += "<td style=\"width:30px\"> <img id=\"" + ruleId + "_status\" src=\"icons/OK.png\"></td>";
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
  window.open("https://github.com/didierfred/GreenIT-Analysis/blob/master/README.md");
}


function setAnalyseBestPractices() {
  analyseBestPractices = document.getElementById('analyseBestPracticesCheckBox').checked;
  if (!analyseBestPractices) document.getElementById("bestPracticesView").hidden = true;
}

function switchElementVisibiliy(id) {
  if (document.getElementById(id).hidden) document.getElementById(id).hidden = false;
  else document.getElementById(id).hidden = true;

}
