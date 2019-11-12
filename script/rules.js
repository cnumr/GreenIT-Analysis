

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. 
 *
 * @author didierfred@gmail.com
 */

function Rules() {
  let rules = new Map();
  rules.set("addExpiresOrCacheControlHeaders", new addExpiresOrCacheControlHeadersRule());
  rules.set("compressHttp", new compressHttpRule());
  rules.set("domainsNumber", new domainsNumberRule());
  rules.set("dontResizeImageInBrowser", new dontResizeImageInBrowserRule());
  rules.set("emptySrcTag", new emptySrcTagRule());
  rules.set("externalizeCss", new externalizeCssRule());
  rules.set("externalizeJs", new externalizeJsRule());
  rules.set("httpRequests", new httpRequestsRule());
  rules.set("imageDownloadedNotDisplayed", new imageDownloadedNotDisplayedRule());
  rules.set("maxCookiesLength", new maxCookiesLengthRule());
  rules.set("noCookieForStaticRessources", new noCookieForStaticRessourcesRule());
  rules.set("noRedirect", new noRedirectRule());
  rules.set("optimizeBitmapImages", new optimizeBitmapImagesRule());
  rules.set("plugins", new pluginsRule());
  rules.set("printStyleSheets", new printStyleSheetsRule());
  rules.set("styleSheets", new styleSheetsRule());
  rules.set("useETags", new useETagsRule());
  rules.set("useStandardTypefaces", new useStandardTypefacesRule());
  
  // if method chrome.devtools.inspectedWindow.getResources is not implemented (ex: firefox)
  // These rules cannot be computed
  if (chrome.devtools.inspectedWindow.getResources) {
    rules.set("jsValidate", new jsValidateRule());
    rules.set("minifiedCss", new minifiedCssRule());
    rules.set("minifiedJs", new minifiedJsRule());
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

  function addExpiresOrCacheControlHeadersRule() {
    this.complianceLevel = 'A';
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
        if (cacheHeaderRatio < 95) {
          if (staticResourcesNumber - staticResourcesNumberWithCacheHeaders === 1) this.complianceLevel = 'B'
          else this.complianceLevel = 'C';
        }
        else this.complianceLevel = 'A';
        this.comment = chrome.i18n.getMessage("rule_AddExpiresOrCacheControlHeaders_Comment",
          Math.round(cacheHeaderRatio) + " % (" +
          staticResourcesNumberWithCacheHeaders +
          "/" + staticResourcesNumber + ")");
      }
    }
  }

  function domainsNumberRule() {
    this.complianceLevel = 'A';
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
      if (domains.length > 2) {
        if (domains.length === 3) this.complianceLevel = 'B';
        else this.complianceLevel = 'C';
      }
      domains.forEach(domain => {
        this.detailComment += domain + "<br>";
      });

      this.comment = chrome.i18n.getMessage("rule_DomainsNumber_Comment", String(domains.length));
    }
  }

  function compressHttpRule() {
    this.complianceLevel = 'A';
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
        if (compressRatio < 95) {
          if (compressibleResourcesNumber - compressibleResourcesNumberCompressed === 1) this.complianceLevel = 'B'
          else this.complianceLevel = 'C';
        }
        else this.complianceLevel = 'A';
        this.comment = chrome.i18n.getMessage("rule_CompressHttp_Comment",
          Math.round(compressRatio) + " % (" +
          compressibleResourcesNumberCompressed + "/" +
          compressibleResourcesNumber + ")");
      }
    }
  }

  function dontResizeImageInBrowserRule() {
    this.complianceLevel = 'A';
    this.id = "dontResizeImageInBrowser";
    this.comment = "";
    this.detailComment = "";
    this.imagesResizedInBrowserNumber = 0;
    let imgAnalysed = new Map();

    function isRevelant(entry) {
      // exclude svg
      if (entry.src.endsWith(".svg")) return false;
      if (entry.src.includes(".svg?")) return false;

      // difference of 1 pixel is not relevant 
      if (entry.naturalWidth - entry.clientWidth < 2) return false;
      if (entry.naturalHeight - entry.clientHeight < 2) return false;

      // If picture is 0x0 it meens it's not visible on the ui , see imageDownloadedNotDisplayed
      if (entry.clientWidth === 0) return false;

      return true;
    }

    this.check = function (measures) {
      measures.imagesResizedInBrowser.forEach(entry => {
        if (!imgAnalysed.has(entry.src) && isRevelant(entry)) { // Do not count two times the same picture
          this.detailComment += `${entry.src} , is resized from ${entry.naturalWidth}x${entry.naturalHeight} to ${entry.clientWidth}x${entry.clientHeight}<br>`;
          imgAnalysed.set(entry.src);
          this.imagesResizedInBrowserNumber += 1;
        }
      });
      if (this.imagesResizedInBrowserNumber > 0) this.complianceLevel = 'C';
      this.comment = chrome.i18n.getMessage("rule_DontResizeImageInBrowser_Comment", String(this.imagesResizedInBrowserNumber));
    }
  }

  function emptySrcTagRule() {
    this.complianceLevel = 'A';
    this.id = "emptySrcTag";
    this.comment = chrome.i18n.getMessage("rule_EmptySrcTag_DefaultComment");
    this.detailComment = "";

    this.check = function (measures) {
      if (measures.emptySrcTagNumber > 0) {
        this.complianceLevel = 'C';
        this.comment = chrome.i18n.getMessage("rule_EmptySrcTag_Comment", String(measures.emptySrcTagNumber));
      }
    }
  }

  function externalizeCssRule() {
    this.complianceLevel = 'A';
    this.id = "externalizeCss";
    this.comment = chrome.i18n.getMessage("rule_ExternalizeCss_DefaultComment");
    this.detailComment = "";

    this.check = function (measures) {
      if (measures.inlineStyleSheetsNumber > 0) {
        this.complianceLevel = 'C';
        this.comment = chrome.i18n.getMessage("rule_ExternalizeCss_Comment", String(measures.inlineStyleSheetsNumber));
      }
    }
  }

  function externalizeJsRule() {
    this.complianceLevel = 'A';
    this.id = "externalizeJs";
    this.comment = chrome.i18n.getMessage("rule_ExternalizeJs_DefaultComment");
    this.detailComment = "";

    this.check = function (measures) {
      if (measures.inlineJsScriptsNumber > 0) {
        if (measures.inlineJsScriptsNumber > 1) this.complianceLevel = 'C';
        this.comment = chrome.i18n.getMessage("rule_ExternalizeJs_Comment", String(measures.inlineJsScriptsNumber));

      }
    }
  }

  function httpRequestsRule() {
    this.complianceLevel = 'A';
    this.id = "httpRequests";
    this.comment = "";
    this.detailComment = "";

    this.check = function (measures) {
      if (measures.entries.length) measures.entries.forEach(entry => {
        this.detailComment += entry.request.url + "<br>";
      });
      if (measures.nbRequest > 26) this.complianceLevel = 'C';
      this.comment = chrome.i18n.getMessage("rule_HttpRequests_Comment", String(measures.nbRequest));
    }
  }

  function imageDownloadedNotDisplayedRule() {
    this.complianceLevel = 'A';
    this.id = "imageDownloadedNotDisplayed";
    this.comment = "";
    this.detailComment = "";
    this.imageDownloadedNotDisplayedNumber = 0;
    let imgAnalysed = new Map();

    function isRevelant(entry) {
      // Very small images could be download even if not display  as it may be icons 
      if (entry.naturalWidth * entry.naturalHeight < 10000) return false;
      if (entry.clientWidth === 0 && entry.clientHeight === 0) return true;
      return false;
    }

    this.check = function (measures) {
      measures.imagesResizedInBrowser.forEach(entry => {
        if (!imgAnalysed.has(entry.src) && isRevelant(entry)) { // Do not count two times the same picture
          this.detailComment += `${entry.src} , with size ${entry.naturalWidth}x${entry.naturalHeight} is not display <br>`;
          imgAnalysed.set(entry.src);
          this.imageDownloadedNotDisplayedNumber += 1;
        }
      });
      if (this.imageDownloadedNotDisplayedNumber > 0) this.complianceLevel = 'C';
      this.comment = chrome.i18n.getMessage("rule_ImageDownloadedNotDisplayed_Comment", String(this.imageDownloadedNotDisplayedNumber));
    }
  }

  function jsValidateRule() {
    this.complianceLevel = 'A';
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
        this.complianceLevel = 'C';
        this.comment = chrome.i18n.getMessage("rule_JsValidate_Comment", String(errors));
      }
    }
  }

  function maxCookiesLengthRule() {
    this.complianceLevel = 'A';
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
        if (maxCookiesLength > 512) this.complianceLevel = 'B';
        if (maxCookiesLength > 1024) this.complianceLevel = 'C';

      }
    }
  }

  function minifiedCssRule() {
    this.complianceLevel = 'A';
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
        if (percentMinifiedCss < 95) this.complianceLevel = 'C';
        else this.complianceLevel = 'A';
        this.comment = chrome.i18n.getMessage("rule_MinifiedCss_Comment",
          Math.round(percentMinifiedCss) + " % ("
          + measures.minifiedCssNumber + "/" + measures.totalCss + ")");
      }
    }
  }

  function minifiedJsRule() {
    this.complianceLevel = 'A';
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
        if (percentMinifiedJs < 95) this.complianceLevel = 'C';
        else this.complianceLevel = 'A';

        this.comment = chrome.i18n.getMessage("rule_MinifiedJs_Comment",
          Math.round(percentMinifiedJs) + " % ("
          + measures.minifiedJsNumber
          + "/" + measures.totalJs + ")");
      }
    }
  }

  function noCookieForStaticRessourcesRule() {
    this.complianceLevel = 'A';
    this.id = "noCookieForStaticRessources";
    this.comment = chrome.i18n.getMessage("rule_NoCookieForStaticRessources_DefaultComment");
    this.detailComment = "";

    this.check = function (measures) {
      let nbRessourcesStaticWithCookie = 0;
      let totalCookiesSize = 0;
      if (measures.entries.length) measures.entries.forEach(entry => {
        const cookiesLength = getCookiesLength(entry);
        if (isStaticRessource(entry) && (cookiesLength > 0)) {
          nbRessourcesStaticWithCookie++;
          totalCookiesSize += cookiesLength + 7; // 7 is size for the header name "cookie:"
          this.detailComment += entry.request.url + " has cookie <br> ";
        }
      });
      if (nbRessourcesStaticWithCookie > 0) {
        if (totalCookiesSize > 2000) this.complianceLevel = 'C';
        else this.complianceLevel = 'B';
        this.comment = chrome.i18n.getMessage("rule_NoCookieForStaticRessources_Comment", [String(nbRessourcesStaticWithCookie), String(Math.round(totalCookiesSize / 100) / 10)]);
      }
    }
  }

  function noRedirectRule() {
    this.complianceLevel = 'A';
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
      if (redirectNumber > 0) this.complianceLevel = 'C';
      this.comment = chrome.i18n.getMessage("rule_NoRedirect_Comment", String(redirectNumber));
    }
  }

  function optimizeBitmapImagesRule() {
    this.complianceLevel = 'A';
    this.id = "optimizeBitmapImages";
    this.comment = "";
    this.detailComment = "";

    this.check = function (measures) {
      let nbImagesToOptimize = 0;
      let totalMinGains = 0;
      if (measures.entries) measures.entries.forEach(entry => {
        if (entry.response) {
          const imageType = getImageTypeFromResource(entry);
          if (imageType !== "") {
            var myImage = new Image();
            myImage.src = entry.request.url;
            // needed to access object in the function after
            myImage.rule = this;

            myImage.size = entry.response.content.size;
            myImage.onload = function () {

              const minGains = getMinOptimisationGainsForImage(this.width * this.height, this.size, imageType);
              if (minGains > 500) { // exclude small gain 
                nbImagesToOptimize++;
                totalMinGains += minGains;
                this.rule.detailComment += this.src + " , " + Math.round(this.size / 1000) + "KB , " + this.width + "x" + this.height + ", possible to gain " + Math.round(minGains / 1000) + "KB <br>";
              }
              if (nbImagesToOptimize > 0) {
                if (totalMinGains < 50000) this.rule.complianceLevel = 'B';
                else this.rule.complianceLevel = 'C';
                this.rule.comment = chrome.i18n.getMessage("rule_OptimizeBitmapImages_Comment", [String(nbImagesToOptimize), String(Math.round(totalMinGains / 1000))]);
                showEcoRuleOnUI(this.rule);
              }
            }

          }
        }
      });

    }
  }

  function pluginsRule() {
    this.complianceLevel = 'A';
    this.id = "plugins";
    this.comment = chrome.i18n.getMessage("rule_Plugins_DefaultComment");
    this.detailComment = "";

    this.check = function (measures) {
      if (measures.pluginsNumber > 0) {
        this.complianceLevel = 'C';
        this.comment = chrome.i18n.getMessage("rule_Plugins_Comment", String(measures.pluginsNumber));
      }
    }
  }

  function printStyleSheetsRule() {
    this.complianceLevel = 'C';
    this.id = "printStyleSheets";
    this.comment = chrome.i18n.getMessage("rule_PrintStyleSheet_DefaultComment");
    this.detailComment = "";

    this.check = function (measures) {
      if (measures.printStyleSheetsNumber > 0) {
        this.complianceLevel = 'A';
        this.comment = chrome.i18n.getMessage("rule_PrintStyleSheet_Comment", String(measures.printStyleSheetsNumber));
      }
    }
  }

  function styleSheetsRule() {
    this.complianceLevel = 'A';
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
        if (styleSheets.length === 3) this.complianceLevel = 'B';
        else this.complianceLevel = 'C';
        this.comment = chrome.i18n.getMessage("rule_StyleSheets_Comment", String(styleSheets.length));
      }
    }
  }

  function useETagsRule() {
    this.complianceLevel = 'A';
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
        if (eTagsRatio < 95) {
          if (staticResourcesNumber - staticResourcesNumberWithETags === 1) this.complianceLevel = 'B'
          else this.complianceLevel = 'C';
        }
        else this.complianceLevel = 'A';
        this.comment = chrome.i18n.getMessage("rule_UseETags_Comment",
          Math.round(eTagsRatio) + " % (" +
          staticResourcesNumberWithETags + "/" +
          staticResourcesNumber + ")");
      }
    }
  }

  function useStandardTypefacesRule() {
    this.complianceLevel = 'A';
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
        this.complianceLevel = 'C';
        this.comment = chrome.i18n.getMessage("rule_UseStandardTypefaces_Comment", String(this.cssFontFace.length));
      }
    }
  }








}


