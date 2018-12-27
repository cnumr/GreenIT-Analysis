 

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. 
 *
 * @author didierfred@gmail.com
 */


var backgroundPageConnection;
var quantiles_dom = [0, 47, 75, 159, 233, 298, 358, 417, 476, 537, 603, 674, 753, 843, 949, 1076, 1237, 1459, 1801, 2479, 594601];
var quantiles_req = [0, 2, 15, 25, 34, 42, 49, 56, 63, 70, 78, 86, 95, 105, 117, 130, 147, 170, 205, 281, 3920];
var quantiles_size = [0, 1.37, 144.7, 319.53, 479.46, 631.97, 783.38, 937.91, 1098.62, 1265.47, 1448.32, 1648.27, 1876.08, 2142.06, 2465.37, 2866.31, 3401.59, 4155.73, 5400.08, 8037.54, 223212.26];
  

var nbRequest = 0 ;
var responsesSize = 0;
var aggregatedAnalysis;


window.onload = function() { initPanel(); };


function initPanel() {
	document.getElementById('launchAnalyse').addEventListener('click',function (e) {launchAnalyse();});
	//document.getElementById('viewHistory').addEventListener('click',function (e) {viewHistory();});	
	openBackgroundPageConnection();
}



function launchAnalyse() {

  // Relay the tab ID to the background page
  backgroundPageConnection.postMessage({
    tabId: chrome.devtools.inspectedWindow.tabId,
    scriptToInject: "script/analyse.js"
  });

  chrome.devtools.network.getHAR(function(result) {
    var entries = result.entries;
    var responsesSizeUncompress = 0 
    nbRequest = 0 ;
    responsesSize = 0;
    initializeAggregatedAnalysis();

    if (entries.length)  for (var i = 0; i < entries.length; ++i) {
      nbRequest++;
      //console.log("url = " + entries[i].request.url + ",transfert size=" +entries[i].response._transferSize);
      responsesSize+= entries[i].response._transferSize;
      responsesSizeUncompress += entries[i].response.content.size;
    }

    document.getElementById("results").hidden= false;
    document.getElementById("requestNumber").innerHTML = nbRequest;
    document.getElementById("responsesSize").innerHTML = responsesSize/1000 + "(" +responsesSizeUncompress/1000 + ")" ;
    

  });
}

function initializeAggregatedAnalysis()
{
aggregatedAnalysis  = {"domSize":0,
                       "ecoIndex":100,
		       "grade":'A',
                       "plugins":{"status":"OK","pluginsNumber":0},
                       "styleSheets":{"status":"OK","styleSheetsNumber":0},
                       "emptySrcTag":{"status":"OK","emptySrcTagNumber":0}
                      };
}

function openBackgroundPageConnection() {
  // Create a connection to the background page
  backgroundPageConnection = chrome.runtime.connect({
    name: "greenDevPanel-page"
  });

  backgroundPageConnection.onMessage.addListener(function (pageAnalysis) {
    // Handle responses from the background page
    console.log("Analyse received = " + JSON.stringify(pageAnalysis));
    aggregatePageAnalysis(pageAnalysis);
    refreshUI();
  });
}

function aggregatePageAnalysis(pageAnalysis) {
  aggregatedAnalysis.domSize += pageAnalysis.domSize;
  aggregatedAnalysis.ecoIndex = calculEcoIndex(aggregatedAnalysis.domSize,nbRequest,Math.round(responsesSize/1000));
  aggregatedAnalysis.grade = getEcoIndexGrade(aggregatedAnalysis.ecoIndex);
 
  aggregatedAnalysis.plugins.pluginsNumber += pageAnalysis.pluginsNumber;
  if (aggregatedAnalysis.plugins.pluginsNumber>0) aggregatedAnalysis.plugins.status = "NOK";
 
  if (aggregatedAnalysis.styleSheets.styleSheetsNumber < pageAnalysis.styleSheetsNumber) {
    aggregatedAnalysis.styleSheets.styleSheetsNumber = pageAnalysis.styleSheetsNumber;
    if (aggregatedAnalysis.styleSheets.styleSheetsNumber>2) aggregatedAnalysis.styleSheets.status = "NOK";
  }
 
 aggregatedAnalysis.emptySrcTag.emptySrcTagNumber += pageAnalysis.emptySrcTagNumber;
  if (aggregatedAnalysis.emptySrcTag.emptySrcTagNumber>0) aggregatedAnalysis.emptySrcTag.status = "NOK";
}

function refreshUI() {
  document.getElementById("domSize").innerHTML = aggregatedAnalysis.domSize;
  document.getElementById("ecoIndex").innerHTML = aggregatedAnalysis.ecoIndex;
  document.getElementById("grade").innerHTML = '<span class="grade ' + aggregatedAnalysis.grade +'">' + aggregatedAnalysis.grade + '</span>';
  document.getElementById("plugins").innerHTML = aggregatedAnalysis.plugins.status +'(' + aggregatedAnalysis.plugins.pluginsNumber + ' plugin(s) found)';
  document.getElementById("styleSheets").innerHTML = aggregatedAnalysis.styleSheets.status +'(' + aggregatedAnalysis.styleSheets.styleSheetsNumber + ' stylesheet(s) found for at least on frame found)';
  document.getElementById("emptySrcTag").innerHTML = aggregatedAnalysis.emptySrcTag.status +'(' + aggregatedAnalysis.emptySrcTag.emptySrcTagNumber + ' empty src tag found)';
}

/**
Calcul ecoIndex based on formula from web site www.ecoindex.fr
**/
function calculEcoIndex(dom,req,size)
{
var q_dom= calculQuantile(quantiles_dom,dom);
var q_req= calculQuantile(quantiles_req,req);
var q_size= calculQuantile(quantiles_size,size);

return Math.round(100 - 5 * (3*q_dom + 2*q_req + q_size)/6);
}

function calculQuantile(quantiles,value)
{
for (var i=1;i<quantiles.length;i++)
	{
	if (value<quantiles[i]) return (i + (value-quantiles[i-1])/(quantiles[i] -quantiles[i-1]));
	}
return quantiles.length;
}


function getEcoIndexGrade(ecoIndex)
{
if (ecoIndex > 75) return "A";
if (ecoIndex > 65) return "B";
if (ecoIndex > 50) return "C";
if (ecoIndex > 35) return "D";
if (ecoIndex > 20) return "E";
if (ecoIndex > 5) return "F";
return "G";
}













function viewHistory()
	{
	//var promise_tabs =  browser.tabs.query({currentWindow: true});
	//promise_tabs.then(loadHistoryTab);
	}
	
	
function loadHistoryTab(tabs)
{
	var history_tab;
	for (let tab of tabs) 
		{
		console.log(tab.url);
		if (tab.url.startsWith(browser.extension.getURL(""))) history_tab = tab;
		}
    if (history_tab) 
		{
		console.log("history tab exist")
		chrome.tabs.reload(history_tab.id);
		chrome.tabs.update(history_tab.id,{active:true})
		}
	else	
		{
		chrome.tabs.create({url:"history.html"});
		console.log("no history tab")
		}
		

}




/**
Add to the history the result of an analyse
**/
function storeInHistory(url,req,kbyte,domsize,eco_index,note)
{
var analyse_history;
var string_analyse_history = localStorage.getItem("analyse_history");

if (string_analyse_history)
	{
	analyse_history =JSON.parse(string_analyse_history);
	analyse_history.reverse();
	analyse_history.push({result_date:new Date(),url:url,req:req,kbyte:kbyte,domsize:domsize,eco_index:eco_index,note:note});
	analyse_history.reverse();
	}
else analyse_history = [{result_date:new Date(),url:url,req:req,kbyte:kbyte,domsize:domsize,eco_index:eco_index,note:note}];

localStorage.setItem("analyse_history",JSON.stringify(analyse_history));
}





