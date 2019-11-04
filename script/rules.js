

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
  rules.set("noRedirect", new noRedirectRule());
  rules.set("optimizeBitmapImages", new optimizeBitmapImagesRule());



  // if method chrome.devtools.inspectedWindow.getResources is not implemented (ex: firefox)
  // These rules cannot be computed
  if (chrome.devtools.inspectedWindow.getResources) {
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
    this.detailComment = "";

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
    this.detailComment = "";

    this.check = function (measures) {
      let styleSheets = [];
      if (measures.entries.length) measures.entries.forEach(entry => {
        if (getResponseHeaderFromResource(entry, "content-type").toLowerCase().includes('text/css')) {
          if (styleSheets.indexOf(entry.request.url) === -1) {
            styleSheets.push(entry.request.url);
            this.detailComment += entry.request.url + "<br>";
          }
        }
      });
      if (styleSheets.length > 2) {
        this.isRespected = false;
        this.comment = chrome.i18n.getMessage("rule_StyleSheets_Comment", String(styleSheets.length));
      }
    }
  }

  function printStyleSheetsRule() {
    this.isRespected = false;
    this.id = "printStyleSheets";
    this.comment = chrome.i18n.getMessage("rule_PrintStyleSheet_DefaultComment");
    this.detailComment = "";

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
    this.detailComment = "";

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
    this.detailComment = "";

    this.check = function (measures) {
      this.detailComment = "";
      measures.cssShouldBeMinified.forEach(url => {
        this.detailComment += `${url} should be minified <br>`;
      });
      if (measures.totalCss > 0) {
        const percentMinifiedCss = measures.minifiedCssNumber / measures.totalCss * 100;
        if (percentMinifiedCss < 95) this.isRespected = false;
        else this.isRespected = true;
        this.comment = chrome.i18n.getMessage("rule_MinifiedCss_Comment",
          Math.round(percentMinifiedCss) + " % ("
          + measures.minifiedCssNumber + "/" + measures.totalCss + ")");
      }
    }
  }

  function emptySrcTagRule() {
    this.isRespected = true;
    this.id = "emptySrcTag";
    this.comment = chrome.i18n.getMessage("rule_EmptySrcTag_DefaultComment");
    this.detailComment = "";

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
    this.detailComment = "";

    this.check = function (measures) {
      let errors = 0;
      this.detailComment = "";
      measures.jsErrors.forEach((value, key) => {
        this.detailComment += (`URL ${key} has ${value} error(s) <br>`);
        errors += value;
      });
      if (errors > 0) {
        this.isRespected = false;
        this.comment = chrome.i18n.getMessage("rule_JsValidate_Comment", String(errors));
      }
    }
  }

  function externalizeJsRule() {
    this.isRespected = true;
    this.id = "externalizeJs";
    this.comment = chrome.i18n.getMessage("rule_ExternalizeJs_DefaultComment");
    this.detailComment = "";

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
    this.detailComment = "";

    this.check = function (measures) {
      this.detailComment = "";
      measures.jsShouldBeMinified.forEach(url => {
        this.detailComment += `${url} should be minified <br>`;
      });
      if (measures.totalJs > 0) {
        const percentMinifiedJs = measures.minifiedJsNumber / measures.totalJs * 100;
        if (percentMinifiedJs < 95) this.isRespected = false;
        else this.isRespected = true;

        this.comment = chrome.i18n.getMessage("rule_MinifiedJs_Comment",
          Math.round(percentMinifiedJs) + " % ("
          + measures.minifiedJsNumber
          + "/" + measures.totalJs + ")");
      }
    }
  }

  function httpRequestsRule() {
    this.isRespected = true;
    this.id = "httpRequests";
    this.comment = "";
    this.detailComment = "";

    this.check = function (measures) {
      if (measures.entries.length) measures.entries.forEach(entry => {
        this.detailComment += entry.request.url + "<br>";
      });
      if (measures.nbRequest > 26) this.isRespected = false;
      this.comment = chrome.i18n.getMessage("rule_HttpRequests_Comment", String(measures.nbRequest));
    }
  }

  function domainsNumberRule() {
    this.isRespected = true;
    this.id = "domainsNumber";
    this.comment = "";
    this.detailComment = "";

    this.check = function (measures) {
      let domains = [];
      if (measures.entries.length) measures.entries.forEach(entry => {
        let domain = getDomainFromUrl(entry.request.url);
        if (domains.indexOf(domain) === -1) {
          domains.push(domain);
        }
      });
      if (domains.length > 2) this.isRespected = false;
      domains.forEach(domain => {
        this.detailComment += domain + "<br>";
      });

      this.comment = chrome.i18n.getMessage("rule_DomainsNumber_Comment", String(domains.length));
    }
  }


  function addExpiresOrCacheControlHeadersRule() {
    this.isRespected = true;
    this.id = "addExpiresOrCacheControlHeaders";
    this.comment = "";
    this.detailComment = "";

    this.check = function (measures) {
      let staticResourcesNumber = 0;
      let staticResourcesNumberWithCacheHeaders = 0;
      if (measures.entries.length) measures.entries.forEach(entry => {
        if (isStaticRessource(entry)) {
          staticResourcesNumber++;
          if (hasValidCacheHeaders(entry)) {
            staticResourcesNumberWithCacheHeaders++;
          }
          else this.detailComment += `resource ${entry.request.url} is not cached <br>`;
        }
      });

      if (staticResourcesNumber > 0) {
        const cacheHeaderRatio = staticResourcesNumberWithCacheHeaders / staticResourcesNumber * 100;
        //debug(() => `static resources ${staticResourcesNumber}`);
        //debug(() => `static resources with cache header ${staticResourcesNumberWithCacheHeaders}`);
        if (cacheHeaderRatio < 95) this.isRespected = false;
        else this.isRespected = true;
        this.comment = chrome.i18n.getMessage("rule_AddExpiresOrCacheControlHeaders_Comment",
          Math.round(cacheHeaderRatio) + " % (" +
          staticResourcesNumberWithCacheHeaders +
          "/" + staticResourcesNumber + ")");
      }
    }
  }

  function useETagsRule() {
    this.isRespected = true;
    this.id = "useETags";
    this.comment = "";
    this.detailComment = "";

    this.check = function (measures) {

      let staticResourcesNumber = 0;
      let staticResourcesNumberWithETags = 0;

      if (measures.entries.length) measures.entries.forEach(entry => {
        if (isStaticRessource(entry)) {
          staticResourcesNumber++;
          if (isRessourceUsingETag(entry)) {
            staticResourcesNumberWithETags++;
          }
          else this.detailComment += `resource ${entry.request.url} is not using ETags <br>`;
        }
      });
      if (staticResourcesNumber > 0) {
        const eTagsRatio = staticResourcesNumberWithETags / staticResourcesNumber * 100;
        //debug(() => `static resources ${staticResourcesNumber}`);
        //debug(() => `static resources with ETags ${staticResourcesNumberWithETags}`);
        if (eTagsRatio < 95) this.isRespected = false;
        else this.isRespected = true;
        this.comment = chrome.i18n.getMessage("rule_UseETags_Comment",
          Math.round(eTagsRatio) + " % (" +
          staticResourcesNumberWithETags + "/" +
          staticResourcesNumber + ")");
      }
    }
  }



  function compressHttpRule() {
    this.isRespected = true;
    this.id = "compressHttp";
    this.comment = "";
    this.detailComment = "";

    this.check = function (measures) {

      let compressibleResourcesNumber = 0;
      let compressibleResourcesNumberCompressed = 0;
      if (measures.entries.length) measures.entries.forEach(entry => {
        if (isCompressibleResource(entry)) {
          compressibleResourcesNumber++;
          if (isResourceCompressed(entry)) {
            compressibleResourcesNumberCompressed++;
            //this.detailComment +=`resource ${entry.request.url} is compressed <br>`;
          }
          else this.detailComment += `resource ${entry.request.url} is not compressed <br> `;
        }
      });


      if (compressibleResourcesNumber > 0) {
        const compressRatio = compressibleResourcesNumberCompressed / compressibleResourcesNumber * 100;
        //debug(() => `compressible resources ${compressibleResourcesNumber}`);
        //debug(() => `compressible resources compressed ${compressibleResourcesNumberCompressed}`);
        this.isRespected = (compressRatio >= 95);
        this.comment = chrome.i18n.getMessage("rule_CompressHttp_Comment",
          Math.round(compressRatio) + " % (" +
          compressibleResourcesNumberCompressed + "/" +
          compressibleResourcesNumber + ")");
      }
    }
  }


  function dontResizeImageInBrowserRule() {
    this.isRespected = true;
    this.id = "dontResizeImageInBrowser";
    this.comment = "";
    this.detailComment = "";
    this.imagesResizedInBrowserNumber = 0;

    this.check = function (measures) {

      measures.imagesResizedInBrowser.forEach(entry => {
        this.detailComment += `${entry} <br>`;
      });
      this.imagesResizedInBrowserNumber += measures.imagesResizedInBrowser.length
      if (this.imagesResizedInBrowserNumber > 0) this.isRespected = false;
      this.comment = chrome.i18n.getMessage("rule_DontResizeImageInBrowser_Comment", String(this.imagesResizedInBrowserNumber));
    }
  }

  function useStandardTypefacesRule() {
    this.isRespected = true;
    this.id = "useStandardTypefaces";
    this.comment = chrome.i18n.getMessage("rule_UseStandardTypefaces_DefaultComment");
    this.detailComment = "";
    this.cssFontFace = [];

    this.check = function (measures) {
      measures.cssFontFace.forEach(font => {
        if (this.cssFontFace.indexOf(font) === -1) {
          this.cssFontFace.push(font);
          this.detailComment += `${font} <br>`;
        }
      });

      if (this.cssFontFace.length > 0) {
        this.isRespected = false;
        this.comment = chrome.i18n.getMessage("rule_UseStandardTypefaces_Comment", String(this.cssFontFace.length));
      }
    }
  }

  function maxCookiesLengthRule() {
    this.isRespected = true;
    this.id = "maxCookiesLength";
    this.comment = chrome.i18n.getMessage("rule_MaxCookiesLength_DefaultComment");
    this.detailComment = "";

    this.check = function (measures) {
      let maxCookiesLength = 0;
      let domains = new Map();
      if (measures.entries.length) measures.entries.forEach(entry => {
        const cookiesLength = getCookiesLength(entry);

        if (cookiesLength !== 0) {
          let domain = getDomainFromUrl(entry.request.url);
          if (domains.has(domain)) {
            if (domains.get(domain) < cookiesLength) domains.set(domain, cookiesLength);
          }
          else domains.set(domain, cookiesLength);
          if (cookiesLength > maxCookiesLength) maxCookiesLength = cookiesLength;
        }
      });
      domains.forEach((value, key) => {
        this.detailComment += `COOKIE LENGTH = ${value} for domain ${key} <br>`;
      });
      if (maxCookiesLength !== 0) {
        this.comment = chrome.i18n.getMessage("rule_MaxCookiesLength_Comment", String(maxCookiesLength));
        if (maxCookiesLength > 512) this.isRespected = false;
      }
    }
  }

  function noRedirectRule() {
    this.isRespected = true;
    this.id = "noRedirect";
    this.comment = "";
    this.detailComment = "";

    this.check = function (measures) {
      let redirectNumber = 0;
      if (measures.entries.length) measures.entries.forEach(entry => {
        if (entry.response) {
          if (isHttpRedirectCode(entry.response.status)) {
            this.detailComment += entry.response.status + " " + entry.request.url + "<br>";
            redirectNumber++;
          }
        }
      });
      if (redirectNumber > 0) this.isRespected = false;
      this.comment = chrome.i18n.getMessage("rule_NoRedirect_Comment", String(redirectNumber));
    }
  }

  function optimizeBitmapImagesRule() {
    this.isRespected = true;
    this.id = "optimizeBitmapImages";
    this.comment = "";
    this.detailComment = "";
    this.nbImagesToOptimize = 0;

    this.check = function (measures) {
      let nbImagesToOptimize = 0;
      if (measures.entries) measures.entries.forEach(entry => {
        if (entry.response) {
          console.log("entry.request.url=" + entry.request.url );
          const imageType = getImageTypeFromResource(entry);
          console.log("imageType=" + imageType );
          if (imageType !== "") {
            var myImage = new Image();
            myImage.src = entry.request.url;
            // needed to access object in the function after
            myImage.rule = this;
            
            myImage.size = entry.response.content.size;
            myImage.onload = function () {
              if (!isImageResolutionOptimized(this.width * this.height,this.size,imageType)) {
                nbImagesToOptimize++;
                this.rule.detailComment += this.src + " , " + Math.round(this.size/1000) + "Kb , " + this.width + "x" + this.height + "<br>";
              }
              if (nbImagesToOptimize > 0) {
                this.rule.isRespected = false;
                this.rule.comment = chrome.i18n.getMessage("rule_OptimizeBitmapImages_Comment", String(nbImagesToOptimize));
                showEcoRuleOnUI(this.rule);
              }
            }

          }
        }
      });

    }
  }

}


