


/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. 
 *
 * @author didierfred@gmail.com
 */

"use strict";

var connections = {};

var analysis = {
  nbRequest:0,
  byteTotal:0,
  domSize:0,
  url:"",
  pluginNumber:0
}


chrome.runtime.onMessage.addListener(notify);


console.log("start background process");

// Listen to message from devTools
chrome.runtime.onConnect.addListener(function(devToolsConnection) {
    console.log("received onConnect");
    // assign the listener function to a variable so we can remove it later
    var devToolsListener = function(message, sender, sendResponse) {
        // Inject a content script into the identified tab
	console.log("received script to execute form tabId " + message.tabId);
        if (!connections[message.tabId]) connections[message.tabId] = devToolsConnection;
        analysis.domSize=0;
        chrome.tabs.executeScript(message.tabId,
            { file: message.scriptToInject , allFrames:true});
    }
    // add the listener
    devToolsConnection.onMessage.addListener(devToolsListener);

    devToolsConnection.onDisconnect.addListener(function(port) {
        devToolsConnection.onMessage.removeListener(devToolsListener);
        var tabs = Object.keys(connections);
        for (var i=0, len=tabs.length; i < len; i++) {
          if (connections[tabs[i]] == port) {
            delete connections[tabs[i]]
            break;
          }
        }
    });

    
});









/*
* Listen for message form ecoindex.js
* if message is on : start the record 
* if message is off : stop the record
* if message is analysis.domSize, calcul eco_index and store results in localstorage
**/
function notify(request, sender, sendResponse) {
  
  var json_message = JSON.parse(request); 
 
 if (json_message.url) {
    console.log("End analysis for url : "+ json_message.url);
    console.log("Dom Size received: "+ json_message.pageAnalysis.domSize);
    analysis.domSize+=json_message.pageAnalysis.domSize;
    analysis.pluginNumber+=json_message.pageAnalysis.pluginNumber;
    console.log("Dom Size total: "+ analysis.domSize);		
  }

  if (sender.tab) {
    var tabId = sender.tab.id;
    if (tabId in connections) connections[tabId].postMessage(analysis.domSize);
    else console.log("Tab not found in connection list.");
  }
  else console.log("sender.tab not defined.");
}





function computePagesAnalysis() {
  console.log("compute analysis");
  var eco_index= calculEcoIndex(analysis.domSize,analysis.nbRequest,Math.round(analysis.byteTotal/1000));
  console.log("ecoindex=" + eco_index);
  localStorage.setItem("eco_index",eco_index);
  localStorage.setItem("note",getNote(eco_index));
  localStorage.setItem("dom_size",analysis.domSize);
  storeInHistory(analysis.url,analysis.nbRequest,Math.round(analysis.byteTotal/1000),analysis.domSize,eco_index,getNote(eco_index));
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







