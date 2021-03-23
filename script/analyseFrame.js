/*
 *  Copyright (C) 2016  The EcoMeter authors (https://gitlab.com/ecoconceptionweb/ecometer)
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

function start_analyse() {
  const analyseStartingTime = Date.now();
  const dom_size = document.getElementsByTagName("*").length;
  let pageAnalysis;
  let JSResponses=get_js_files();
  let CSSResponses=get_css_files();

  if (analyseBestPractices) {
    // test with http://www.wickham43.net/flashvideo.php
    const pluginsNumber = getPluginsNumber();
    const printStyleSheetsNumber = getPrintStyleSheetsNumber();
    const inlineStyleSheetsNumber = getInlineStyleSheetsNumber();
    const emptySrcTagNumber = getEmptySrcTagNumber();
    const inlineJsScript = getInlineJsScript();
    const inlineJsScriptsNumber = getInlineJsScriptsNumber();
    const imagesResizedInBrowser = getImagesResizedInBrowser();
    const flashNumber = getFlashNumber();
    const compressCSS = getCompressCSS();
    const incrementOperatorNumber = getIncrementOperator(JSResponses);
    const nonPrimitiveOperatorNumber = getNonPrimitiveOperatorNumber(JSResponses);
    const singleQuotesNumber = getSingleQuotes(JSResponses);
    const cacheFaviconNumber = getCacheFavicon();
    const cssPrintNumber = getCSSPrint(CSSResponses);
    const similarCSSNumber = getSimilarCSS(CSSResponses);
    const forInLoopNumber = getForInLoop(JSResponses);
    const getMethodNumber = getGetMethod(JSResponses);
    const functionInForNumber = getFunctionInFor(JSResponses);
    const ajaxMethodNumber = getAjaxMethodNumber(JSResponses);
    const abbreviatedCSSNumber = getAbbreviatedCSSNumber(CSSResponses);
    const settimeoutcount=getSettimeoutCount(JSResponses);
    const instantVisualChanges=getInstantVisualChanges(JSResponses);
    const expensiveAnimations=getExpensiveAnimations(CSSResponses);


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
      "flashNumber": flashNumber,
      "compressCSS": compressCSS,
      "incrementOperatorNumber":incrementOperatorNumber,
      "nonPrimitiveOperatorNumber" :nonPrimitiveOperatorNumber,
      "singleQuotesNumber" :singleQuotesNumber,
      "cacheFaviconNumber" :cacheFaviconNumber,
      "cssPrintNumber" :cssPrintNumber,
      "similarCSSNumber" :similarCSSNumber,
      "forInLoopNumber" :forInLoopNumber,
      "getMethodNumber" :getMethodNumber,
      "functionInForNumber" :functionInForNumber,
      "ajaxMethodNumber" :ajaxMethodNumber,
      "abbreviatedCSSNumber" :abbreviatedCSSNumber,
      "setTimeoutCount":settimeoutcount,
      "instantVisualChanges":instantVisualChanges,
      "expensiveAnimations":expensiveAnimations
    }
  }
  else pageAnalysis = {
    "analyseStartingTime": analyseStartingTime,
    "url": document.URL,
    "domSize": dom_size
  }

  chrome.runtime.sendMessage(pageAnalysis);

}


function get_js_files(){
  let scriptArray = Array.from(document.scripts);
  let result={};
  let res=null;
  let xmlhttp= new XMLHttpRequest();
  scriptArray.forEach(script => {
    let isJSON = (String(script.type) === "application/ld+json"); // Exclude type="application/ld+json" from count
    if ((!isJSON) && script.src.length >2)
    {
      xmlhttp.open("GET",script.src,false)
      xmlhttp.send();
      if(xmlhttp.status===200)
      {
        res=xmlhttp.responseText;
        result[script.src]=res;
      }
    }
    res=null;
  });
  return result;
}


function get_css_files(){
  let scriptArray = Array.from(document.styleSheets);
  let result={};
  let res=null;
  let xmlhttp= new XMLHttpRequest();
  scriptArray.forEach(script => {
    if (script.href && script.href.length >2)
    {
      xmlhttp.open("GET",script.href,false)
      xmlhttp.send();
      if(xmlhttp.status===200)
      {
        res=xmlhttp.responseText;
        result[script.href]=res;
      }
    }
    res=null;
  });
  return result;
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
    try {
      if (!styleSheet.href) inlineStyleSheetsNumber++;
    }
    catch (err) {
      console.log("GREENIT-ANALYSIS ERROR ," + err.name + " = " + err.message);
      console.log("GREENIT-ANALYSIS ERROR " + err.stack);
    }  
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
  const imgArray = Array.from(document.querySelectorAll('img'));
  let imagesResized = [];
  imgArray.forEach(img => {
    if (img.clientWidth < img.naturalWidth || img.clientHeight < img.naturalHeight) {
      // Images of one pixel are some times used ... , we exclude them
      if (img.naturalWidth > 1) 
      {
        const imageMeasures = {
          "src":img.src,
          "clientWidth":img.clientWidth,
          "clientHeight":img.clientHeight,
          "naturalWidth":img.naturalWidth,
          "naturalHeight":img.naturalHeight
        }
        imagesResized.push(imageMeasures);
      }
    }
  });
  return imagesResized;
}


//rule 47
function getInstantVisualChanges(responses) {
  let getInstantVisualChanges = 0;
  let result=responses;
  for(let res in result)
  {
    if(result[res].match(/fadeIn\(/g) || result[res].match(/[.]fadeOut\(/g))
    {
      getInstantVisualChanges++;
    }
  }
  return getInstantVisualChanges;
}

//rule 40
function getSettimeoutCount(responses) {
  let getSettimeoutCount = 0;
  let result=responses;
  for(let res in result)
  {
    if(result[res].match(/setTimeout\([',"]/g) || result[res].match(/setInterval\([',"]/g))
    {
      getSettimeoutCount++;
    }
  }
  return getSettimeoutCount;
}


//rule 14
function getFlashNumber() {
  let flash=0;
  let x = document.querySelectorAll('embed');
  let len = x.length;
  for(let i=0;i< len;i++)
  {
    let n = x[i].src;
    if(String(n).match("swf"))
    {
      flash = 1;
      break;
    }
  }
  let flashObject = document.querySelectorAll('script');
  len = flashObject.length;
  for(let i=0;i<len;i++)
  {
    if(flashObject[i].src.match("swfobject.js"))
    {
      flash=1;
    }
  }
  return flash;
}

//rule 80
function getCompressCSS() {
  let compressFlag = 0;
  let req = new XMLHttpRequest();
  req.open('GET', document.location, false);
  req.send();
  let compressHeaders = req.getResponseHeader("Content-Encoding");
  if(String(compressHeaders).match('gzip') || String(compressHeaders).match('deflate'))
  {
    compressFlag = 1;
  }

  return compressFlag;
}

//rule 70
function getIncrementOperator(responses)
{
  let count = 0;
  let result=responses;
  for(let res in result)
  {
    if(result[res].match(/\+\+(;|,|]|\))/g))
    {
      ++count;
    }
  }
  return count;
}

//rule35
function getNonPrimitiveOperatorNumber(JSResponses)
{
  let count = 0;
  let responses=JSResponses;
  let result=null;
  for(let res in responses)
  {
    result=responses[res];
    if(result.match(/Math.min\([0-9 a-z A-Z :\.,\-\#\%\!\/();\*\[\] ]*\)/g) || result.match(/Math.max\([0-9 a-z A-Z :\.,\-\#\%\!\/();\*\[\] ]*\)/g))
    {
      ++count;

    }
  }
  return count;
}

//rule69
function getSingleQuotes(JSResponses)
{
  let count = 0;
  let responses=JSResponses;
  let result=null;
  for(let res in responses)
  {
    result=responses[res];
    if(result.match(/\"[a-z A-Z 0-9]+\"/g))
    {
      ++count;

    }
  }
  return count;
}

//rule104
function getCacheFavicon()
{
  let count = 0;
  let l =  document.getElementsByTagName('link');
  // let relIconCount = 0;
  // relIconCount  = document.querySelectorAll('link[rel="shortcut icon"]').length + document.querySelectorAll('link[rel="icon"]').length;
  let len = l.length;
  for(let i=0;i<len;i++)
  {
    if(String(l[i].href).match("favicon") || String(l[i].href).match("Favicon") || l[i].rel=="icon" || l[i].rel=="shortcut icon")
    {
      let xmlhttp = new XMLHttpRequest();
      xmlhttp.open("GET", l[i].href, false);
      xmlhttp.send();
      let flag = xmlhttp.getResponseHeader("Cache-Control");
      if(String(flag).match('no-store') || !flag || String(flag).match('no-cache') )
      {
        count = 1;
      }
      break;
    }

  }
  return count;
}

//rule41
function getForInLoop(JSResponses)
{
  let count = 0;
  let responses=JSResponses;
  let result=null;
  for(let res in responses)
  {
    result=responses[res];
    if(result.match(/for\s*\(.* in .*\)/g))
    {
      ++count;

    }
  }
  return count;
}

//rul50
function getGetMethod(JSResponses)
{
  let count = 0;
  let responses=JSResponses;
  let result=null;
  for(let res in responses)
  {
    result=responses[res];
    if(result.match('POST') || result.match('post'))
    {
      ++count;
    }
  }
  return count;
}


//rule 64
function getFunctionInFor(JSResponses)
{
  let count = 0;
  let responses=JSResponses;
  let result=null;
  for(let res in responses)
  {
    result=responses[res];
    if(result.match(/for\s*(.*;.*\(.*\).*;.*).*/g) || result.match(/for\s*(.*\(.*\).*;.*.*;).*/g))
    {
      ++count;

    }
  }
  return count;
}

//rule51
function getAjaxMethodNumber(JSResponses)
{
  let count = 0;
  let responses=JSResponses;
  let result=null;
  for(let res in responses)
  {
    result=responses[res];
    if(result.match('POST') || result.match('post') || result.match('GET') || result.match('get'))
    {
      ++count;
    }
  }
  return count;
}
//rule29
function getAbbreviatedCSSNumber(CSSResponses)
{
  let count = 0;
  let responses=CSSResponses;
  let result=null;
  for(let res in responses)
  {
    result=responses[res];
    if(result.match(/\{[0-9 a-z A-Z :\.,\-\#\%\!\/();\*\[\] ]*(margin)+[[0-9 a-z A-Z :\.,\-\#\%\!\/();\*\[\] ]*(margin)+[[0-9 a-z A-Z :\.,\-\#\%\!\/();\*\[\] ]*\}/g) || result.match(/\{[0-9 a-z A-Z :\.,\-\#\%\!\/();\*\[\] ]*(padding)+[[0-9 a-z A-Z :\.,\-\#\%\!\/();\*\[\] ]*(padding)+[[0-9 a-z A-Z :\.,\-\#\%\!\/();\*\[\] ]*\}/g) || result.match(/\{[0-9 a-z A-Z :\.,\-\#\%\!\/();\*\[\] ]*(font)+[[0-9 a-z A-Z :\.,\-\#\%\!\/();\*\[\] ]*(font)+[[0-9 a-z A-Z :\.,\-\#\%\!\/();\*\[\] ]*\}/g) || result.match(/\{[0-9 a-z A-Z :\.,\-\#\%\!\/();\*\[\] ]*(border)+[[0-9 a-z A-Z :\.,\-\#\%\!\/();\*\[\] ]*(border)+[[0-9 a-z A-Z :\.,\-\#\%\!\/();\*\[\] ]*\}/g) || result.match(/\{[0-9 a-z A-Z :\.,\-\#\%\!\/();\*\[\] ]*(background)+[[0-9 a-z A-Z :\.,\-\#\%\!\/();\*\[\] ]*(background)+[[0-9 a-z A-Z :\.,\-\#\%\!\/();\*\[\] ]*\}/g))
    {
      ++count;

    }
  }
  return count;
}

//rule30
function getCSSPrint(CSSResponses)
{
  let count = 0;
  let responses=CSSResponses;
  let result=null;
  for(let res in responses)
  {
    result=responses[res];
    if(result.match('@media print'))
    {
      ++count;

    }
  }
  return count;
}

//rule28
function getSimilarCSS(CSSResponses)
{
  let count = 0;
  let CSSPattern;
  let repeatedCSS;
  let CSSlen = 0;
  let re;
  let responses=CSSResponses;
  let result=null;
  for(let res in responses)
  {
    result=responses[res];
    result = result.replace(/(\r\n|\n|\r)/gm,"");
    CSSPattern = result.match(/\{[0-9 a-z A-Z :\.,\-\#\%\!\/();\*\[\] ]*\}/g);
    if(CSSPattern)
    {
      CSSlen = CSSPattern.length;
    }
    for(let j=0;j<CSSlen;j++)
    {
      re = new RegExp(CSSPattern[j], 'g');
      repeatedCSS = result.match(re);
      if(repeatedCSS && repeatedCSS.length>1)
      {
        count++;
        break;
      }
    }
    if(count!=0)
    {
      break;
    }
  }
  return count;
}


//rule48
function getExpensiveAnimations(responses) {
  let scripts = document.styleSheets;
  let count = 0;
  let len = scripts.length;
  let will_change_count=0;
  let opacity_count=0;
  let transform_count=0;

  for(let res in responses)
  {
    result=responses[res];
    will_change_count=0;
    opacity_count=0;
    transform_count=0;
    let willchange = result.match(/will-change/g);
    will_change_count=willchange?willchange.length:0;
    let opacity = result.match(/opacity\s*:/g);
    opacity_count=opacity?opacity.length:0;
    let transform = result.match(/transform\s*:/g);
    transform_count=transform?transform.length:0;
    if(opacity_count!=0 && will_change_count !=opacity_count)
    {
      return 1;
    }
    if(transform_count!=0 && will_change_count !=transform_count)
    {
      return 1;
    }
  }

  return 0;
}


start_analyse();