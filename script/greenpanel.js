 

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. 
 *
 * @author didierfred@gmail.com
 */


requirejs.config({
    //By default load any module IDs from script
    baseUrl: 'script',
});

// Start the main app logic.
requirejs(['esprima'],

function   (esprima) {
  console.log("Start Green Module");
  var backgroundPageConnection;
  var nbRequest = 0 ;
  var responsesSize = 0;
  var responsesSizeUncompress =0;
  var aggregatedAnalysis;
  initPanel(); 

  function initPanel() {
        openBackgroundPageConnection();
	document.getElementById('launchAnalyse').addEventListener('click',function (e) {launchAnalyse();});
	//document.getElementById('viewHistory').addEventListener('click',function (e) {viewHistory();});	
	
  }


  function openBackgroundPageConnection() {
    // Create a connection to the background page
    backgroundPageConnection = chrome.runtime.connect({
      name: "greenDevPanel-page"
    });

    backgroundPageConnection.onMessage.addListener(function (pageAnalysis) {
      // Handle responses from the background page
      //console.log("Analyse received = " + JSON.stringify(pageAnalysis));
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
    document.getElementById("results").hidden= false; 
    document.getElementById("requestNumber").innerHTML = nbRequest;
    document.getElementById("responsesSize").innerHTML = responsesSize/1000 + "(" +responsesSizeUncompress/1000 + ")" ;
    document.getElementById("domSize").innerHTML = aggregatedAnalysis.domSize;
    document.getElementById("ecoIndex").innerHTML = aggregatedAnalysis.ecoIndex;
    document.getElementById("grade").innerHTML = '<span class="grade ' + aggregatedAnalysis.grade +'">' + aggregatedAnalysis.grade + '</span>';
    document.getElementById("plugins").innerHTML = aggregatedAnalysis.plugins.status +'(' + aggregatedAnalysis.plugins.pluginsNumber + ' plugin(s) found)';
    document.getElementById("styleSheets").innerHTML = aggregatedAnalysis.styleSheets.status +'(' + aggregatedAnalysis.styleSheets.styleSheetsNumber + ' stylesheet(s) found for at least on frame found)';
    document.getElementById("emptySrcTag").innerHTML = aggregatedAnalysis.emptySrcTag.status +'(' + aggregatedAnalysis.emptySrcTag.emptySrcTagNumber + ' empty src tag found)';
    document.getElementById("jsValidate").innerHTML = aggregatedAnalysis.jsValidate.status +'(' + aggregatedAnalysis.jsValidate.errorsNumber + ' error(s) found)';
  }


  function launchAnalyse() {

    initializeAggregatedAnalysis();
 
    // Launch analyse via injection of a script in each frame of the current tab
    backgroundPageConnection.postMessage({
      tabId: chrome.devtools.inspectedWindow.tabId,
      scriptToInject: "script/analyse.js"
    });
    
    getNetworkMesure(); 
    getResourcesMesure();
  }

  function getNetworkMesure() {
  chrome.devtools.network.getHAR(function(result) {
      var entries = result.entries;
      responsesSizeUncompress = 0 
      nbRequest = 0 ;
      responsesSize = 0;

      if (entries.length)  for (var i = 0; i < entries.length; ++i) {
        nbRequest++;
        //console.log("url = " + entries[i].request.url + ",transfert size=" +entries[i].response._transferSize);
        responsesSize+= entries[i].response._transferSize;
        responsesSizeUncompress += entries[i].response.content.size;
      }
    });
  }

  function getResourcesMesure() {
    chrome.devtools.inspectedWindow.getResources(function(resources) {
      for (var i = 0; i < resources.length; ++i) {
        console.log("url"+ i + " = " + resources[i].url + ",type=" + resources[i].type); 
        if (resources[i].type==='script') resources[i].getContent(function show(code) {
          try {
            const syntax = esprima.parse(code, { tolerant: true, sourceType: 'script', loc: true });
            if (syntax.errors) {
              if (syntax.errors.length > 0) {
                aggregatedAnalysis.jsValidate.status = "NOK";
                aggregatedAnalysis.jsValidate.errorsNumber += syntax.errors.length;
              }
              console.log("Nombre d'erreur" + syntax.errors.length);
            }
          } catch (err) {
          console.log(err);
          }
        });
      }
    });
  }

  function initializeAggregatedAnalysis()
  {
  aggregatedAnalysis  = {"domSize":0,
                       "ecoIndex":100,
		       "grade":'A',
                       "plugins":{"status":"OK","pluginsNumber":0},
                       "styleSheets":{"status":"OK","styleSheetsNumber":0},
                       "emptySrcTag":{"status":"OK","emptySrcTagNumber":0},
                       "jsValidate" : {"status":"OK","errorsNumber":0}
                      };
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

});


