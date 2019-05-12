
describe("utils.js", function() {
    const testFrame = window.frames["testFrame"].contentWindow;  


  describe("#function getResponseHeaderFromResource", function() {
    
    beforeEach(function() {	
    });
	
    it(" should return text/css", function() {
	    const resource = {response: {status:200,statusText:"",httpVersion:"http/2.0",headers:[{name:"content-encoding",value:"gzip"},{name:"content-type",value:"text/css"},{name:"toto",value:"test"}]}};
      expect(testFrame.getResponseHeaderFromResource(resource,"content-type")).toEqual('text/css');
    });

    it(" should return gzip", function() {
	    const resource = {response: {status:200,statusText:"",httpVersion:"http/2.0",headers:[{name:"content-encoding",value:"gzip"},{name:"content-type",value:"text/css"},{name:"toto",value:"test"}]}};
      expect(testFrame.getResponseHeaderFromResource(resource,"content-encoding")).toEqual('gzip');
    });

    it(" should return an empty string", function() {
	    const resource = {response: {status:200,statusText:"",httpVersion:"http/2.0",headers:[{name:"content-encoding",value:"gzip"},{name:"content-type",value:"text/css"},{name:"toto",value:"test"}]}};
      expect(testFrame.getResponseHeaderFromResource(resource,"inexistant-header")).toEqual('');
    });
    afterEach(function() {
    });
  });


  describe("#function isStaticRessource", function() {
 
    beforeEach(function() {	
    });
	
    it(" text/css is static , should return true ", function() {
	    const resource = {response: {status:200,statusText:"",httpVersion:"http/2.0",headers:[{name:"content-encoding",value:"gzip"},{name:"content-type",value:"text/css"},{name:"toto",value:"test"}]}};
      expect(testFrame.isStaticRessource(resource)).toEqual(true);
    });

    it(" image/bmp is static , should return true", function() {
	    const resource = {response: {status:200,statusText:"",httpVersion:"http/2.0",headers:[{name:"content-encoding",value:"gzip"},{name:"content-type",value:"image/bmp"},{name:"toto",value:"test"}]}};
      expect(testFrame.isStaticRessource(resource)).toEqual(true);
    });

    it(" test/test is unknown , should return false", function() {
	    const resource = {response: {status:200,statusText:"",httpVersion:"http/2.0",headers:[{name:"content-encoding",value:"gzip"},{name:"content-type",value:"test/test"},{name:"toto",value:"test"}]}};
      expect(testFrame.isStaticRessource(resource)).toEqual(false);
    });
    afterEach(function() {
    });
  });

  describe("#function hasValidCacheHeaders", function() {
 
    beforeEach(function() {	
    });
	
    it(" no cache header, should return false ", function() {
	    const resource = {response: {status:200,statusText:"",httpVersion:"http/2.0",headers:[{name:"content-encoding",value:"gzip"},{name:"content-type",value:"text/css"},{name:"toto",value:"test"}]}};
      expect(testFrame.hasValidCacheHeaders(resource)).toEqual(false);
    });

    it(" Cache-Control=no-cache  , should return false", function() {
	    const resource = {response: {headers:[{name:'Cache-Control',value:"no-cache"},{name:"content-encoding",value:"gzip"},{name:"content-type",value:"image/bmp"},{name:"toto",value:"test"}]}};
      expect(testFrame.hasValidCacheHeaders(resource)).toEqual(false);
    });

    it(" Cache-Control=no-store , should return false", function() {
	    const resource = {response: {headers:[{name:'Cache-Control',value:"no-store"},{name:"content-encoding",value:"gzip"},{name:"content-type",value:"test/test"},{name:"toto",value:"test"}]}};
      expect(testFrame.hasValidCacheHeaders(resource)).toEqual(false);
    });


    it(" Cache expires in 2001, should return false", function() {
	    const resource = {response: {headers:[{name:'Cache-Control',value:"test"},{name:'Expires',value:"Fri, 05 Jan 2001 18:09:48 GMT"},{name:"content-encoding",value:"gzip"},{name:"content-type",value:"test/test"},{name:"toto",value:"test"}]}};
      expect(testFrame.hasValidCacheHeaders(resource)).toEqual(false);
    });

    it(" Cache expires in 2099, should return true", function() {
	    const resource = {response: {headers:[{name:'Cache-Control',value:"test"},{name:'Expires',value:"Mon, 05 Jan 2099 18:09:48 GMT"},{name:"content-encoding",value:"gzip"},{name:"content-type",value:"test/test"},{name:"toto",value:"test"}]}};
      expect(testFrame.hasValidCacheHeaders(resource)).toEqual(true);
    });

    it(" Date after Expires , shoud return false ", function() {
	    const resource = {response: {headers:[{name:'Cache-Control',value:"test"},{"name":"Date","value":"Mon, 05 Jan 2099 18:33:56 GMT"},{name:'Expires',value:"Mon, 05 Jan 2099 18:09:48 GMT"},{name:"content-encoding",value:"gzip"},{name:"content-type",value:"test/test"},{name:"toto",value:"test"}]}};
      expect(testFrame.hasValidCacheHeaders(resource)).toEqual(false);
    });

    afterEach(function() {
    });
  });

  describe("#function isCompressibleResource", function() {
 
    beforeEach(function() {	
    });
	
    it(" size is <= 150  should return false ", function() {
	    const resource = {response: {content:{size:120},status:200,statusText:"",httpVersion:"http/2.0",headers:[{name:"content-encoding",value:"gzip"},{name:"content-type",value:"text/css"},{name:"toto",value:"test"}]}};
      expect(testFrame.isCompressibleResource(resource)).toEqual(false);
    });

    it(" image/bmp is compressible , should return true", function() {
	    const resource = {response: {content:{size:2000},status:200,statusText:"",httpVersion:"http/2.0",headers:[{name:"content-encoding",value:"gzip"},{name:"content-type",value:"image/bmp"},{name:"toto",value:"test"}]}};
      expect(testFrame.isCompressibleResource(resource)).toEqual(true);
    });

    it(" type test/test is unknown , should return false", function() {
	    const resource = {response: {content:{size:2000},status:200,statusText:"",httpVersion:"http/2.0",headers:[{name:"content-encoding",value:"gzip"},{name:"content-type",value:"test/test"},{name:"toto",value:"test"}]}};
      expect(testFrame.isCompressibleResource(resource)).toEqual(false);
    });
    afterEach(function() {
    });
  });
  
  describe("#function isResourceCompressed", function() {
 
    beforeEach(function() {	
    });
	
    it(" content encoding is gzip  should return true", function() {
	    const resource = {response: {content:{size:120},status:200,statusText:"",httpVersion:"http/2.0",headers:[{name:"content-encoding",value:"gzip"},{name:"content-type",value:"text/css"},{name:"toto",value:"test"}]}};
      expect(testFrame.isResourceCompressed(resource)).toEqual(true);
    });

    it(" content encoding is GZIP  should return true", function() {
	    const resource = {response: {content:{size:2000},status:200,statusText:"",httpVersion:"http/2.0",headers:[{name:"content-encoding",value:"GZIP"},{name:"content-type",value:"image/bmp"},{name:"toto",value:"test"}]}};
      expect(testFrame.isResourceCompressed(resource)).toEqual(true);
    });


    it(" content encoding is TEST  should return false", function() {
	    const resource = {response: {content:{size:2000},status:200,statusText:"",httpVersion:"http/2.0",headers:[{name:"content-encoding",value:"TEST"},{name:"content-type",value:"image/bmp"},{name:"toto",value:"test"}]}};
      expect(testFrame.isResourceCompressed(resource)).toEqual(false);
    });

    it(" content encoding is not present , should return false", function() {
	    const resource = {response: {content:{size:2000},status:200,statusText:"",httpVersion:"http/2.0",headers:[{name:"content-type",value:"test/test"},{name:"toto",value:"test"}]}};
      expect(testFrame.isResourceCompressed(resource)).toEqual(false);
    });
    afterEach(function() {
    });
  });


  describe("#function isRessourceUsingETag", function() {
 
    beforeEach(function() {	
    });
	
    it(" using etag, should return true", function() {
	    const resource = {response: {content:{size:120},status:200,statusText:"",httpVersion:"http/2.0",headers:[{name:"content-encoding",value:"gzip"},{name:"content-type",value:"text/css"},{name:"ETag",value:"test"}]}};
      expect(testFrame.isRessourceUsingETag(resource)).toEqual(true);
    });

    it(" using etag, should return true", function() {
	    const resource = {response: {content:{size:120},status:200,statusText:"",httpVersion:"http/2.0",headers:[{name:"content-encoding",value:"gzip"},{name:"content-type",value:"text/css"},{name:"etag",value:"test"}]}};
      expect(testFrame.isRessourceUsingETag(resource)).toEqual(true);
    });

    it(" not using etag , should return false", function() {
	    const resource = {response: {content:{size:2000},status:200,statusText:"",httpVersion:"http/2.0",headers:[{name:"content-encoding",value:"GZIP"},{name:"content-type",value:"image/bmp"},{name:"toto",value:"test"}]}};
      expect(testFrame.isRessourceUsingETag(resource)).toEqual(false);
    });
    afterEach(function() {
    });
  });


  describe("#function getDomainFromUrl", function() {
 
    beforeEach(function() {	
    });
	
    it(" http://test should return test", function() {
	      expect(testFrame.getDomainFromUrl("http://test")).toEqual("test");
    });

    it(" http://test:8080 should return test", function() {
        expect(testFrame.getDomainFromUrl("http://test:8080")).toEqual("test");
    });

    it(" http://test/test should return test", function() {
        expect(testFrame.getDomainFromUrl("http://test")).toEqual("test");
    });

    it(" https://test.com should return test.com", function() {
        expect(testFrame.getDomainFromUrl("http://test.com")).toEqual("test.com");
    });

    it(" http://test.com/test.com should return test.com", function() {
        expect(testFrame.getDomainFromUrl("http://test.com/test.com")).toEqual("test.com");
    });

    it(" ftp://test.com/test.com should return test.com", function() {
        expect(testFrame.getDomainFromUrl("ftp://test.com/test.com")).toEqual("test.com");
    });

    it(" http://test.com/a/b/c should return test.com", function() {
        expect(testFrame.getDomainFromUrl("http://test.com/a/b/c")).toEqual("test.com");
    });

    it(" http:/test.com/a/b/c should return empty string", function() {
        expect(testFrame.getDomainFromUrl("http:/test.com/a/b/c")).toEqual("");
    });

    it(" http:/test.com:100/a/b/c should return empty string", function() {
        expect(testFrame.getDomainFromUrl("http:/test.com:100/a/b/c")).toEqual("");
    });

    it(" http://test.com:100/a/b/c should return test.com", function() {
        expect(testFrame.getDomainFromUrl("http://test.com:100/a/b/c")).toEqual("test.com");
    });


    afterEach(function() {
    });
  });

  describe("#function countChar", function() {
 
    beforeEach(function() {	
    });
	
    it(" 2 a in aeat ", function() {
	      expect(testFrame.countChar('a',"aeat")).toEqual(2);
    });

    it(" 2 a in aeatAA ", function() {
        expect(testFrame.countChar('a',"aeatAA")).toEqual(2);
    });

    it(" 0 a in AeBt ", function() {
        expect(testFrame.countChar('a',"AeBt")).toEqual(0);
    });

    it(" 10 Z in ZZZZZZZZZZaaaaaaaaaaaaaaaaaaaaaaaaaaa ", function() {
        expect(testFrame.countChar('Z',"ZZZZZZZZZZaaaaaaaaaaaaaaaaaaaaaaaaaaa")).toEqual(10);
    });

    it(" 3 ( in ())(kdfhf()) ", function() {
        expect(testFrame.countChar('(',"())(kdfhf())")).toEqual(3);
    });
    it(" 0 % in AeBt ", function() {
        expect(testFrame.countChar('%',"AeBt")).toEqual(0);
    });

    afterEach(function() {
    });
  });

  describe("#function isMinified", function() {
 
    const minifiedJS = "for(c=0;c<a;++c)b[c]=e[c];return f.buffer=b} F.prototype.b=function(f,e,c){var a=this.buffer,b=this.index,g=this.f,l=a[b],m;c&&1<e&&(f=8<e?(H[f&255]<<24|H[f>>>8&255]<<16|H[f>>>16&255]<<8|H[f>>>24&255])>>32-e:H[f]>>8-e);if(8>e+g)l=l<<e|f,g+=e;else for(m=0;m<e;++m)l=l<<1|f>>e-m-1&1,8===++g&&(g=0,a[b++]=H[l],l=0,b===a.length&&(a=ga(this)));a[b]=l;this.buffer=a;this.f=g;this.index=b};F.prototype.finish=function(){var f=this.buffer,e=this.index,c;0<this.f&&(f[e]<<=8-this.f,f[e]=H[f[e]],e++);C?c=f.subarray(0,e):(f.length=e,c=f);return c}";

    beforeEach(function() {	
    });
	
    it("\" var test=0;\n test++ ; \n windows.open(test)\"  is not minified", function() {
	      expect(testFrame.isMinified("var test=0;\n test++ ; \n windows.open(test)")).toEqual(false);
    });


    it("\"" + minifiedJS + "\"  is minified", function() {
        expect(testFrame.isMinified(minifiedJS)).toEqual(true);
    });

    afterEach(function() {
    });
  });


});

