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


const DEBUG = true;
/*
requirejs.config({
  //By default load any module IDs from script
  baseUrl: 'script/externalLibs',
});

// Load module require.js
requirejs(['esprima'],
  (esprima) => console.log("Load esprima module"));
*/

const compressibleImage = [
  /^image\/bmp(;|$)/i,
  /^image\/svg\+xml(;|$)/i,
  /^image\/vnd\.microsoft\.icon(;|$)/i,
  /^image\/x-icon(;|$)/i,
];

const image = [
  /^image\/gif(;|$)/i,
  /^image\/jpeg(;|$)/i,
  /^image\/png(;|$)/i,
  /^image\/tiff(;|$)/i,
].concat(compressibleImage);

const css = [
  /^text\/css(;|$)/i,
];

const javascript = [
  /^text\/javascript(;|$)/i,
  /^application\/javascript(;|$)/i,
  /^application\/x-javascript(;|$)/i,
];

const compressibleFont = [
  /^font\/eot(;|$)/i,
  /^font\/opentype(;|$)/i,
];

const font = [
  /^application\/x-font-ttf(;|$)/i,
  /^application\/x-font-opentype(;|$)/i,
  /^application\/font-woff(;|$)/i,
  /^application\/x-font-woff(;|$)/i,
  /^application\/font-woff2(;|$)/i,
  /^application\/vnd.ms-fontobject(;|$)/i,
  /^application\/font-sfnt(;|$)/i,
  /^font\/woff2(;|$)/i,
].concat(compressibleFont);

const manifest = [
  /^text\/cache-manifest(;|$)/i,
  /^application\/x-web-app-manifest\+json(;|$)/i,
  /^application\/manifest\+json(;|$)/i,
];

// Mime types from H5B project recommendations
// See https://github.com/h5bp/server-configs-apache/blob/master/dist/.htaccess#L741
const compressible = [
  /^text\/html(;|$)/i,
  /^text\/plain(;|$)/i,
  /^text\/xml(;|$)/i,
  /^application\/json(;|$)/i,
  /^application\/atom\+xml(;|$)/i,
  /^application\/ld\+json(;|$)/i,
  /^application\/rdf\+xml(;|$)/i,
  /^application\/rss\+xml(;|$)/i,
  /^application\/schema\+json(;|$)/i,
  /^application\/vnd\.geo\+json(;|$)/i,
  /^application\/vnd\.ms-fontobject(;|$)/i,
  /^application\/xhtml\+xml(;|$)/i,
  /^application\/xml(;|$)/i,
  /^text\/vcard(;|$)/i,
  /^text\/vnd\.rim\.location\.xloc(;|$)/i,
  /^text\/vtt(;|$)/i,
  /^text\/x-component(;|$)/i,
  /^text\/x-cross-domain-policy(;|$)/i,
].concat(javascript, css, compressibleImage, compressibleFont, manifest);

const audio = [
  /^audio\/mpeg(;|$)/i,
  /^audio\/x-ms-wma(;|$)/i,
  /^audio\/vnd.rn-realaudio(;|$)/i,
  /^audio\/x-wav(;|$)/i,
  /^application\/ogg(;|$)/i,
];

const video = [
  /^video\/mpeg(;|$)/i,
  /^video\/mp4(;|$)/i,
  /^video\/quicktime(;|$)/i,
  /^video\/x-ms-wmv(;|$)/i,
  /^video\/x-msvideo(;|$)/i,
  /^video\/x-flv(;|$)/i,
  /^video\/webm(;|$)/i,
];

const others = [
  /^application\/x-shockwave-flash(;|$)/i,
  /^application\/octet-stream(;|$)/i,
  /^application\/pdf(;|$)/i,
  /^application\/zip(;|$)/i,
];

const staticResources = [].concat(image, javascript, font, css, audio, video, manifest, others);


const httpCompressionTokens = [
  'br',
  'compress',
  'deflate',
  'gzip',
  'pack200-gzip',
];

const httpRedirectCodes = [301, 302, 303, 307];

// utils for cache rule 
function isStaticRessource(resource) {
  const contentType = getResponseHeaderFromResource(resource, "content-type");
  return staticResources.some(value => value.test(contentType));
}

function isFontResource(resource) {
  const contentType = getResponseHeaderFromResource(resource, "content-type");
  if (font.some(value => value.test(contentType))) return true;
  // if not check url , because sometimes content-type is set to text/plain 
  if (contentType === "text/plain" || contentType==="" || contentType =="application/octet-stream") {
    const url = resource.request.url;
    if (url.endsWith(".woff")) return true;
    if (url.endsWith(".woff2")) return true;
    if (url.includes(".woff?")) return true;
    if (url.includes(".woff2?")) return true;
    if (url.includes(".woff2.json")) return true;
  }
  return false;
}

function getHeaderWithName(headers, headerName) {
  let headerValue = "";
  headers.forEach(header => {
    if (header.name.toLowerCase() === headerName.toLowerCase()) headerValue = header.value;
  });
  return headerValue;
}

function getResponseHeaderFromResource(resource, headerName) {
  return getHeaderWithName(resource.response.headers, headerName);
}

function getCookiesLength(resource) {
  let cookies = getHeaderWithName(resource.request.headers, "cookie");
  if (cookies) return cookies.length;
  else return 0;
}


function hasValidCacheHeaders(resource) {

  const headers = resource.response.headers;
  let cache = {};
  let isValid = false;

  headers.forEach(header => {
    if (header.name.toLowerCase() === 'cache-control') cache.CacheControl = header.value;
    if (header.name.toLowerCase() === 'expires') cache.Expires = header.value;
    if (header.name.toLowerCase() === 'date') cache.Date = header.value;
  });

  // debug(() => `Cache headers gathered: ${JSON.stringify(cache)}`);

  if (cache.CacheControl) {
    if (!(/(no-cache)|(no-store)|(max-age\s*=\s*0)/i).test(cache.CacheControl)) isValid = true;
  }

  if (cache.Expires) {
    let now = cache.Date ? new Date(cache.Date) : new Date();
    let expires = new Date(cache.Expires);
    // Expires is in the past
    if (expires < now) {
      //debug(() => `Expires header is in the past ! ${now.toString()} < ${expires.toString()}`);
      isValid = false;
    }
  }

  return isValid;
}


// utils for compress rule 
function isCompressibleResource(resource) {
  if (resource.response.content.size <= 150) return false;
  const contentType = getResponseHeaderFromResource(resource, "content-type");
  return compressible.some(value => value.test(contentType));
}

function isResourceCompressed(resource) {
  const contentEncoding = getResponseHeaderFromResource(resource, "content-encoding");
  return ((contentEncoding.length > 0) && (httpCompressionTokens.indexOf(contentEncoding.toLocaleLowerCase()) !== -1));
}

// utils for ETags rule 
function isRessourceUsingETag(resource) {
  const eTag = getResponseHeaderFromResource(resource, "ETag");
  if (eTag === "") return false;
  return true;
}

function getDomainFromUrl(url) {
  var elements = url.split("//");
  if (elements[1] === undefined) return "";
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
  str.split("").forEach(curr => {
    if (curr === char) total++;
  });
  return total;
}

/**
 * Detect minification for Javascript and CSS files
 */
function isMinified(scriptContent) {

  if (!scriptContent) return true;
  if (scriptContent.length === 0) return true;
  const total = scriptContent.length - 1;
  const semicolons = countChar(';', scriptContent);
  const linebreaks = countChar('\n', scriptContent);
  if (linebreaks < 2) return true;
  // Empiric method to detect minified files
  //
  // javascript code is minified if, on average:
  //  - there is more than one semicolon by line
  //  - and there are more than 100 characters by line
  return semicolons / linebreaks > 1 && linebreaks / total < 0.01;

}

/**
 * Detect network resources (data urls embedded in page is not network resource)
 *  Test with request.url as  request.httpVersion === "data"  does not work with old chrome version (example v55)
 */
function isNetworkResource(harEntry) {
  return !(harEntry.request.url.startsWith("data"));
}

/**
 * Detect non-network resources (data urls embedded in page)
 *  Test with request.url as  request.httpVersion === "data"  does not work with old chrome version (example v55)
 */
function isDataResource(harEntry) {
  return (harEntry.request.url.startsWith("data"));
}

function computeNumberOfErrorsInJSCode(code, url) {
  let errorNumber = 0;
  try {
    const syntax = require("esprima").parse(code, { tolerant: true, sourceType: 'script', loc: true });
    if (syntax.errors) {
      if (syntax.errors.length > 0) {
        errorNumber += syntax.errors.length;
        debug(() => `url ${url} : ${Syntax.errors.length} errors`);
      }
    }
  } catch (err) {
    errorNumber++;
    debug(() => `url ${url} : ${err} `);
  }
  return errorNumber;
}

function isHttpRedirectCode(code) {
  return httpRedirectCodes.some(value => value === code);
}


function getImageTypeFromResource(resource) {
  const contentType = getResponseHeaderFromResource(resource, "content-type");
  if (contentType === "image/png") return "png";
  if (contentType === "image/jpeg") return "jpeg";
  if (contentType === "image/gif") return "gif";
  if (contentType === "image/bmp") return "bmp";
  if (contentType === "image/tiff") return "tiff";
  return "";
}


function getMinOptimisationGainsForImage(pixelsNumber, imageSize, imageType) {

  // difficult to get good compression when image is small , images less than 10Kb are considered optimized
  if (imageSize < 10000) return 0;

  // image png or gif < 50Kb  are considered optimized (used for transparency not supported in jpeg format)
  if ((imageSize < 50000) && ((imageType === 'png') || (imageType === 'gif'))) return 0;

  let imgMaxSize = Math.max(pixelsNumber / 5, 10000); //  difficult to get under 10Kb 

  // image > 500Kb are too big for web site , there are considered never optimized 
  if (imageSize > 500000) return Math.max(imageSize - 500000, imageSize - imgMaxSize);

  return Math.max(0, imageSize - imgMaxSize);
}

function isSvgUrl(url) {
  if (url.endsWith(".svg")) return true;
  if (url.includes(".svg?")) return true;
  return false;
}

function isSvgOptimized(svgImage) {
  if (svgImage.length < 1000) return true; // do not consider image < 1KB 
  if (svgImage.search(" <") === -1) return true;
  return false;
}



function getOfficialSocialButtonFormUrl(url)
{
  if (url.includes("platform.twitter.com/widgets.js")) return "tweeter";
  if (url.includes("platform.linkedin.com/in.js")) return "linkedin"; 
  if (url.includes("assets.pinterest.com/js/pinit.js")) return "pinterest";
  if (url.includes("connect.facebook.net") && url.includes("sdk.js")) return "facebook"; 
  if (url.includes("platform-api.sharethis.com/js/sharethis.js")) return "sharethis.com (mutliple social network) ";
  if (url.includes("s7.addthis.com/js/300/addthis_widget.js")) return "addthis.com (mutliple social network) ";
  if (url.includes("static.addtoany.com/menu/page.js")) return "addtoany.com (mutliple social network) ";
  return "";
}

function debug(lazyString) {
  if (!DEBUG) return;
  const message = typeof lazyString === 'function' ? lazyString() : lazyString;
  console.log(`GreenIT-Analysis [DEBUG] ${message}\n`);
}
