
/*
 *  Copyright (C) 2019  didierfred@gmail.com 
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
    // Inject a content script into the identified tab
    console.log("received script to execute form tabId " + message.tabId);
    if (!connections[message.tabId]) connections[message.tabId] = devToolsConnection;
    chrome.tabs.executeScript(message.tabId,
      { code: "var analyseBestPractices=" + message.analyseBestPractices + ";", allFrames: true });
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
