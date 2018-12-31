 

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
  var ecoRules;
  var measures;

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

    backgroundPageConnection.onMessage.addListener(function (frameMeasures) {
      // Handle responses from the background page
      //console.log("Analyse received = " + JSON.stringify(frameMeasures));
      aggregateFrameMeasures(frameMeasures);
      refreshUI();
    });
  }

  function aggregateFrameMeasures(frameMeasures) {
    measures.domSize += frameMeasures.domSize;
    measures.ecoIndex = calculEcoIndex(measures.domSize,measures.nbRequest,Math.round(measures.responsesSize/1000));
    measures.grade = getEcoIndexGrade(measures.ecoIndex);
 
    measures.pluginsNumber += frameMeasures.pluginsNumber;
    if (measures.pluginsNumber>0) {
      ecoRules.get("plugins").status = "NOK";
      ecoRules.get("plugins").comment = measures.pluginsNumber + " plugin(s) found";
    }
 
    if (measures.styleSheetsNumber < frameMeasures.styleSheetsNumber) {
      measures.styleSheetsNumber = frameMeasures.styleSheetsNumber;
      if (measures.styleSheetsNumber>2) {
        ecoRules.get("styleSheets").status = "NOK";
        ecoRules.get("styleSheets").comment = measures.styleSheetsNumber + " stylesheets found for at least one frame";
      }
    }

    measures.printStyleSheetsNumber += frameMeasures.printStyleSheetsNumber;
    if (measures.printStyleSheetsNumber > 0 ) {
      ecoRules.get("printStyleSheets").status = "OK";
      ecoRules.get("printStyleSheets").comment = measures.printStyleSheetsNumber + " print StyleSheet(s) found";
    }


    measures.emptySrcTagNumber += frameMeasures.emptySrcTagNumber;
    if (measures.emptySrcTagNumber>0) {
      ecoRules.get("emptySrcTag").status = "NOK";
      ecoRules.get("emptySrcTag").comment = measures.emptySrcTagNumber + " empty src tag(s) found";
    }
    
    if (frameMeasures.inlineJsScript.length>0 ) analyseJs(frameMeasures.inlineJsScript);
   
  }

  function refreshUI() {
    document.getElementById("results").hidden= false; 
    document.getElementById("requestNumber").innerHTML = measures.nbRequest;
    document.getElementById("responsesSize").innerHTML = measures.responsesSize/1000 + "(" +measures.responsesSizeUncompress/1000 + ")" ;
    document.getElementById("domSize").innerHTML = measures.domSize;
    document.getElementById("ecoIndex").innerHTML = measures.ecoIndex;
    document.getElementById("grade").innerHTML = '<span class="grade ' + measures.grade +'">' + measures.grade + '</span>';
    ecoRules.forEach(showEcoRuleOnUI) ;
  }

  function showEcoRuleOnUI(ecoRule) {
    if (ecoRule!== undefined) {
      document.getElementById(ecoRule.ruleId + "_status").src = "icons/" + ecoRule.status+ ".png";
      document.getElementById(ecoRule.ruleId + "_comment").innerHTML = ecoRule.comment;
    }
  }


  function launchAnalyse() {

    initializeMeasures();
    initializeEcoRules() 
 
    // Launch analyse via injection of a script in each frame of the current tab
    backgroundPageConnection.postMessage({
      tabId: chrome.devtools.inspectedWindow.tabId,
      scriptToInject: "script/analyse.js"
    });
    
    getNetworkMeasure(); 
    getResourcesMeasure();
  }


  function initializeMeasures()
  {
  measures  = {"domSize":0,
               "nbRequest":0,
               "responsesSize":0,
               "responsesSizeUncompress":0,
               "ecoIndex":100,
	       "grade":'A',
               "pluginsNumber":0,
               "styleSheetsNumber":0,
               "printStyleSheetsNumber":0,
               "emptySrcTagNumber":0,
               "jsErrorsNumber":0
              };
  }


  function initializeEcoRules() {
    ecoRules = new Map();
    ecoRules.set("plugins",{ruleId:"plugins",status:"OK",comment:"No plugin found"});
    ecoRules.set("styleSheets",{ruleId:"styleSheets",status:"OK",comment:"Not more that 2 stylesheets per frame found"});
    ecoRules.set("printStyleSheets",{ruleId:"printStyleSheets",status:"NOK",comment:"Not print stylesheet found"});
    ecoRules.set("emptySrcTag",{ruleId:"emptySrcTag",status:"OK",comment:"No empty src tags found"});
    ecoRules.set("jsValidate",{ruleId:"jsValidate",status:"OK",comment:"Javascript validate"});
    ecoRules.set("httpRequests",{ruleId:"httpRequests",status:"OK",comment:""});
  }


  function getNetworkMeasure() {
  chrome.devtools.network.getHAR(function(result) {
      var entries = result.entries;
      if (entries.length) {
        measures.nbRequest = entries.length;
        for (var i = 0; i < entries.length; ++i) {
          measures.responsesSize+= entries[i].response._transferSize;
          measures.responsesSizeUncompress += entries[i].response.content.size;
        }
        ecoRules.get("httpRequests").comment = measures.nbRequest + " HTTP request(s) "
        if (measures.nbRequest > 26) ecoRules.get("httpRequests").status = "NOK";
        refreshUI();
          
      }
    });
  }

  function getResourcesMeasure() {
    chrome.devtools.inspectedWindow.getResources(function(resources) {
      for (let i = 0; i < resources.length; ++i) {
        //console.log("url"+ i + " = " + resources[i].url + ",type=" + resources[i].type); 
        console.log("resource=" + JSON.stringify(resources[i]));
        let resourceAnalyser = new ResourceAnalyser(resources[i]);
        if (resources[i].type==='script') resourceAnalyser.analyse();
      }
    });
  }


function analyseJs(code) {
  try {
    const syntax = esprima.parse(code, { tolerant: true, sourceType: 'script', loc: true });
    if (syntax.errors) {
      if (syntax.errors.length > 0) {
        measures.jsErrorsNumber += syntax.errors.length;
        console.log("Inline JS: " + syntax.errors.length + " errors");
      }
    }
  } catch (err) {
    measures.jsErrorsNumber++;
    console.log("Inline JS: " + err);
    //console.log("code=" + code);
  }
  if (measures.jsErrorsNumber>0) {
    ecoRules.get("jsValidate").status="NOK";
    ecoRules.get("jsValidate").comment = measures.jsErrorsNumber + " javascript error(s) found";
  }
  refreshUI();
}


function ResourceAnalyser(resource) {
  var resourceToAnalyse = resource ;

  this.analyse = function() {
    resourceToAnalyse.getContent(this.analyseJs);
    };

  this.analyseJs = function(code) {
    console.log("launch analyse for url = " + resourceToAnalyse.url);
    try {
      const syntax = esprima.parse(code, { tolerant: true, sourceType: 'script', loc: true });
      if (syntax.errors) {
        if (syntax.errors.length > 0) {
          measures.jsErrorsNumber += syntax.errors.length;
          console.log("url = " + resourceToAnalyse.url + " : " + syntax.errors.length + " errors");
        } 
      }
    } 
    catch (err) {
      measures.jsErrorsNumber++;
      console.log("url = " + resourceToAnalyse.url + " : " + err);
    }
    if (measures.jsErrorsNumber>0) {
      ecoRules.get("jsValidate").status="NOK";
      ecoRules.get("jsValidate").comment = measures.jsErrorsNumber + " javascript error(s) found";
    }
    console.log("url=" + resourceToAnalyse.url + " , Nombre d'erreur" + measures.jsErrorsNumber);
    refreshUI();
  }
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


