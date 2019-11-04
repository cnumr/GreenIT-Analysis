
describe("utils.js", function () {
  const testFrame = window.frames["testFrame"].contentWindow;


  describe("#function getResponseHeaderFromResource", function () {

    beforeEach(function () {
    });

    it(" should return text/css", function () {
      const resource = { response: { status: 200, statusText: "", httpVersion: "http/2.0", headers: [{ name: "content-encoding", value: "gzip" }, { name: "content-type", value: "text/css" }, { name: "toto", value: "test" }] } };
      expect(testFrame.getResponseHeaderFromResource(resource, "content-type")).toEqual('text/css');
    });

    it(" should return gzip", function () {
      const resource = { response: { status: 200, statusText: "", httpVersion: "http/2.0", headers: [{ name: "content-encoding", value: "gzip" }, { name: "content-type", value: "text/css" }, { name: "toto", value: "test" }] } };
      expect(testFrame.getResponseHeaderFromResource(resource, "content-encoding")).toEqual('gzip');
    });

    it(" should return an empty string", function () {
      const resource = { response: { status: 200, statusText: "", httpVersion: "http/2.0", headers: [{ name: "content-encoding", value: "gzip" }, { name: "content-type", value: "text/css" }, { name: "toto", value: "test" }] } };
      expect(testFrame.getResponseHeaderFromResource(resource, "inexistant-header")).toEqual('');
    });
    afterEach(function () {
    });
  });


  describe("#function getCookiesLength", function () {

    beforeEach(function () {
    });

    it(" should return 0", function () {
      const resource = { request: { httpVersion: "http/2.0", headers: [{ name: "content-encoding", value: "gzip" }, { name: "content-type", value: "text/css" }, { name: "toto", value: "test" }] } };
      expect(testFrame.getCookiesLength(resource)).toEqual(0);
    });

    it(" should return 5", function () {
      const resource = { request: { httpVersion: "http/2.0", headers: [{ name: "content-encoding", value: "gzip" }, { name: "cookie", value: "12345" }, { name: "toto", value: "test" }] } };
      expect(testFrame.getCookiesLength(resource)).toEqual(5);
    });

    it(" should return 10", function () {
      const resource = { request: { httpVersion: "http/2.0", headers: [{ name: "content-encoding", value: "gzip" }, { name: "Cookie", value: "123456789y" }, { name: "toto", value: "test" }] } };
      expect(testFrame.getCookiesLength(resource)).toEqual(10);
    });
    afterEach(function () {
    });
  });


  describe("#function isStaticRessource", function () {

    beforeEach(function () {
    });

    it(" text/css is static , should return true ", function () {
      const resource = { response: { status: 200, statusText: "", httpVersion: "http/2.0", headers: [{ name: "content-encoding", value: "gzip" }, { name: "content-type", value: "text/css" }, { name: "toto", value: "test" }] } };
      expect(testFrame.isStaticRessource(resource)).toEqual(true);
    });

    it(" image/bmp is static , should return true", function () {
      const resource = { response: { status: 200, statusText: "", httpVersion: "http/2.0", headers: [{ name: "content-encoding", value: "gzip" }, { name: "content-type", value: "image/bmp" }, { name: "toto", value: "test" }] } };
      expect(testFrame.isStaticRessource(resource)).toEqual(true);
    });

    it(" test/test is unknown , should return false", function () {
      const resource = { response: { status: 200, statusText: "", httpVersion: "http/2.0", headers: [{ name: "content-encoding", value: "gzip" }, { name: "content-type", value: "test/test" }, { name: "toto", value: "test" }] } };
      expect(testFrame.isStaticRessource(resource)).toEqual(false);
    });
    afterEach(function () {
    });
  });

  describe("#function hasValidCacheHeaders", function () {

    beforeEach(function () {
    });

    it(" no cache header, should return false ", function () {
      const resource = { response: { status: 200, statusText: "", httpVersion: "http/2.0", headers: [{ name: "content-encoding", value: "gzip" }, { name: "content-type", value: "text/css" }, { name: "toto", value: "test" }] } };
      expect(testFrame.hasValidCacheHeaders(resource)).toEqual(false);
    });

    it(" Cache-Control=no-cache  , should return false", function () {
      const resource = { response: { headers: [{ name: 'Cache-Control', value: "no-cache" }, { name: "content-encoding", value: "gzip" }, { name: "content-type", value: "image/bmp" }, { name: "toto", value: "test" }] } };
      expect(testFrame.hasValidCacheHeaders(resource)).toEqual(false);
    });

    it(" Cache-Control=no-store , should return false", function () {
      const resource = { response: { headers: [{ name: 'Cache-Control', value: "no-store" }, { name: "content-encoding", value: "gzip" }, { name: "content-type", value: "test/test" }, { name: "toto", value: "test" }] } };
      expect(testFrame.hasValidCacheHeaders(resource)).toEqual(false);
    });


    it(" Cache expires in 2001, should return false", function () {
      const resource = { response: { headers: [{ name: 'Cache-Control', value: "test" }, { name: 'Expires', value: "Fri, 05 Jan 2001 18:09:48 GMT" }, { name: "content-encoding", value: "gzip" }, { name: "content-type", value: "test/test" }, { name: "toto", value: "test" }] } };
      expect(testFrame.hasValidCacheHeaders(resource)).toEqual(false);
    });

    it(" Cache expires in 2099, should return true", function () {
      const resource = { response: { headers: [{ name: 'Cache-Control', value: "test" }, { name: 'Expires', value: "Mon, 05 Jan 2099 18:09:48 GMT" }, { name: "content-encoding", value: "gzip" }, { name: "content-type", value: "test/test" }, { name: "toto", value: "test" }] } };
      expect(testFrame.hasValidCacheHeaders(resource)).toEqual(true);
    });

    it(" Date after Expires , shoud return false ", function () {
      const resource = { response: { headers: [{ name: 'Cache-Control', value: "test" }, { "name": "Date", "value": "Mon, 05 Jan 2099 18:33:56 GMT" }, { name: 'Expires', value: "Mon, 05 Jan 2099 18:09:48 GMT" }, { name: "content-encoding", value: "gzip" }, { name: "content-type", value: "test/test" }, { name: "toto", value: "test" }] } };
      expect(testFrame.hasValidCacheHeaders(resource)).toEqual(false);
    });

    afterEach(function () {
    });
  });

  describe("#function isCompressibleResource", function () {

    beforeEach(function () {
    });

    it(" size is <= 150  should return false ", function () {
      const resource = { response: { content: { size: 120 }, status: 200, statusText: "", httpVersion: "http/2.0", headers: [{ name: "content-encoding", value: "gzip" }, { name: "content-type", value: "text/css" }, { name: "toto", value: "test" }] } };
      expect(testFrame.isCompressibleResource(resource)).toEqual(false);
    });

    it(" image/bmp is compressible , should return true", function () {
      const resource = { response: { content: { size: 2000 }, status: 200, statusText: "", httpVersion: "http/2.0", headers: [{ name: "content-encoding", value: "gzip" }, { name: "content-type", value: "image/bmp" }, { name: "toto", value: "test" }] } };
      expect(testFrame.isCompressibleResource(resource)).toEqual(true);
    });

    it(" type test/test is unknown , should return false", function () {
      const resource = { response: { content: { size: 2000 }, status: 200, statusText: "", httpVersion: "http/2.0", headers: [{ name: "content-encoding", value: "gzip" }, { name: "content-type", value: "test/test" }, { name: "toto", value: "test" }] } };
      expect(testFrame.isCompressibleResource(resource)).toEqual(false);
    });
    afterEach(function () {
    });
  });

  describe("#function isResourceCompressed", function () {

    beforeEach(function () {
    });

    it(" content encoding is gzip  should return true", function () {
      const resource = { response: { content: { size: 120 }, status: 200, statusText: "", httpVersion: "http/2.0", headers: [{ name: "content-encoding", value: "gzip" }, { name: "content-type", value: "text/css" }, { name: "toto", value: "test" }] } };
      expect(testFrame.isResourceCompressed(resource)).toEqual(true);
    });

    it(" content encoding is GZIP  should return true", function () {
      const resource = { response: { content: { size: 2000 }, status: 200, statusText: "", httpVersion: "http/2.0", headers: [{ name: "content-encoding", value: "GZIP" }, { name: "content-type", value: "image/bmp" }, { name: "toto", value: "test" }] } };
      expect(testFrame.isResourceCompressed(resource)).toEqual(true);
    });


    it(" content encoding is TEST  should return false", function () {
      const resource = { response: { content: { size: 2000 }, status: 200, statusText: "", httpVersion: "http/2.0", headers: [{ name: "content-encoding", value: "TEST" }, { name: "content-type", value: "image/bmp" }, { name: "toto", value: "test" }] } };
      expect(testFrame.isResourceCompressed(resource)).toEqual(false);
    });

    it(" content encoding is not present , should return false", function () {
      const resource = { response: { content: { size: 2000 }, status: 200, statusText: "", httpVersion: "http/2.0", headers: [{ name: "content-type", value: "test/test" }, { name: "toto", value: "test" }] } };
      expect(testFrame.isResourceCompressed(resource)).toEqual(false);
    });
    afterEach(function () {
    });
  });


  describe("#function isRessourceUsingETag", function () {

    beforeEach(function () {
    });

    it(" using etag, should return true", function () {
      const resource = { response: { content: { size: 120 }, status: 200, statusText: "", httpVersion: "http/2.0", headers: [{ name: "content-encoding", value: "gzip" }, { name: "content-type", value: "text/css" }, { name: "ETag", value: "test" }] } };
      expect(testFrame.isRessourceUsingETag(resource)).toEqual(true);
    });

    it(" using etag, should return true", function () {
      const resource = { response: { content: { size: 120 }, status: 200, statusText: "", httpVersion: "http/2.0", headers: [{ name: "content-encoding", value: "gzip" }, { name: "content-type", value: "text/css" }, { name: "etag", value: "test" }] } };
      expect(testFrame.isRessourceUsingETag(resource)).toEqual(true);
    });

    it(" not using etag , should return false", function () {
      const resource = { response: { content: { size: 2000 }, status: 200, statusText: "", httpVersion: "http/2.0", headers: [{ name: "content-encoding", value: "GZIP" }, { name: "content-type", value: "image/bmp" }, { name: "toto", value: "test" }] } };
      expect(testFrame.isRessourceUsingETag(resource)).toEqual(false);
    });
    afterEach(function () {
    });
  });


  describe("#function getDomainFromUrl", function () {

    beforeEach(function () {
    });

    it(" http://test should return test", function () {
      expect(testFrame.getDomainFromUrl("http://test")).toEqual("test");
    });

    it(" http://test:8080 should return test", function () {
      expect(testFrame.getDomainFromUrl("http://test:8080")).toEqual("test");
    });

    it(" http://test/test should return test", function () {
      expect(testFrame.getDomainFromUrl("http://test")).toEqual("test");
    });

    it(" https://test.com should return test.com", function () {
      expect(testFrame.getDomainFromUrl("http://test.com")).toEqual("test.com");
    });

    it(" http://test.com/test.com should return test.com", function () {
      expect(testFrame.getDomainFromUrl("http://test.com/test.com")).toEqual("test.com");
    });

    it(" ftp://test.com/test.com should return test.com", function () {
      expect(testFrame.getDomainFromUrl("ftp://test.com/test.com")).toEqual("test.com");
    });

    it(" http://test.com/a/b/c should return test.com", function () {
      expect(testFrame.getDomainFromUrl("http://test.com/a/b/c")).toEqual("test.com");
    });

    it(" http:/test.com/a/b/c should return empty string", function () {
      expect(testFrame.getDomainFromUrl("http:/test.com/a/b/c")).toEqual("");
    });

    it(" http:/test.com:100/a/b/c should return empty string", function () {
      expect(testFrame.getDomainFromUrl("http:/test.com:100/a/b/c")).toEqual("");
    });

    it(" http://test.com:100/a/b/c should return test.com", function () {
      expect(testFrame.getDomainFromUrl("http://test.com:100/a/b/c")).toEqual("test.com");
    });


    afterEach(function () {
    });
  });

  describe("#function countChar", function () {

    beforeEach(function () {
    });

    it(" 2 a in aeat ", function () {
      expect(testFrame.countChar('a', "aeat")).toEqual(2);
    });

    it(" 2 a in aeatAA ", function () {
      expect(testFrame.countChar('a', "aeatAA")).toEqual(2);
    });

    it(" 0 a in AeBt ", function () {
      expect(testFrame.countChar('a', "AeBt")).toEqual(0);
    });

    it(" 10 Z in ZZZZZZZZZZaaaaaaaaaaaaaaaaaaaaaaaaaaa ", function () {
      expect(testFrame.countChar('Z', "ZZZZZZZZZZaaaaaaaaaaaaaaaaaaaaaaaaaaa")).toEqual(10);
    });

    it(" 3 ( in ())(kdfhf()) ", function () {
      expect(testFrame.countChar('(', "())(kdfhf())")).toEqual(3);
    });
    it(" 0 % in AeBt ", function () {
      expect(testFrame.countChar('%', "AeBt")).toEqual(0);
    });

    afterEach(function () {
    });
  });

  describe("#function isMinified", function () {

    const minifiedJS = "for(c=0;c<a;++c)b[c]=e[c];return f.buffer=b} F.prototype.b=function(f,e,c){var a=this.buffer,b=this.index,g=this.f,l=a[b],m;c&&1<e&&(f=8<e?(H[f&255]<<24|H[f>>>8&255]<<16|H[f>>>16&255]<<8|H[f>>>24&255])>>32-e:H[f]>>8-e);if(8>e+g)l=l<<e|f,g+=e;else for(m=0;m<e;++m)l=l<<1|f>>e-m-1&1,8===++g&&(g=0,a[b++]=H[l],l=0,b===a.length&&(a=ga(this)));a[b]=l;this.buffer=a;this.f=g;this.index=b};F.prototype.finish=function(){var f=this.buffer,e=this.index,c;0<this.f&&(f[e]<<=8-this.f,f[e]=H[f[e]],e++);C?c=f.subarray(0,e):(f.length=e,c=f);return c}";

    beforeEach(function () {
    });

    it("\" var test=0;\n test++ ; \n windows.open(test)\"  is not minified", function () {
      expect(testFrame.isMinified("var test=0;\n test++ ; \n windows.open(test)")).toEqual(false);
    });


    it("\"" + minifiedJS + "\"  is minified", function () {
      expect(testFrame.isMinified(minifiedJS)).toEqual(true);
    });

    afterEach(function () {
    });
  });

  describe("#function computeNumberOfErrorsInJSCode", function () {

    const minifiedJS = "for(c=0;c<a;++c)b[c]=e[c];return f.buffer=b} F.prototype.b=function(f,e,c){var a=this.buffer,b=this.index,g=this.f,l=a[b],m;c&&1<e&&(f=8<e?(H[f&255]<<24|H[f>>>8&255]<<16|H[f>>>16&255]<<8|H[f>>>24&255])>>32-e:H[f]>>8-e);if(8>e+g)l=l<<e|f,g+=e;else for(m=0;m<e;++m)l=l<<1|f>>e-m-1&1,8===++g&&(g=0,a[b++]=H[l],l=0,b===a.length&&(a=ga(this)));a[b]=l;this.buffer=a;this.f=g;this.index=b};F.prototype.finish=function(){var f=this.buffer,e=this.index,c;0<this.f&&(f[e]<<=8-this.f,f[e]=H[f[e]],e++);C?c=f.subarray(0,e):(f.length=e,c=f);return c}";

    beforeEach(function () {
    });

    it("var test=0; is correct javascript, shoud return 0", function () {
      expect(testFrame.computeNumberOfErrorsInJSCode("var test=0;", "test")).toEqual(0);
    });

    it("var test=0 t; is not correct javascript, shoud return 1", function () {
      expect(testFrame.computeNumberOfErrorsInJSCode("var test=0 t;", "test")).toEqual(1);
    });

    afterEach(function () {
    });
  });

  describe("#function isNetworkResource", function () {


    beforeEach(function () {
    });

    it("url is http:// should return true ", function () {
      const resource = { request: { url: "http://test", headers: [{ name: "content-encoding", value: "gzip" }, { name: "cookie", value: "12345" }, { name: "toto", value: "test" }] } };
      expect(testFrame.isNetworkResource(resource)).toEqual(true);
    });

    it("url is data: should return false ", function () {
      const resource = { request: { url: "data:test", headers: [{ name: "content-encoding", value: "gzip" }, { name: "cookie", value: "12345" }, { name: "toto", value: "test" }] } };
      expect(testFrame.isNetworkResource(resource)).toEqual(false);
    });

    afterEach(function () {
    });
  });


  describe("#function isHttpRedirectCode", function() {
    
    beforeEach(function() {	
    });
	
    it(" 301 should return true", function() {
      expect(isHttpRedirectCode(301)).toEqual(true);
    });
    it(" 302 should return true", function() {
      expect(isHttpRedirectCode(302)).toEqual(true);
    });
    it(" 303 should return true", function() {
      expect(isHttpRedirectCode(303)).toEqual(true);
    });
    it(" 307 should return true", function() {
      expect(isHttpRedirectCode(307)).toEqual(true);
    });
    it(" 200 should return false", function() {
      expect(isHttpRedirectCode(200)).toEqual(false);
    });
    it(" 201 should return false", function() {
      expect(isHttpRedirectCode(201)).toEqual(false);
    });
    it(" 404 should return false", function() {
      expect(isHttpRedirectCode(404)).toEqual(false);
    });

    afterEach(function() {
    });
  });


  describe("#function getImageTypeFromResource", function () {


    beforeEach(function () {
    });

    it("no content type , should return an empty String", function () {
      const resource = { response: { url: "http://test", headers: [{ name: "content-encoding", value: "gzip" },{ name: "toto", value: "test" }] } };
      expect(testFrame.getImageTypeFromResource(resource)).toEqual("");
    });
    it("content type is not an image type , should return an empty String ", function () {
      const resource = { response: { url: "http://test", headers: [{ name: "content-type", value: "test" }, { name: "cookie", value: "12345" }] } };
      expect(testFrame.getImageTypeFromResource(resource)).toEqual("");
    });
    it("content type is image/png, should return png", function () {
      const resource = { response: { url: "http://test", headers: [{ name: "content-type", value: "image/png" },{ name: "toto", value: "test" }] } };
      expect(testFrame.getImageTypeFromResource(resource)).toEqual("png");
    });
    it("content type is image/jpg, should return jpeg", function () {
      const resource = { response: { url: "http://test", headers: [{ name: "content-type", value: "image/jpeg" },{ name: "toto", value: "test" }] } };
      expect(testFrame.getImageTypeFromResource(resource)).toEqual("jpeg");
    });
    it("content type is image/gif, should return gif", function () {
      const resource = { response: { url: "http://test", headers: [{ name: "content-type", value: "image/gif" },{ name: "toto", value: "test" }] } };
      expect(testFrame.getImageTypeFromResource(resource)).toEqual("gif");
    });
    it("content type is image/bmp, should return bmp", function () {
      const resource = { response: { url: "http://test", headers: [{ name: "content-type", value: "image/bmp" },{ name: "toto", value: "test" }] } };
      expect(testFrame.getImageTypeFromResource(resource)).toEqual("bmp");
    });
    it("content type is image/tiff, should return tiff", function () {
      const resource = { response: { url: "http://test", headers: [{ name: "content-type", value: "image/tiff" },{ name: "toto", value: "test" }] } };
      expect(testFrame.getImageTypeFromResource(resource)).toEqual("tiff");
    });
    afterEach(function () {
    });
  });
  describe("#function isImageResolutionOptimized", function() {
    
    beforeEach(function() {	
    });
	
    it(" image png size 700000 should return false", function() {
      expect(isImageResolutionOptimized(1000,700000,"png")).toEqual(false);
    });
    it(" image bmp size 800000 should return false", function() {
      expect(isImageResolutionOptimized(1000,800000,"bmp")).toEqual(false);
    });
    it(" image png size 1000 should return true", function() {
      expect(isImageResolutionOptimized(1000,1000,"png")).toEqual(true);
    });
    it(" image png size 10000 should return true", function() {
      expect(isImageResolutionOptimized(1000,1000,"png")).toEqual(true);
    });
    it(" image jpeg size 1500 should return true", function() {
      expect(isImageResolutionOptimized(1000,1500,"jpeg")).toEqual(true);
    });
    it(" image png pixel=200000 size=100000 should return false", function() {
      expect(isImageResolutionOptimized(200000,100000,"png")).toEqual(false);
    });
    it(" image tiff pixel=200000 size=100000 should return false", function() {
      expect(isImageResolutionOptimized(200000,100000,"tiff")).toEqual(false);
    });
    it(" image png pixel=400000 size=100000 should return false", function() {
      expect(isImageResolutionOptimized(400000,100000,"png")).toEqual(false);
    });
    it(" image jpeg pixel=400000 size=100000 should return false", function() {
      expect(isImageResolutionOptimized(400000,100000,"jpeg")).toEqual(false);
    });
    it(" image png pixel=400001 size=80000 should return true", function() {
      expect(isImageResolutionOptimized(400001,80000,"png")).toEqual(true);
    });
    it(" image jpeg pixel=400001 size=80000 should return true", function() {
      expect(isImageResolutionOptimized(400001,80000,"jpeg")).toEqual(true);
    });
    it(" image jpeg pixel=10000 size=1000 should return true", function() {
      expect(isImageResolutionOptimized(10000,1000,"jpeg")).toEqual(true);
    });
    it(" image jpeg pixel=20000 size=10000 should return false", function() {
      expect(isImageResolutionOptimized(20000,10000,"jpeg")).toEqual(false);
    });
    afterEach(function() {
    });
  });
});

