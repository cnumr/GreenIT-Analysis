 

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. 
 *
 * @author didierfred@gmail.com
 * @version 0.1
 */


var started = "off";
var backgroundPageConnection;
var quantiles_dom = [0, 47, 75, 159, 233, 298, 358, 417, 476, 537, 603, 674, 753, 843, 949, 1076, 1237, 1459, 1801, 2479, 594601];
var quantiles_req = [0, 2, 15, 25, 34, 42, 49, 56, 63, 70, 78, 86, 95, 105, 117, 130, 147, 170, 205, 281, 3920];
var quantiles_size = [0, 1.37, 144.7, 319.53, 479.46, 631.97, 783.38, 937.91, 1098.62, 1265.47, 1448.32, 1648.27, 1876.08, 2142.06, 2465.37, 2866.31, 3401.59, 4155.73, 5400.08, 8037.54, 223212.26];
  

var nbRequest = 0 ;
var responsesSize = 0;



window.onload = function() {
	document.getElementById('launchAnalyse').addEventListener('click',function (e) {launchAnalyse();});
	document.getElementById('viewHistory').addEventListener('click',function (e) {viewHistory();});
	started = localStorage.getItem("started");
	if (started=="on") document.getElementById("start_stop").value = "Stop";	
	openBackgroundPageConnection();
} ;


function openBackgroundPageConnection() {
  // Create a connection to the background page
  backgroundPageConnection = chrome.runtime.connect({
    name: "greenDevPanel-page"
  });

  backgroundPageConnection.onMessage.addListener(function (message) {
    // Handle responses from the background page
    const ecoIndex = calculEcoIndex(message,nbRequest,Math.round(responsesSize/1000));
    const grade = getGrade(ecoIndex);
    document.getElementById("domSize").innerHTML = message;
    document.getElementById("ecoIndex").innerHTML = ecoIndex;
    document.getElementById("grade").innerHTML = '<span class="grade ' + grade +'">' + grade + '</span>';
  });
}



function launchAnalyse() {
console.log("view result");
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

    if (entries.length)  for (var i = 0; i < entries.length; ++i) {
      nbRequest++;
      //console.log("url = " + entries[i].request.url + ",body size=" + entries[i].response.bodySize , "headerSize=" + entries[i].response.headersSize );
      //responsesSize += entries[i].response.bodySize + entries[i].response.headersSize ; 
      console.log("url = " + entries[i].request.url + ",transfert size=" +entries[i].response._transferSize);
      responsesSize+= entries[i].response._transferSize;
      responsesSizeUncompress += entries[i].response.content.size;
    }

    document.getElementById("results").hidden= false;
    document.getElementById("requestNumber").innerHTML = nbRequest;
    document.getElementById("responsesSize").innerHTML = responsesSize + "(" +responsesSizeUncompress + ")" ;
    

  });
}






function calculQuantile(quantiles,value)
{
for (var i=1;i<quantiles.length;i++)
	{
	if (value<quantiles[i]) return (i + (value-quantiles[i-1])/(quantiles[i] -quantiles[i-1]));
	}
return quantiles.length;
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



function getGrade(eco_index)
{
if (eco_index > 75) return "A";
if (eco_index > 65) return "B";
if (eco_index > 50) return "C";
if (eco_index > 35) return "D";
if (eco_index > 20) return "E";
if (eco_index > 5) return "F";
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





