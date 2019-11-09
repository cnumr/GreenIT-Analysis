

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
console.log("GITA DOM Size = " + dom_size);
  let pageAnalysis;

  if (analyseBestPractices) {
    // test with http://www.wickham43.net/flashvideo.php
    const pluginsNumber = getPluginsNumber();
    const printStyleSheetsNumber = getPrintStyleSheetsNumber();
    const inlineStyleSheetsNumber = getInlineStyleSheetsNumber();
    const emptySrcTagNumber = getEmptySrcTagNumber();
    const inlineJsScript = getInlineJsScript();
    const inlineJsScriptsNumber = getInlineJsScriptsNumber();
    const imagesResizedInBrowser = getImagesResizedInBrowser();
  console.log("GITA : resize image  done");
    const cssFontFace = getCssFontFace();
  console.log("GITA : font done");


    pageAnalysis = {
      "analyseStartingTime": analyseStartingTime,
      "url": document.URL,
      "domSize": dom_size,
      "pluginsNumber": pluginsNumber,
      "printStyleSheetsNumber": printStyleSheetsNumber,
      "inlineStyleSheetsNumber": inlineStyleSheetsNumber,
      "emptySrcTagNumber": emptySrcTagNumber,
      "inlineJsScript": inlineJsScript,
      "inlineJsScriptsNumber": inlineJsScriptsNumber,
      "imagesResizedInBrowser": imagesResizedInBrowser,
      "cssFontFace": cssFontFace,
    }
  }
  else pageAnalysis = {
    "analyseStartingTime": analyseStartingTime,
    "url": document.URL,
    "domSize": dom_size
  }

  chrome.runtime.sendMessage(pageAnalysis);
console.log("GITA : Message send");
}



function getPluginsNumber() {
  const plugins = document.querySelectorAll('object,embed');
  return (plugins === undefined) ? 0 : plugins.length;
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


function getImagesResizedInBrowser() {
  let imgArray = Array.from(document.querySelectorAll('img'));
  let imagesResized = [];
  imgArray.forEach(img => {
    if (img.clientWidth < img.naturalWidth || img.clientHeight < img.naturalHeight) 
    {
      // Images of one pixel are some times used ... , we exclude them
      if (img.naturalWidth > 1)  imagesResized.push(img.src);
    }
  });
  return imagesResized;
}


function getCssFontFace() {

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
      console.log("GREENIT-ANALYSIS ERROR ," + err.name+ " = " + err.message);
      console.log("GREENIT-ANALYSIS ERROR " + err.stack);
      if (err.name !== 'SecurityError') throw err;
    }
    return fonts;
  }, new Set());
  return Array.from(fontList);
}
start_analyse();