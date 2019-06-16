

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. 
 *
 * @author didierfred@gmail.com
 * @version 0.1
 */


function start_analyse() {
  const analyseStartingTime = Date.now();
  const dom_size = document.getElementsByTagName("*").length;
  let pageAnalysis;

  if (analyseBestPractices) {
    // test with http://www.wickham43.net/flashvideo.php
    const pluginsNumber = getPluginsNumber();
    const styleSheetsNumber = getStyleSheetsNumber();
    const printStyleSheetsNumber = getPrintStyleSheetsNumber();
    const inlineStyleSheetsNumber = getInlineStyleSheetsNumber();
    const emptySrcTagNumber = getEmptySrcTagNumber();
    const inlineJsScript = getInlineJsScript();
    const inlineJsScriptsNumber = getInlineJsScriptsNumber();
    const imageResizedInBrowserNumber = getImageResizedInBrowserNumber();
    const cssFontFaceRuleNumber = getCssFontFaceRuleNumber();


    pageAnalysis = {
      "analyseStartingTime": analyseStartingTime,
      "url": document.URL,
      "domSize": dom_size,
      "pluginsNumber": pluginsNumber,
      "styleSheetsNumber": styleSheetsNumber,
      "printStyleSheetsNumber": printStyleSheetsNumber,
      "inlineStyleSheetsNumber": inlineStyleSheetsNumber,
      "emptySrcTagNumber": emptySrcTagNumber,
      "inlineJsScript": inlineJsScript,
      "inlineJsScriptsNumber": inlineJsScriptsNumber,
      "imageResizedInBrowserNumber": imageResizedInBrowserNumber,
      "cssFontFaceRuleNumber": cssFontFaceRuleNumber
    }
  }
  else pageAnalysis = {
    "analyseStartingTime": analyseStartingTime,
    "url": document.URL,
    "domSize": dom_size
  }

  chrome.runtime.sendMessage(pageAnalysis);
}



function getPluginsNumber() {
  const plugins = document.querySelectorAll('object,embed');
  return (plugins === undefined) ? 0 : plugins.length;
}



function getStyleSheetsNumber() {
  let styleSheets = Array.from(document.styleSheets).reduce((memo, sheet) => {
    // 12/06/2019 : need to put sheet.media[0] instead of sheet.media due to compatibility with old chromium version
    let isPrint = (String(sheet.media[0]) === 'print');
    const isInlined = !sheet.href;
    //We ignore "print" and inlined CSS willingly
    if (isPrint || isInlined) return memo;
    memo.push(sheet.href);
    return memo;
  }, []);
  return styleSheets.length;

}



function getEmptySrcTagNumber() {
  return document.querySelectorAll('img[src=""]').length
    + document.querySelectorAll('script[src=""]').length
    + document.querySelectorAll('link[rel=stylesheet][href=""]').length;
}


function getPrintStyleSheetsNumber() {
  return document.querySelectorAll('link[rel=stylesheet][media~=print]').length
    + document.querySelectorAll('style[media~=print]').length;
}

function getInlineStyleSheetsNumber() {
  let styleSheetsArray = Array.from(document.styleSheets);
  let inlineStyleSheetsNumber = 0;
  styleSheetsArray.forEach(styleSheet => {
    if (!styleSheet.href) inlineStyleSheetsNumber++;
  });
  return inlineStyleSheetsNumber;
}


function getInlineJsScript() {
  let scriptArray = Array.from(document.scripts);
  let scriptText = "";
  scriptArray.forEach(script => {
    let isJSON = (String(script.type) === "application/ld+json"); // Exclude type="application/ld+json" from parsing js analyse
    if ((script.text.length > 0) && (!isJSON)) scriptText += "\n" + script.text;
  });
  return scriptText;
}

function getInlineJsScriptsNumber() {
  let scriptArray = Array.from(document.scripts);
  let inlineScriptNumber = 0;
  scriptArray.forEach(script => {
    let isJSON = (String(script.type) === "application/ld+json"); // Exclude type="application/ld+json" from count
    if ((script.text.length > 0) && (!isJSON)) inlineScriptNumber++;
  });
  return inlineScriptNumber;
}


function getImageResizedInBrowserNumber() {
  let imgArray = Array.from(document.querySelectorAll('img'));
  let imageResizedInBrowserNumber = 0;
  imgArray.forEach(img => {
    if (img.clientWidth < img.naturalWidth || img.clientHeight < img.naturalHeight) imageResizedInBrowserNumber++;
  });
  return imageResizedInBrowserNumber;
}


function getCssFontFaceRuleNumber() {

  let fontList = Array.from(document.styleSheets).reduce((fonts, sheet) => {
    try {

      // Need to check if sheet.cssRules is defined for old version of chromium 
      if (sheet.cssRules) Array.from(sheet.cssRules).reduce((fonts, cssRule) => {

        // If the rule is not a CSSFont one, skip it
        if (!(cssRule instanceof CSSFontFaceRule)) return fonts;

        // Get the custom font family
        const fontFamily = cssRule.style.getPropertyValue('font-family').replace(/^"|"$/g, '');
        if (!fonts.has(fontFamily)) fonts.add(fontFamily);

        return fonts;

      }, fonts);
    } catch (err) {
      // Accessing sheet.cssRules will throw a security error if the CSS is loaded from another domain
      if (err.name !== 'SecurityError') throw err;
    }
    return fonts;
  }, new Set());
  return fontList.size;
}

start_analyse();