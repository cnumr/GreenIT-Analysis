
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

"use strict";

let connections = {};



/*
* Listen for message form tab and send it to devtools 
**/
const notify = (message, sender, sendResponse) => {

  if (sender.tab) {
    let tabId = sender.tab.id;
    if (tabId in connections) connections[tabId].postMessage(message);
    else console.warn("Tab not found in connection list.");
  }
  else console.warn("sender.tab not defined.");
}


chrome.runtime.onMessage.addListener(notify);

console.log("start background process");

// Listen to message from devTools
chrome.runtime.onConnect.addListener((devToolsConnection) => {
  console.log("received onConnect");
  // assign the listener function to a variable so we can remove it later
  let devToolsListener = (message, sender, sendResponse) => {

    // in case message form devtools is to clean cache 
    if (message.clearBrowserCache) {
      clearBrowserCache();
      return;
    }
    // Otherwise message is to inject script 
    else {
      // Inject a content script into the identified tab
      console.log(`received script ${message.scriptToInject} to execute form tabId ${message.tabId}`);
      if (!connections[message.tabId]) connections[message.tabId] = devToolsConnection;
      injectAnalyseScript(message.tabId,message.scriptToInject);
    }
  }
  // add the listener
  devToolsConnection.onMessage.addListener(devToolsListener);

  devToolsConnection.onDisconnect.addListener((port) => {
    devToolsConnection.onMessage.removeListener(devToolsListener);

    Object.keys(connections).map(tab => {
      if (connections[tab] == port) {
        delete connections[tab];
        return false;
      }
    });
  });

});

function injectAnalyseScript(tabId,script) {
  if (chrome.tabs.executeScript)  injectAnalyseScriptWithManifestV2(tabId,script);
  else injectAnalyseScriptWithManifestV3(tabId,script);
}

function injectAnalyseScriptWithManifestV2(tabId,script) {
  chrome.tabs.executeScript(tabId,
    {file: script, allFrames: true});
}

function injectAnalyseScriptWithManifestV3(tabId,script) {
  chrome.scripting.executeScript({
    target: {tabId},
    files: [script]
  });
}


function clearBrowserCache()
{ 
  chrome.browsingData.remove({
  }, {
    "cache": true,
    "cookies": false,
    "downloads": true,
    "formData": false,
    "history": false,
    "indexedDB": false,
    "localStorage": false,
    "passwords": false,
    "serviceWorkers": true,
  }, console.log("Cache cleaning done"));
}