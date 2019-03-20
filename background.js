


/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. 
*
* @author didierfred@gmail.com
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
    // Inject a content script into the identified tab
    console.log("received script to execute form tabId " + message.tabId);
    if (!connections[message.tabId]) connections[message.tabId] = devToolsConnection;
    chrome.tabs.executeScript(message.tabId,
      { file: message.scriptToInject, allFrames: true });
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
