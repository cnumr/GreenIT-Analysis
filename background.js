


/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. 
 *
 * @author didierfred@gmail.com
 */

"use strict";

var connections = {};


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
* Listen for message form tab and send it to devtools 
**/
function notify(message, sender, sendResponse) {

  if (sender.tab) {
    var tabId = sender.tab.id;
    if (tabId in connections) connections[tabId].postMessage(message);
    else console.warn("Tab not found in connection list.");
  }
  else console.warn("sender.tab not defined.");
}








