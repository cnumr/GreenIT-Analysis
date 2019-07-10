

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. 
 *
 * @author didierfred@gmail.com
 */



function Rules() {
  let rules = new Map();
  rules.set("plugins", new pluginsRule());
  rules.set("styleSheets", new styleSheetsRule());
  rules.set("printStyleSheets", new printStyleSheetsRule());
  rules.set("externalizeCss", new externalizeCssRule());
  rules.set("emptySrcTag", new emptySrcTagRule());
  rules.set("externalizeJs", new externalizeJsRule());
  rules.set("httpRequests", new httpRequestsRule());
  rules.set("domainsNumber", new domainsNumberRule());
  rules.set("addExpiresOrCacheControlHeaders", new addExpiresOrCacheControlHeadersRule());
  rules.set("useETags", new useETagsRule());
  rules.set("compressHttp", new compressHttpRule());
  rules.set("dontResizeImageInBrowser", new dontResizeImageInBrowserRule());
  rules.set("useStandardTypefaces", new useStandardTypefacesRule());
  rules.set("maxCookiesLength", new maxCookiesLengthRule());

  // if method chrome.devtools.inspectedWindow.getResources is not implemented (ex: firefox)
  // These rules cannot be computed
  if (chrome.devtools.inspectedWindow.getResources){
    rules.set("minifiedJs", new minifiedJsRule());
    rules.set("jsValidate", new jsValidateRule());
    rules.set("minifiedCss", new minifiedCssRule());
  }

  this.checkRule = function (rule, measures) {
    rules.get(rule).check(measures);
  }

  this.getRule = function (rule) {
    return rules.get(rule);
  }

  this.getAllRules = function () {
    return rules;
  }

  function pluginsRule() {
    this.isRespected = true;
    this.id = "plugins";
    this.comment = chrome.i18n.getMessage("rule_Plugins_DefaultComment");

    this.check = function (measures) {
      if (measures.pluginsNumber > 0) {
        this.isRespected = false;
        this.comment = chrome.i18n.getMessage("rule_Plugins_Comment", String(measures.pluginsNumber));
      }
    }
  }
  function styleSheetsRule() {
    this.isRespected = true;
    this.id = "styleSheets";
    this.comment = chrome.i18n.getMessage("rule_StyleSheets_DefaultComment");

    this.check = function (measures) {
      if (measures.styleSheetsNumber > 2) {
        this.isRespected = false;
        this.comment = chrome.i18n.getMessage("rule_StyleSheets_Comment", String(measures.styleSheetsNumber));
      }
    }
  }

  function printStyleSheetsRule() {
    this.isRespected = false;
    this.id = "printStyleSheets";
    this.comment = chrome.i18n.getMessage("rule_PrintStyleSheet_DefaultComment");

    this.check = function (measures) {
      if (measures.printStyleSheetsNumber > 0) {
        this.isRespected = true;
        this.comment = chrome.i18n.getMessage("rule_PrintStyleSheet_Comment", String(measures.printStyleSheetsNumber));
      }
    }
  }

  function externalizeCssRule() {
    this.isRespected = true;
    this.id = "externalizeCss";
    this.comment = chrome.i18n.getMessage("rule_ExternalizeCss_DefaultComment");

    this.check = function (measures) {
      if (measures.inlineStyleSheetsNumber > 0) {
        this.isRespected = false;
        this.comment = chrome.i18n.getMessage("rule_ExternalizeCss_Comment", String(measures.inlineStyleSheetsNumber));
      }
    }
  }

  function minifiedCssRule() {
    this.isRespected = true;
    this.id = "minifiedCss";
    this.comment = chrome.i18n.getMessage("rule_MinifiedCss_DefaultComment");

    this.check = function (measures) {
      if (measures.totalCss > 0) {
        if (measures.percentMinifiedCss < 95) this.isRespected = false;
        else this.isRespected = true;
        this.comment = chrome.i18n.getMessage("rule_MinifiedCss_Comment",
          Math.round(measures.percentMinifiedCss) + " % ("
          + measures.minifiedCssNumber + "/" + measures.totalCss + ")");
      }
    }
  }

  function emptySrcTagRule() {
    this.isRespected = true;
    this.id = "emptySrcTag";
    this.comment = chrome.i18n.getMessage("rule_EmptySrcTag_DefaultComment");

    this.check = function (measures) {
      if (measures.emptySrcTagNumber > 0) {
        this.isRespected = false;
        this.comment = chrome.i18n.getMessage("rule_EmptySrcTag_Comment", String(measures.emptySrcTagNumber));
      }
    }
  }

  function jsValidateRule() {
    this.isRespected = true;
    this.id = "jsValidate";
    this.comment = chrome.i18n.getMessage("rule_JsValidate_DefaultComment");

    this.check = function (measures) {
      if (measures.jsErrorsNumber > 0) {
        this.isRespected = false;
        this.comment = chrome.i18n.getMessage("rule_JsValidate_Comment", String(measures.jsErrorsNumber));
      }
    }
  }

  function externalizeJsRule() {
    this.isRespected = true;
    this.id = "externalizeJs";
    this.comment = chrome.i18n.getMessage("rule_ExternalizeJs_DefaultComment");

    this.check = function (measures) {
      if (measures.inlineJsScriptsNumber > 0) {
        if (measures.inlineJsScriptsNumber > 1) this.isRespected = false;
        this.comment = chrome.i18n.getMessage("rule_ExternalizeJs_Comment", String(measures.inlineJsScriptsNumber));
        
      }
    }
  }

  function minifiedJsRule() {
    this.isRespected = true;
    this.id = "minifiedJs";
    this.comment = chrome.i18n.getMessage("rule_MinifiedJs_DefaultComment");

    this.check = function (measures) {
      if (measures.totalJs > 0) {
        if (measures.percentMinifiedJs < 95) this.isRespected = false;
        else this.isRespected = true;

        this.comment = chrome.i18n.getMessage("rule_MinifiedJs_Comment", 
        Math.round(measures.percentMinifiedJs) + " % (" 
        + measures.minifiedJsNumber 
        + "/" + measures.totalJs + ")");
      }
    }
  }

  function httpRequestsRule() {
    this.isRespected = true;
    this.id = "httpRequests";
    this.comment = "";

    this.check = function (measures) {
      if (measures.nbRequest > 26) this.isRespected = false;
      this.comment = chrome.i18n.getMessage("rule_HttpRequests_Comment", String(measures.nbRequest));
    }
  }

  function domainsNumberRule() {
    this.isRespected = true;
    this.id = "domainsNumber";
    this.comment = "";

    this.check = function (measures) {
      if (measures.domainsNumber > 2) this.isRespected = false;
      this.comment = chrome.i18n.getMessage("rule_DomainsNumber_Comment", String(measures.domainsNumber));
    }
  }


  function addExpiresOrCacheControlHeadersRule() {
    this.isRespected = true;
    this.id = "addExpiresOrCacheControlHeaders";
    this.comment = "";

    this.check = function (measures) {
      if (measures.staticResourcesNumber > 0) {
        const cacheHeaderRatio = measures.staticResourcesNumberWithCacheHeaders / measures.staticResourcesNumber * 100;
        //debug(() => `static resources ${measures.staticResourcesNumber}`);
        //debug(() => `static resources with cache header ${measures.staticResourcesNumberWithCacheHeaders}`);
        if (cacheHeaderRatio < 95) this.isRespected = false;
        else this.isRespected = true;
        this.comment = chrome.i18n.getMessage("rule_AddExpiresOrCacheControlHeaders_Comment",
         Math.round(cacheHeaderRatio) + " % (" + 
         measures.staticResourcesNumberWithCacheHeaders + 
         "/" + measures.staticResourcesNumber + ")");
      }
    }
  }

  function useETagsRule() {
    this.isRespected = true;
    this.id = "useETags";
    this.comment = "";

    this.check = function (measures) {
      if (measures.staticResourcesNumber > 0) {
        const eTagsRatio = measures.staticResourcesNumberWithETags / measures.staticResourcesNumber * 100;
        //debug(() => `static resources ${measures.staticResourcesNumber}`);
        //debug(() => `static resources with ETags ${measures.staticResourcesNumberWithETags}`);
        if (eTagsRatio < 95) this.isRespected = false;
        else this.isRespected = true;
        this.comment = chrome.i18n.getMessage("rule_UseETags_Comment",
         Math.round(eTagsRatio) + " % (" +
          measures.staticResourcesNumberWithETags + "/" +
           measures.staticResourcesNumber + ")");
      }
    }
  }



  function compressHttpRule() {
    this.isRespected = true;
    this.id = "compressHttp";
    this.comment = "";

    this.check = function (measures) {
      if (measures.compressibleResourcesNumber > 0) {
        const compressRatio = measures.compressibleResourcesNumberCompressed / measures.compressibleResourcesNumber * 100;
        //debug(() => `compressible resources ${measures.compressibleResourcesNumber}`);
        //debug(() => `compressible resources compressed ${measures.compressibleResourcesNumberCompressed}`);
        this.isRespected = (compressRatio >= 95);
        this.comment = chrome.i18n.getMessage("rule_CompressHttp_Comment",
        Math.round(compressRatio) + " % (" + 
        measures.compressibleResourcesNumberCompressed + "/" + 
        measures.compressibleResourcesNumber + ")");
      }
    }
  }


  function dontResizeImageInBrowserRule() {
    this.isRespected = true;
    this.id = "dontResizeImageInBrowser";
    this.comment = "";

    this.check = function (measures) {
      if (measures.imageResizedInBrowserNumber > 0) this.isRespected = false;
      this.comment = chrome.i18n.getMessage("rule_DontResizeImageInBrowser_Comment", String(measures.imageResizedInBrowserNumber));
    }
  }

  function useStandardTypefacesRule() {
    this.isRespected = true;
    this.id = "useStandardTypefaces";
    this.comment = chrome.i18n.getMessage("rule_UseStandardTypefaces_DefaultComment");

    this.check = function (measures) {
      if (measures.cssFontFaceRuleNumber > 0) {
        this.isRespected = false;
        this.comment = chrome.i18n.getMessage("rule_UseStandardTypefaces_Comment", String(measures.cssFontFaceRuleNumber));
      }
    }
  }

  function maxCookiesLengthRule() {
    this.isRespected = true;
    this.id = "maxCookiesLength";
    this.comment = chrome.i18n.getMessage("rule_MaxCookiesLength_DefaultComment");

    this.check = function (measures) {
      this.comment = chrome.i18n.getMessage("rule_MaxCookiesLength_Comment", String(measures.maxCookiesLength));
      if (measures.maxCookiesLength > 512) this.isRespected = false;
    }
  }

  

}


