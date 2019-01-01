 

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. 
 *
 * @author didierfred@gmail.com
 */


requirejs.config({
    //By default load any module IDs from script
    baseUrl: 'script',
});

// Start the main app logic.
requirejs(['esprima'],

function   (esprima) {
  console.log("Start Green Module");

  const DEBUG = true;
 
  var backgroundPageConnection;
  var ecoRules;
  var measures;


  initPanel(); 

  function initPanel() {
    openBackgroundPageConnection();
    document.getElementById('launchAnalyse').addEventListener('click',function (e) {launchAnalyse();});
    //document.getElementById('viewHistory').addEventListener('click',function (e) {viewHistory();});	
	
  }

  function openBackgroundPageConnection() {
    // Create a connection to the background page
    backgroundPageConnection = chrome.runtime.connect({
      name: "greenDevPanel-page"
    });

    backgroundPageConnection.onMessage.addListener(function (frameMeasures) {
      // Handle responses from the background page
      //console.log("Analyse received = " + JSON.stringify(frameMeasures));
      aggregateFrameMeasures(frameMeasures);
      refreshUI();
    });
  }

  function aggregateFrameMeasures(frameMeasures) {
  
    debug(() => `receive from frameAnalyse.js ${JSON.stringify(frameMeasures)}`);

    measures.domSize += frameMeasures.domSize;
    measures.ecoIndex = calculEcoIndex(measures.domSize,measures.nbRequest,Math.round(measures.responsesSize/1000));
    measures.grade = getEcoIndexGrade(measures.ecoIndex);
 
    measures.pluginsNumber += frameMeasures.pluginsNumber;
    if (measures.pluginsNumber>0) {
      ecoRules.get("plugins").status = "NOK";
      ecoRules.get("plugins").comment = measures.pluginsNumber + " plugin(s) found";
    }
 
    if (measures.styleSheetsNumber < frameMeasures.styleSheetsNumber) {
      measures.styleSheetsNumber = frameMeasures.styleSheetsNumber;
      if (measures.styleSheetsNumber>2) {
        ecoRules.get("styleSheets").status = "NOK";
        ecoRules.get("styleSheets").comment = measures.styleSheetsNumber + " stylesheets found for at least one frame";
      }
    }

    measures.printStyleSheetsNumber += frameMeasures.printStyleSheetsNumber;
    if (measures.printStyleSheetsNumber > 0 ) {
      ecoRules.get("printStyleSheets").status = "OK";
      ecoRules.get("printStyleSheets").comment = measures.printStyleSheetsNumber + " print StyleSheet(s) found";
    }

    if (measures.inlineStyleSheetsNumber < frameMeasures.inlineStyleSheetsNumber) {
      measures.inlineStyleSheetsNumber = frameMeasures.inlineStyleSheetsNumber;
      if (measures.inlineStyleSheetsNumber>0) {
        ecoRules.get("externalizeCss").status = "NOK";
        ecoRules.get("externalizeCss").comment = measures.inlineStyleSheetsNumber + " inline stylesheets found ";
      }
    }

    measures.emptySrcTagNumber += frameMeasures.emptySrcTagNumber;
    if (measures.emptySrcTagNumber>0) {
      ecoRules.get("emptySrcTag").status = "NOK";
      ecoRules.get("emptySrcTag").comment = measures.emptySrcTagNumber + " empty src tag(s) found";
    }
    
    if (frameMeasures.inlineJsScript.length>0 ) analyseJsCode(frameMeasures.inlineJsScript,"inline");
   
    if (measures.inlineJsScriptsNumber < frameMeasures.inlineJsScriptsNumber) {
      measures.inlineJsScriptsNumber = frameMeasures.inlineJsScriptsNumber;
      if (measures.inlineJsScriptsNumber > 0) {
        if (measures.inlineJsScriptsNumber>1) ecoRules.get("externalizeJs").status = "NOK";
        ecoRules.get("externalizeJs").comment = measures.inlineJsScriptsNumber + " inline  javascripts found ";
      }
      
    }


  }

  function refreshUI() {
    document.getElementById("results").hidden= false; 
    document.getElementById("requestNumber").innerHTML = measures.nbRequest;
    document.getElementById("responsesSize").innerHTML = measures.responsesSize/1000 + "(" +measures.responsesSizeUncompress/1000 + ")" ;
    document.getElementById("domSize").innerHTML = measures.domSize;
    document.getElementById("ecoIndex").innerHTML = measures.ecoIndex;
    document.getElementById("grade").innerHTML = '<span class="grade ' + measures.grade +'">' + measures.grade + '</span>';
    ecoRules.forEach(showEcoRuleOnUI) ;
  }

  function showEcoRuleOnUI(ecoRule) {
    if (ecoRule!== undefined) {
      document.getElementById(ecoRule.ruleId + "_status").src = "icons/" + ecoRule.status+ ".png";
      document.getElementById(ecoRule.ruleId + "_comment").innerHTML = ecoRule.comment;
    }
  }


  function launchAnalyse() {

    initializeMeasures();
    initializeEcoRules() 
 
    // Launch analyse via injection of a script in each frame of the current tab
    backgroundPageConnection.postMessage({
      tabId: chrome.devtools.inspectedWindow.tabId,
      scriptToInject: "script/analyseFrame.js"
    });
    
    getNetworkMeasure(); 
    getResourcesMeasure();
  }


  function initializeMeasures()
  {
  measures  = {"domSize":0,
               "nbRequest":0,
               "responsesSize":0,
               "responsesSizeUncompress":0,
               "ecoIndex":100,
	       "grade":'A',
               "pluginsNumber":0,
               "styleSheetsNumber":0,
               "printStyleSheetsNumber":0,
               "inlineStyleSheetsNumber":0,
               "minifiedCssNumber":0,
               "totalCss":0,
               "percentMinifiedCss":0,
               "emptySrcTagNumber":0,
               "jsErrorsNumber":0,
               "inlineJsScriptsNumber":0,
               "minifiedJsNumber":0,
               "totalJs":0,
               "percentMinifiedJs":0,
               "domainsNumber":0
              };
  }


  function initializeEcoRules() {
    ecoRules = new Map();
    ecoRules.set("plugins",{ruleId:"plugins",status:"OK",comment:"No plugin found"});
    ecoRules.set("styleSheets",{ruleId:"styleSheets",status:"OK",comment:"Not more that 2 stylesheets per frame found"});
    ecoRules.set("printStyleSheets",{ruleId:"printStyleSheets",status:"NOK",comment:"Not print stylesheet found"});
    ecoRules.set("externalizeCss",{ruleId:"externalizeCss",status:"OK",comment:"No inline stylesheet found"});
    ecoRules.set("minifiedCss",{ruleId:"minifiedCss",status:"OK",comment:"No css found"});
    ecoRules.set("emptySrcTag",{ruleId:"emptySrcTag",status:"OK",comment:"No empty src tags found"});
    ecoRules.set("jsValidate",{ruleId:"jsValidate",status:"OK",comment:"Javascript validate"});
    ecoRules.set("externalizeJs",{ruleId:"externalizeJs",status:"OK",comment:"No inline JavaScript"});
    ecoRules.set("minifiedJs",{ruleId:"minifiedJs",status:"OK",comment:"No js found"});
    ecoRules.set("httpRequests",{ruleId:"httpRequests",status:"OK",comment:""});
    ecoRules.set("domainsNumber",{ruleId:"domainsNumber",status:"OK",comment:""});
  }


  function getNetworkMeasure() {
  chrome.devtools.network.getHAR(function(result) {
      var entries = result.entries;
      var  domains = [];
      if (entries.length) {
        measures.nbRequest = entries.length;
        for (var i = 0; i < entries.length; ++i) {
//console.log("entries = " + JSON.stringify(entries[i]));  
          measures.responsesSize+= entries[i].response._transferSize;
          measures.responsesSizeUncompress += entries[i].response.content.size;
          let domain = getDomainFromUrl(entries[i].request.url);
          if (domains.indexOf(domain)===-1) {
            domains.push(domain);
            debug(() => `found domain ${domain}`);
          }
        }
        ecoRules.get("httpRequests").comment = measures.nbRequest + " HTTP request(s) "
        if (measures.nbRequest > 26) ecoRules.get("httpRequests").status = "NOK";

        measures.domainsNumber=domains.length;
        ecoRules.get("domainsNumber").comment = domains.length + " domain(s) found";
        if (measures.domainsNumber > 2) ecoRules.get("domainsNumber").status = "NOK";


        refreshUI();
          
      }
    });
  }

  function getResourcesMeasure() {
    chrome.devtools.inspectedWindow.getResources(function(resources) {
      for (let i = 0; i < resources.length; ++i) { 
        debug(() => `resource =  ${JSON.stringify(resources[i])}`);     
        if ((resources[i].type==='script')|| (resources[i].type==='stylesheet'))  {
           let resourceAnalyser = new ResourceAnalyser(resources[i]);
           resourceAnalyser.analyse();
        }
      }
    });
  }


function analyseJsCode(code,url) {

 try {
    const syntax = esprima.parse(code, { tolerant: true, sourceType: 'script', loc: true });
    if (syntax.errors) {
      if (syntax.errors.length > 0) {
        measures.jsErrorsNumber += syntax.errors.length;
        debug(() => `url ${url} : ${Syntax.errors.length} errors`);
      }
    }
  } catch (err) {
    measures.jsErrorsNumber++;
    debug(() => `url ${url} : ${err} `);
  }
  if (measures.jsErrorsNumber>0) {
    ecoRules.get("jsValidate").status="NOK";
    ecoRules.get("jsValidate").comment = measures.jsErrorsNumber + " javascript error(s) found";
  }
  refreshUI();
}


function ResourceAnalyser(resource) {
  var resourceToAnalyse = resource ;

  this.analyse = function() {
    resourceToAnalyse.getContent(this.analyseJs);
    };

  this.analyseJs = function(code) {
    // exclude from analyse the injected script 
    if (resourceToAnalyse.type==='script') 
      if (!resourceToAnalyse.url.includes("script/analyseFrame.js")) {
        analyseJsCode(code,resourceToAnalyse.url); 
        analyseMinifiedJs(code,resourceToAnalyse.url);
      }
    if (resourceToAnalyse.type==='stylesheet')  analyseMinifiedCss(code,resourceToAnalyse.url);
  }
}


  function analyseMinifiedJs(code,url) {
    measures.totalJs ++;
    if (isMinified(code)) {
      measures.minifiedJsNumber ++;
      debug(() => `${url} is minified`);
    }
    else debug(() => `${url} is not minified`);
    measures.percentMinifiedJs = measures.minifiedJsNumber / measures.totalJs  * 100;
    if (measures.percentMinifiedJs <95)  ecoRules.get("minifiedJs").status = "NOK";
    else ecoRules.get("minifiedJs").status = "OK";
    ecoRules.get("minifiedJs").comment = measures.percentMinifiedJs + " % ("+ measures.minifiedJsNumber+"/"+measures.totalJs +")minified javascript ";
    refreshUI();
  }


  function analyseMinifiedCss(code,url) {
    measures.totalCss ++;
    if (isMinified(code)) {
      measures.minifiedCssNumber ++;
      debug(() => `${url} is minified`);
    }
    else debug(() => `${url} is not minified`);
    measures.percentMinifiedCss = measures.minifiedCssNumber / measures.totalCss  * 100;
    if (measures.percentMinifiedCss <95)  ecoRules.get("minifiedCss").status = "NOK";
    else ecoRules.get("minifiedCss").status = "OK";
    ecoRules.get("minifiedCss").comment = measures.percentMinifiedCss + " % ("+ measures.minifiedCssNumber+"/"+measures.totalCss +") minified stylesheet ";
    refreshUI();
  }


  function getDomainFromUrl(url) {
    var elements = url.split("//");
    if (elements[1]===undefined) return "";
    else {
      elements = elements[1].split('/'); // get domain with port
      elements = elements[0].split(':'); // get domain without port 
    }
    return elements[0];
  }

  /**
  * Count character occurences in the given string
  */
  function countChar(char, str) {
    let total = 0;
    for (let curr, i = 0; (curr = str[i]); i++) {
      if (curr === char) total++;
    }
    return total;
  }

  /**
   * Detect minification for Javascript and CSS files
   */
  function isMinified(scriptContent) {

    if (!scriptContent) return true;

    const total = scriptContent.length-1;
    const semicolons = countChar(';', scriptContent);
    const linebreaks = countChar('\n', scriptContent);

    // Empiric method to detect minified files
    //
    // javascript code is minified if, on average:
    //  - there is more than one semicolon by line
    //  - and there are more than 100 characters by line
    const isMinified = semicolons/linebreaks > 1 && linebreaks/total < 0.01;

    return isMinified;

  }


  function debug(lazyString) {
    if (!DEBUG) return;
    const message = typeof lazyString === 'function' ? lazyString() : lazyString;
    console.log(`GreenIT-Analysis [DEBUG] ${message}\n`);
  }
});


