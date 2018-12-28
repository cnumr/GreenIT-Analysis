 

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. 
 *
 * @author didierfred@gmail.com
 * @version 0.1
 */





function start_analyse() {

  console.log("url=" + document.URL);
  var dom_size=document.getElementsByTagName("*").length;
  console.log("local dom size=" + dom_size);

// test with http://www.wickham43.net/flashvideo.php
  var pluginsNumber= getPluginsNumber();
  console.log("Plugins number = " + pluginsNumber);
  
  var styleSheetsNumber= getStyleSheetsNumber();
  console.log("StyleSheets Number = " + styleSheetsNumber);

  var emptySrcTagNumber = getEmptySrcTagNumber();
  console.log("Empty Src Tag Number  = " + emptySrcTagNumber);

  var pageAnalysis = {"url":document.URL,"domSize":dom_size,"pluginsNumber":pluginsNumber,"styleSheetsNumber":styleSheetsNumber,"emptySrcTagNumber":emptySrcTagNumber};
  
  //jsAnalyse();  

  console.log("Send result");


  chrome.runtime.sendMessage(pageAnalysis);
}



function getPluginsNumber()
{
  const plugins = document.querySelectorAll('object,embed');
  if (plugins===undefined) return 0;
  else return plugins.length;
}



function getStyleSheetsNumber() {
  var styleSheets = Array.from(document.styleSheets).reduce((memo, sheet) => {
    var isPrint =  ( String(sheet.media) === 'print');
    const isInlined = !sheet.href;
    //We ignore "print" and inlined CSS willingly
    if (isPrint || isInlined) return memo;
    memo.push(sheet.href);
    return memo;
  }, []);
  return styleSheets.length;

}

function getEmptySrcTagNumber() {
       return  document.querySelectorAll('img[src=""]').length
             + document.querySelectorAll('script[src=""]').length
             + document.querySelectorAll('link[rel=stylesheet][href=""]').length;
}


function getPrintSheetsNumber() { 
      return document.querySelectorAll('link[rel=stylesheet][media~=print]').length
           + document.querySelectorAll('style[media~=print]').length;
}

function jsAnalyse()
{
var scriptArray= Array.from(document.scripts);
scriptArray.forEach(script => {
  console.log("script:"+ script.src);
console.log("text:"+ script.text);
  });

}

start_analyse();

