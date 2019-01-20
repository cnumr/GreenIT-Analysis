

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. 
 *
 * @author didierfred@gmail.com
 */


// From https://fr.wikipedia.org/wiki/Type_MIME

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
  /^application\/font-woff2(;|$)/i,
  /^application\/vnd.ms-fontobject(;|$)/i,
  /^application\/font-sfnt(;|$)/i,
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

// utils for cache rule 
function isStaticRessource(resource) {
  const contentType = getResponseHeaderFromResource(resource, "content-type");
  return staticResources.some(value => value.test(contentType));
}

function getResponseHeaderFromResource(resource, headerName) {
  var headers = resource.response.headers;
  var headerValue = "";
  headers.forEach(header => {
    if (header.name.toLowerCase() === headerName.toLowerCase()) headerValue = header.value;
  });
  return headerValue;
}

function hasValidCacheHeaders(resource) {

  const headers = resource.response.headers;
  let cache = {};
  let isValid = false;

  for (let header, i = 0; (header = headers[i]); ++i) {
    if (header.name.toLowerCase() === 'cache-control') cache.CacheControl = header.value;
    if (header.name.toLowerCase() === 'expires') cache.Expires = header.value;
    if (header.name.toLowerCase() === 'date') cache.Date = header.value;
  }

  // debug(() => `Cache headers gathered: ${JSON.stringify(cache)}`);

  if (cache.CacheControl) {
    if ((/(no-cache)|(no-store)|(max-age\s*=\s*0)/i).test(cache.CacheControl)) {
      //debug(() => `Cache-Control header indicate a non cacheable resource: ${cache.CacheControl}`);
      isValid = false;
    } else {
      isValid = true;
    }
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
  return ((contentEncoding.length>0) && (httpCompressionTokens.indexOf(contentEncoding.toLocaleLowerCase()) !== -1));
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
  const total = scriptContent.length - 1;
  const semicolons = countChar(';', scriptContent);
  const linebreaks = countChar('\n', scriptContent);
  if (linebreaks < 2) return true;
  // Empiric method to detect minified files
  //
  // javascript code is minified if, on average:
  //  - there is more than one semicolon by line
  //  - and there are more than 100 characters by line
  const isMinified = semicolons / linebreaks > 1 && linebreaks / total < 0.01;

  return isMinified;

}


function debug(lazyString) {
  if (!DEBUG) return;
  const message = typeof lazyString === 'function' ? lazyString() : lazyString;
  console.log(`GreenIT-Analysis [DEBUG] ${message}\n`);
}
