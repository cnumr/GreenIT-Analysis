/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. 
 *
 * @author didierfred@gmail.com
 */

let rulesManager = new RulesManager();

function RulesManager() {

  let rulesId = [];
  let rulesChecker = new Map();
  let eventListeners = new Map();
  let notCompatibleRules = [];
  eventListeners.set("harReceived", []);
  eventListeners.set("frameMeasuresReceived", []);
  eventListeners.set("resourceContentReceived", []);

  this.registerRule = function (ruleChecker, eventListener) {
    rulesId.push(ruleChecker.id);
    if ((eventListener==="resourceContentReceived") && ((!chrome.devtools) || (!chrome.devtools.inspectedWindow.getResources))) notCompatibleRules.push(ruleChecker.id);
    else {
      rulesChecker.set(ruleChecker.id, ruleChecker);
      let event = eventListeners.get(eventListener);
      if (event) event.push(ruleChecker.id);
    }
  }

  this.getRulesId = function () {
    return rulesId;
  }

  this.getRulesNotCompatibleWithCurrentBrowser = function () {
    return notCompatibleRules;

  }

  this.getNewRulesChecker = function () {
    return new RulesChecker();
  }

  function RulesChecker() {
    let rules = new Map();
    rulesChecker.forEach((ruleChecker, ruleId) => {
      let ruleCheckerInstance = Object.create(ruleChecker)
      // for certains rules need an initalization , method not implemented in all rules
      if (ruleCheckerInstance.initialize) ruleCheckerInstance.initialize();
      rules.set(ruleId, ruleCheckerInstance);
    });

    this.sendEvent = function (event, measures, resource) {

      eventListener = eventListeners.get(event);
      if (eventListener) {
        eventListener.forEach(ruleID => {
          this.checkRule(ruleID, measures, resource);
        });
      }
    }

    this.checkRule = function (rule, measures, resource) {
      rules.get(rule).check(measures, resource);
    }

    this.getRule = function (rule) {
      return rules.get(rule);
    }

    this.getAllRules = function () {
      return rules;
    }
  }
}
