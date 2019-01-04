 

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. 
 *
 * @author didierfred@gmail.com
 */


  
  function isRessourceCacheable(resource)
  {
	  const contentType = getContentTypeFromResource(resource);
	  return isContentTypeCacheable(contentType);
  }
  
  function getContentTypeFromResource(resource) {
	var headers = resource.response.headers;
	var contentType ="";
	headers.forEach(header => {
		if (header.name==="content-type") contentType =  header.value;
	});
	return contentType;
  }

  
  function isContentTypeCacheable(contentType) {
	  return false;
  }
  
  function analyseCacheableRessource(resource)
  {
	  
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
    if (scriptContent.length === 0) returntrue;
    const total = scriptContent.length-1;
    const semicolons = countChar(';', scriptContent);
    const linebreaks = countChar('\n', scriptContent);
    if (linebreaks < 2) return true; 
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


