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
      // for certain rules need an initialization , method not implemented in all rules
      if (ruleCheckerInstance.initialize) ruleCheckerInstance.initialize();
      rules.set(ruleId, ruleCheckerInstance);
    });

    this.sendEvent = function (event, measures, resource) {

      const eventListener = eventListeners.get(event);
      if (eventListener) {
        eventListener.forEach(ruleID => {
          this.checkRule(ruleID, measures, resource);

        // not used yet , see https://github.com/cnumr/GreenIT-Analysis/pull/22
        //  this.manageExport(ruleID, measures); 
        });
      }
    }

    this.checkRule = function (rule, measures, resource) {
      rules.get(rule).check(measures, resource);
    }

    this.manageExport = function (rule, measures) {
      let myRule = rules.get(rule); 
      measures.bestPracticeDetails[rule] = {};
      measures.bestPracticeDetails[rule].comment = myRule.comment;
      measures.bestPracticeDetails[rule].detailComment = myRule.detailComment;
      measures.bestPracticeDetails[rule].complianceLevel = myRule.complianceLevel;
      measures.bestPracticeDetails[rule].specificMeasures = myRule.getSpecificMeasures();
    }

    this.getRule = function (rule) {
      return rules.get(rule);
    }

    this.getAllRules = function () {
      return rules;
    }
  }
}
