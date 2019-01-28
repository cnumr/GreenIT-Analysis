

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. 
 *
 * @author didierfred@gmail.com
 */



function Rules() {
  let rules  = new Map();
  rules.set("plugins",new pluginsRule());
  rules.set("styleSheets",new styleSheetsRule());
  rules.set("printStyleSheets",new printStyleSheetsRule());
  rules.set("externalizeCss",new externalizeCssRule());
  rules.set("minifiedCss",new minifiedCssRule());
  rules.set("emptySrcTag",new emptySrcTagRule());
  rules.set("jsValidate",new jsValidateRule());
  rules.set("externalizeJs",new externalizeJsRule());
  rules.set("minifiedJs",new minifiedJsRule());
  rules.set("httpRequests",new httpRequestsRule());
  rules.set("domainsNumber",new domainsNumberRule());
  rules.set("addExpiresOrCacheControlHeaders",new addExpiresOrCacheControlHeadersRule());
  rules.set("useETags",new useETagsRule());
  rules.set("compressHttp",new compressHttpRule());
  rules.set("dontResizeImageInBrowser", new dontResizeImageInBrowserRule());
  rules.set("useStandardTypefaces", new useStandardTypefacesRule());
  
  

  this.checkRule = function (rule,measures) {
    rules.get(rule).check(measures);
  }

  this.getRule = function (rule) {
    return rules.get(rule);
  }

  this.getAllRules = function() {
    return rules;
  }

  function pluginsRule() {
    this.isRespected = true;
    this.id = "plugins";
    this.comment = "No plugin found";
    
    this.check = function(measures) {  
      if (measures.pluginsNumber > 0) {
        this.isRespected = false ;
        this.comment = measures.pluginsNumber + " plugin(s) found";
      }
    }
  }
  function styleSheetsRule() {
    this.isRespected = true;
    this.id = "styleSheets";
    this.comment = "Not more that 2 stylesheets per frame found";
    
    this.check = function(measures) {  
      if (measures.styleSheetsNumber > 2) {
        this.isRespected = false ;
        this.comment = measures.styleSheetsNumber + " stylesheets found for at least one frame";
      }
    }
  }

  function printStyleSheetsRule() {
    this.isRespected = false;
    this.id = "printStyleSheets";
    this.comment = "No print stylesheet found";
    
    this.check = function(measures) {  
      if (measures.printStyleSheetsNumber > 0) {
        this.isRespected = true ;
        this.comment = measures.printStyleSheetsNumber + " print StyleSheet(s) found"
      }
    }
  }

  function externalizeCssRule() {
    this.isRespected = true;
    this.id = "externalizeCss";
    this.comment = "No inline stylesheet found";
    
    this.check = function(measures) {  
      if (measures.inlineStyleSheetsNumber > 0) {
        this.isRespected = false ;
        this.comment = measures.inlineStyleSheetsNumber + " inline stylesheets found ";
      }
    }
  }

  function minifiedCssRule() {
    this.isRespected = true;
    this.id = "minifiedCss";
    this.comment = "No css found";
    
    this.check = function(measures) {  
      if (measures.totalCss > 0) {
        if (measures.percentMinifiedCss<95)  this.isRespected = false;
        else this.isRespected = true;
        this.comment = Math.round(measures.percentMinifiedCss) + " % (" + measures.minifiedCssNumber + "/" + measures.totalCss + ") minified stylesheet ";
      }
    }
  }
  
  function emptySrcTagRule() {
    this.isRespected = true;
    this.id = "emptySrcTag";
    this.comment = "No empty src tags found";
    
    this.check = function(measures) {  
      if (measures.emptySrcTagNumber > 0) {
        this.isRespected = false;
        this.comment = measures.emptySrcTagNumber + " empty src tag(s) found";
      }
    }
  }
  
  function jsValidateRule() {
    this.isRespected = true;
    this.id = "jsValidate";
    this.comment = "Javascript validate";
    
    this.check = function(measures) {  
      if (measures.jsErrorsNumber > 0) {
        this.isRespected = false;
        this.comment = measures.jsErrorsNumber + " javascript error(s) found";
      }
    }
  }

  function externalizeJsRule() {
    this.isRespected = true;
    this.id = "externalizeJs";
    this.comment = "No inline JavaScript";
    
    this.check = function(measures) {  
      if (measures.inlineJsScriptsNumber > 0) {
        if (measures.inlineJsScriptsNumber > 1 ) this.isRespected = false;
        this.comment = measures.inlineJsScriptsNumber + " inline  javascripts found ";
      }
    }
  }

  function minifiedJsRule() {
    this.isRespected = true;
    this.id = "minifiedJs";
    this.comment = "No js found";
    
    this.check = function(measures) {  
      if (measures.totalJs > 0) {
        if (measures.percentMinifiedJs < 95) this.isRespected = false;
        else this.isRespected = true;
        this.comment = Math.round(measures.percentMinifiedJs) + " % (" + measures.minifiedJsNumber + "/" + measures.totalJs + ") minified javascript ";
      }
    }
  }

  function httpRequestsRule() {
    this.isRespected = true;
    this.id = "httpRequests";
    this.comment = "";
    
    this.check = function(measures) {  
        if (measures.nbRequest > 26) this.isRespected = false;
        this.comment = measures.nbRequest + " HTTP request(s) ";
    }
  }
  
  function domainsNumberRule() {
    this.isRespected = true;
    this.id = "domainsNumber";
    this.comment = "";
    
    this.check = function(measures) {  
      if (measures.domainsNumber > 2) this.isRespected = false;
      this.comment =  measures.domainsNumber + " domain(s) found";
    }
  }
  

  function addExpiresOrCacheControlHeadersRule() {
    this.isRespected = true;
    this.id = "addExpiresOrCacheControlHeaders";
    this.comment = "";
    
    this.check = function(measures) {  
      if (measures.staticResourcesNumber > 0) {
        const cacheHeaderRatio = measures.staticResourcesNumberWithCacheHeaders / measures.staticResourcesNumber * 100;
        //debug(() => `static resources ${measures.staticResourcesNumber}`);
       //debug(() => `static resources with cache header ${measures.staticResourcesNumberWithCacheHeaders}`);
        if (cacheHeaderRatio < 95) this.isRespected = false;
        else this.isRespected=true;
        this.comment = Math.round(cacheHeaderRatio) + " % (" + measures.staticResourcesNumberWithCacheHeaders + "/" + measures.staticResourcesNumber + ") resources cached";
      }
    }
  }

  function useETagsRule() {
    this.isRespected = true;
    this.id = "useETags";
    this.comment = "";
    
    this.check = function(measures) {  
      if (measures.staticResourcesNumber > 0) {
        const eTagsRatio = measures.staticResourcesNumberWithETags / measures.staticResourcesNumber * 100;
        //debug(() => `static resources ${measures.staticResourcesNumber}`);
       //debug(() => `static resources with ETags ${measures.staticResourcesNumberWithETags}`);
        if (eTagsRatio < 95) this.isRespected = false;
        else this.isRespected=true;
        this.comment = Math.round(eTagsRatio) + " % (" + measures.staticResourcesNumberWithETags + "/" + measures.staticResourcesNumber + ") resources with ETags";
      }
    }
  }



  function compressHttpRule() {
    this.isRespected = true;
    this.id = "compressHttp";
    this.comment = "";
    
    this.check = function(measures) {  
      if (measures.compressibleResourcesNumber > 0) {
        const compressRatio = measures.compressibleResourcesNumberCompressed / measures.compressibleResourcesNumber * 100;
        //debug(() => `compressible resources ${measures.compressibleResourcesNumber}`);
        //debug(() => `compressible resources compressed ${measures.compressibleResourcesNumberCompressed}`);
        if (compressRatio < 95) this.isRespected = false;
        else this.isRespected = true;
        this.comment = Math.round(compressRatio) + " % (" + measures.compressibleResourcesNumberCompressed + "/" + measures.compressibleResourcesNumber + ") resources compressed";
      }
    }
  }


  function dontResizeImageInBrowserRule() {
    this.isRespected = true;
    this.id = "dontResizeImageInBrowser";
    this.comment = "";
    
    this.check = function(measures) {  
      if (measures.imageResizedInBrowserNumber > 0) this.isRespected = false;
      this.comment =  measures.imageResizedInBrowserNumber + " image(s) resized in browser found";
    }
  }

  function useStandardTypefacesRule() {
    this.isRespected = true;
    this.id = "useStandardTypefaces";
    this.comment = "";
    
    this.check = function(measures) {  
      if (measures.cssFontFaceRuleNumber > 0) {
        this.isRespected = false;
        this.comment =  measures.cssFontFaceRuleNumber + " custom fonts found for at least one frame";
      }
      else this.comment = "No custom fonts found";
    }
  }

  
  
 }


