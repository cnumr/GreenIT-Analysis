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
import { createAddExpiresOrCacheControlHeadersRule } from "./rules/AddExpiresOrCacheControlHeaders";
import { createCompressHttpRule } from "./rules/CompressHttp";
import { createDomainsNumberRule } from "./rules/DomainsNumber";
import { createDontResizeImageInBrowserRule } from "./rules/DontResizeImageInBrowser";
import { createExternalizeCssJsRule } from "./rules/ExternalizeCssJs";
import { createHttpErrorRule } from "./rules/HttpError";
import { createHttpRequestsRule } from "./rules/HttpRequests";
import { createImageDownloadedNotDisplayedRule } from "./rules/ImageDownloadedNotDisplayed";
import { createMinifiedCssJsRule } from "./rules/MinifiedCssJs";
import { createNoCookieForStaticRessourcesRule } from "./rules/NoCookieForStaticRessources";
import { createNoRedirectRule } from "./rules/NoRedirect";
import { createOptimizeBitmapImagesRule } from "./rules/OptimizeBitmapImages";
import { createOptimizeSvgRule } from "./rules/OptimizeSvg";
import { createPrintStyleSheetRule } from "./rules/PrintStyleSheet";
import { createSocialNetworkButtonRule } from "./rules/SocialNetworkButton";
import { createStyleSheetsRule } from "./rules/StyleSheets";
import { createUseHttp2Rule } from "./rules/UseHttp2";
import { createUseStandardTypefacesRule } from "./rules/UseStandardTypefaces";

export function RulesManager() {
  const rulesId = [];
  const rulesChecker = new Map();
  const eventListeners = new Map();
  const notCompatibleRules = [];
  eventListeners.set("harReceived", []);
  eventListeners.set("frameMeasuresReceived", []);
  eventListeners.set("resourceContentReceived", []);

  this.registerRules = function () {
    this.registerRule(
      createAddExpiresOrCacheControlHeadersRule(),
      "harReceived",
    );
    this.registerRule(createCompressHttpRule(), "harReceived");
    this.registerRule(createDomainsNumberRule(), "harReceived");
    this.registerRule(
      createDontResizeImageInBrowserRule(),
      "frameMeasuresReceived",
    );
    this.registerRule(createExternalizeCssJsRule(), "frameMeasuresReceived");
    this.registerRule(createHttpErrorRule(), "harReceived");
    this.registerRule(createHttpRequestsRule(), "harReceived");
    this.registerRule(
      createImageDownloadedNotDisplayedRule(),
      "frameMeasuresReceived",
    );
    this.registerRule(createMinifiedCssJsRule(), "resourceContentReceived");
    this.registerRule(createNoCookieForStaticRessourcesRule(), "harReceived");
    this.registerRule(createNoRedirectRule(), "harReceived");
    this.registerRule(createOptimizeBitmapImagesRule(), "harReceived");
    this.registerRule(createOptimizeSvgRule(), "resourceContentReceived");
    this.registerRule(createPrintStyleSheetRule(), "frameMeasuresReceived");
    this.registerRule(createSocialNetworkButtonRule(), "harReceived");
    this.registerRule(createStyleSheetsRule(), "harReceived");
    this.registerRule(createUseHttp2Rule(), "harReceived");
    this.registerRule(createUseStandardTypefacesRule(), "harReceived");
  };

  this.registerRule = (ruleChecker, eventListener) => {
    rulesId.push(ruleChecker.id);
    if (
      eventListener === "resourceContentReceived" &&
      (!browser.devtools || !browser.devtools.inspectedWindow.getResources)
    )
      notCompatibleRules.push(ruleChecker.id);
    else {
      rulesChecker.set(ruleChecker.id, ruleChecker);
      const event = eventListeners.get(eventListener);
      if (event) event.push(ruleChecker.id);
    }
  };

  this.getRulesId = () => rulesId;

  this.getRulesNotCompatibleWithCurrentBrowser = () => notCompatibleRules;

  this.getNewRulesChecker = () => new RulesChecker();

  function RulesChecker() {
    const rules = new Map();
    rulesChecker.forEach((ruleChecker, ruleId) => {
      const ruleCheckerInstance = Object.create(ruleChecker);
      // for certain rules need an initialization , method not implemented in all rules
      if (ruleCheckerInstance.initialize) ruleCheckerInstance.initialize();
      rules.set(ruleId, ruleCheckerInstance);
    });

    this.sendEvent = function (event, measures, resource) {
      const eventListener = eventListeners.get(event);
      if (eventListener) {
        eventListener.forEach((ruleID) => {
          this.checkRule(ruleID, measures, resource);

          // not used yet , see https://github.com/cnumr/GreenIT-Analysis/pull/22
          //  this.manageExport(ruleID, measures);
        });
      }
    };

    this.checkRule = (rule, measures, resource) => {
      rules.get(rule).check(measures, resource);
    };

    this.manageExport = (rule, measures) => {
      const myRule = rules.get(rule);
      measures.bestPracticeDetails[rule] = {};
      measures.bestPracticeDetails[rule].comment = myRule.comment;
      measures.bestPracticeDetails[rule].detailComment = myRule.detailComment;
      measures.bestPracticeDetails[rule].complianceLevel =
        myRule.complianceLevel;
      measures.bestPracticeDetails[rule].specificMeasures =
        myRule.getSpecificMeasures();
    };

    this.getRule = (rule) => rules.get(rule);

    this.getAllRules = () => rules;
  }
}
