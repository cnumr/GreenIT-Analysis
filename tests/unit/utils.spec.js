import { describe, expect, it } from "vitest";
import {
  countChar,
  getCookiesLength,
  getDomainFromUrl,
  getImageTypeFromResource,
  getMinOptimisationGainsForImage,
  getResponseHeaderFromResource,
  hasValidCacheHeaders,
  isCompressibleResource,
  isFontResource,
  isHttpRedirectCode,
  isMinified,
  isNetworkResource,
  isResourceCompressed,
  isRessourceUsingETag,
  isStaticRessource,
  isSvgOptimized,
  isSvgUrl,
} from "@/entrypoints/devtools-panel/script/utils";

describe("utils.js", () => {
  describe("#function getResponseHeaderFromResource", () => {
    it(" should return text/css", () => {
      const resource = {
        response: {
          status: 200,
          statusText: "",
          httpVersion: "http/2.0",
          headers: [
            { name: "content-encoding", value: "gzip" },
            { name: "content-type", value: "text/css" },
            { name: "toto", value: "test" },
          ],
        },
      };
      expect(getResponseHeaderFromResource(resource, "content-type")).toEqual(
        "text/css",
      );
    });

    it(" should return gzip", () => {
      const resource = {
        response: {
          status: 200,
          statusText: "",
          httpVersion: "http/2.0",
          headers: [
            { name: "content-encoding", value: "gzip" },
            { name: "content-type", value: "text/css" },
            { name: "toto", value: "test" },
          ],
        },
      };
      expect(
        getResponseHeaderFromResource(resource, "content-encoding"),
      ).toEqual("gzip");
    });

    it(" should return an empty string", () => {
      const resource = {
        response: {
          status: 200,
          statusText: "",
          httpVersion: "http/2.0",
          headers: [
            { name: "content-encoding", value: "gzip" },
            { name: "content-type", value: "text/css" },
            { name: "toto", value: "test" },
          ],
        },
      };
      expect(
        getResponseHeaderFromResource(resource, "inexistant-header"),
      ).toEqual("");
    });
  });

  describe("#function getCookiesLength", () => {
    it(" should return 0", () => {
      const resource = {
        request: {
          httpVersion: "http/2.0",
          headers: [
            { name: "content-encoding", value: "gzip" },
            { name: "content-type", value: "text/css" },
            { name: "toto", value: "test" },
          ],
        },
      };
      expect(getCookiesLength(resource)).toEqual(0);
    });

    it(" should return 5", () => {
      const resource = {
        request: {
          httpVersion: "http/2.0",
          headers: [
            { name: "content-encoding", value: "gzip" },
            { name: "cookie", value: "12345" },
            { name: "toto", value: "test" },
          ],
        },
      };
      expect(getCookiesLength(resource)).toEqual(5);
    });

    it(" should return 10", () => {
      const resource = {
        request: {
          httpVersion: "http/2.0",
          headers: [
            { name: "content-encoding", value: "gzip" },
            { name: "Cookie", value: "123456789y" },
            { name: "toto", value: "test" },
          ],
        },
      };
      expect(getCookiesLength(resource)).toEqual(10);
    });
  });

  describe("#function isStaticRessource", () => {
    it(" text/css is static , should return true ", () => {
      const resource = {
        response: {
          status: 200,
          statusText: "",
          httpVersion: "http/2.0",
          headers: [
            { name: "content-encoding", value: "gzip" },
            { name: "content-type", value: "text/css" },
            { name: "toto", value: "test" },
          ],
        },
      };
      expect(isStaticRessource(resource)).toEqual(true);
    });

    it(" image/bmp is static , should return true", () => {
      const resource = {
        response: {
          status: 200,
          statusText: "",
          httpVersion: "http/2.0",
          headers: [
            { name: "content-encoding", value: "gzip" },
            { name: "content-type", value: "image/bmp" },
            { name: "toto", value: "test" },
          ],
        },
      };
      expect(isStaticRessource(resource)).toEqual(true);
    });

    it(" test/test is unknown , should return false", () => {
      const resource = {
        response: {
          status: 200,
          statusText: "",
          httpVersion: "http/2.0",
          headers: [
            { name: "content-encoding", value: "gzip" },
            { name: "content-type", value: "test/test" },
            { name: "toto", value: "test" },
          ],
        },
      };
      expect(isStaticRessource(resource)).toEqual(false);
    });
  });

  describe("#function isFontRessource", () => {
    it("application/font-woff is font , should return true ", () => {
      const resource = {
        response: {
          status: 200,
          statusText: "",
          httpVersion: "http/2.0",
          headers: [
            { name: "content-encoding", value: "gzip" },
            { name: "content-type", value: "application/font-woff" },
            { name: "toto", value: "test" },
          ],
        },
      };
      expect(isFontResource(resource)).toEqual(true);
    });

    it(" application/font-woff2 is font, should return true", () => {
      const resource = {
        response: {
          status: 200,
          statusText: "",
          httpVersion: "http/2.0",
          headers: [
            { name: "content-encoding", value: "gzip" },
            { name: "content-type", value: "application/font-woff" },
            { name: "toto", value: "test" },
          ],
        },
      };
      expect(isFontResource(resource)).toEqual(true);
    });

    it(" test/css is not font , should return false", () => {
      const resource = {
        request: { url: "http://test/" },
        response: {
          status: 200,
          statusText: "",
          httpVersion: "http/2.0",
          headers: [
            { name: "content-encoding", value: "gzip" },
            { name: "content-type", value: "text/css" },
            { name: "toto", value: "test" },
          ],
        },
      };
      expect(isFontResource(resource)).toEqual(false);
    });

    it(" text/plain is not font if extension file  is not woff or woff 2 , should return false", () => {
      const resource = {
        request: { url: "http://test/test.bmp" },
        response: {
          status: 200,
          statusText: "",
          httpVersion: "http/2.0",
          headers: [
            { name: "content-encoding", value: "gzip" },
            { name: "content-type", value: "text/plain" },
            { name: "toto", value: "test" },
          ],
        },
      };
      expect(isFontResource(resource)).toEqual(false);
    });

    it(" text/plain is  font if extension file  is woff, should return true", () => {
      const resource = {
        request: { url: "http://test/test.woff" },
        response: {
          status: 200,
          statusText: "",
          httpVersion: "http/2.0",
          headers: [
            { name: "content-encoding", value: "gzip" },
            { name: "content-type", value: "text/plain" },
            { name: "toto", value: "test" },
          ],
        },
      };
      expect(isFontResource(resource)).toEqual(true);
    });

    it(" text/plain is  font if extension file  is woff2, should return true", () => {
      const resource = {
        request: { url: "http://test/test.woff2?test" },
        response: {
          status: 200,
          statusText: "",
          httpVersion: "http/2.0",
          headers: [
            { name: "content-encoding", value: "gzip" },
            { name: "content-type", value: "text/plain" },
            { name: "toto", value: "test" },
          ],
        },
      };
      expect(isFontResource(resource)).toEqual(true);
    });

    it(" no content type is  font if extension file  is woff2, should return true", () => {
      const resource = {
        request: { url: "http://test/test.woff2?test" },
        response: {
          status: 200,
          statusText: "",
          httpVersion: "http/2.0",
          headers: [
            { name: "content-encoding", value: "gzip" },
            { name: "toto", value: "test" },
          ],
        },
      };
      expect(isFontResource(resource)).toEqual(true);
    });
  });

  describe("#function hasValidCacheHeaders", () => {
    it(" no cache header, should return false ", () => {
      const resource = {
        response: {
          status: 200,
          statusText: "",
          httpVersion: "http/2.0",
          headers: [
            { name: "content-encoding", value: "gzip" },
            { name: "content-type", value: "text/css" },
            { name: "toto", value: "test" },
          ],
        },
      };
      expect(hasValidCacheHeaders(resource)).toEqual(false);
    });

    it(" Cache-Control=no-cache  , should return false", () => {
      const resource = {
        response: {
          headers: [
            { name: "Cache-Control", value: "no-cache" },
            { name: "content-encoding", value: "gzip" },
            { name: "content-type", value: "image/bmp" },
            { name: "toto", value: "test" },
          ],
        },
      };
      expect(hasValidCacheHeaders(resource)).toEqual(false);
    });

    it(" Cache-Control=no-store , should return false", () => {
      const resource = {
        response: {
          headers: [
            { name: "Cache-Control", value: "no-store" },
            { name: "content-encoding", value: "gzip" },
            { name: "content-type", value: "test/test" },
            { name: "toto", value: "test" },
          ],
        },
      };
      expect(hasValidCacheHeaders(resource)).toEqual(false);
    });

    it(" Cache expires in 2001, should return false", () => {
      const resource = {
        response: {
          headers: [
            { name: "Cache-Control", value: "test" },
            { name: "Expires", value: "Fri, 05 Jan 2001 18:09:48 GMT" },
            { name: "content-encoding", value: "gzip" },
            { name: "content-type", value: "test/test" },
            { name: "toto", value: "test" },
          ],
        },
      };
      expect(hasValidCacheHeaders(resource)).toEqual(false);
    });

    it(" Cache expires in 2099, should return true", () => {
      const resource = {
        response: {
          headers: [
            { name: "Cache-Control", value: "test" },
            { name: "Expires", value: "Mon, 05 Jan 2099 18:09:48 GMT" },
            { name: "content-encoding", value: "gzip" },
            { name: "content-type", value: "test/test" },
            { name: "toto", value: "test" },
          ],
        },
      };
      expect(hasValidCacheHeaders(resource)).toEqual(true);
    });

    it(" Date after Expires , shoud return false ", () => {
      const resource = {
        response: {
          headers: [
            { name: "Cache-Control", value: "test" },
            { name: "Date", value: "Mon, 05 Jan 2099 18:33:56 GMT" },
            { name: "Expires", value: "Mon, 05 Jan 2099 18:09:48 GMT" },
            { name: "content-encoding", value: "gzip" },
            { name: "content-type", value: "test/test" },
            { name: "toto", value: "test" },
          ],
        },
      };
      expect(hasValidCacheHeaders(resource)).toEqual(false);
    });
  });

  describe("#function isCompressibleResource", () => {
    it(" size is <= 150  should return false ", () => {
      const resource = {
        response: {
          content: { size: 120 },
          status: 200,
          statusText: "",
          httpVersion: "http/2.0",
          headers: [
            { name: "content-encoding", value: "gzip" },
            { name: "content-type", value: "text/css" },
            { name: "toto", value: "test" },
          ],
        },
      };
      expect(isCompressibleResource(resource)).toEqual(false);
    });

    it(" image/bmp is compressible , should return true", () => {
      const resource = {
        response: {
          content: { size: 2000 },
          status: 200,
          statusText: "",
          httpVersion: "http/2.0",
          headers: [
            { name: "content-encoding", value: "gzip" },
            { name: "content-type", value: "image/bmp" },
            { name: "toto", value: "test" },
          ],
        },
      };
      expect(isCompressibleResource(resource)).toEqual(true);
    });

    it(" type test/test is unknown , should return false", () => {
      const resource = {
        response: {
          content: { size: 2000 },
          status: 200,
          statusText: "",
          httpVersion: "http/2.0",
          headers: [
            { name: "content-encoding", value: "gzip" },
            { name: "content-type", value: "test/test" },
            { name: "toto", value: "test" },
          ],
        },
      };
      expect(isCompressibleResource(resource)).toEqual(false);
    });
  });

  describe("#function isResourceCompressed", () => {
    it(" content encoding is gzip  should return true", () => {
      const resource = {
        response: {
          content: { size: 120 },
          status: 200,
          statusText: "",
          httpVersion: "http/2.0",
          headers: [
            { name: "content-encoding", value: "gzip" },
            { name: "content-type", value: "text/css" },
            { name: "toto", value: "test" },
          ],
        },
      };
      expect(isResourceCompressed(resource)).toEqual(true);
    });

    it(" content encoding is GZIP  should return true", () => {
      const resource = {
        response: {
          content: { size: 2000 },
          status: 200,
          statusText: "",
          httpVersion: "http/2.0",
          headers: [
            { name: "content-encoding", value: "GZIP" },
            { name: "content-type", value: "image/bmp" },
            { name: "toto", value: "test" },
          ],
        },
      };
      expect(isResourceCompressed(resource)).toEqual(true);
    });

    it(" content encoding is compress  should return true", () => {
      const resource = {
        response: {
          content: { size: 2000 },
          status: 200,
          statusText: "",
          httpVersion: "http/2.0",
          headers: [
            { name: "content-encoding", value: "compress" },
            { name: "content-type", value: "image/bmp" },
            { name: "toto", value: "test" },
          ],
        },
      };
      expect(isResourceCompressed(resource)).toEqual(true);
    });

    it(" content encoding is TEST  should return false", () => {
      const resource = {
        response: {
          content: { size: 2000 },
          status: 200,
          statusText: "",
          httpVersion: "http/2.0",
          headers: [
            { name: "content-encoding", value: "TEST" },
            { name: "content-type", value: "image/bmp" },
            { name: "toto", value: "test" },
          ],
        },
      };
      expect(isResourceCompressed(resource)).toEqual(false);
    });

    it(" content encoding is not present , should return false", () => {
      const resource = {
        response: {
          content: { size: 2000 },
          status: 200,
          statusText: "",
          httpVersion: "http/2.0",
          headers: [
            { name: "content-type", value: "test/test" },
            { name: "toto", value: "test" },
          ],
        },
      };
      expect(isResourceCompressed(resource)).toEqual(false);
    });
  });

  describe("#function isRessourceUsingETag", () => {
    it(" using etag, should return true", () => {
      const resource = {
        response: {
          content: { size: 120 },
          status: 200,
          statusText: "",
          httpVersion: "http/2.0",
          headers: [
            { name: "content-encoding", value: "gzip" },
            { name: "content-type", value: "text/css" },
            { name: "ETag", value: "test" },
          ],
        },
      };
      expect(isRessourceUsingETag(resource)).toEqual(true);
    });

    it(" using etag, should return true", () => {
      const resource = {
        response: {
          content: { size: 120 },
          status: 200,
          statusText: "",
          httpVersion: "http/2.0",
          headers: [
            { name: "content-encoding", value: "gzip" },
            { name: "content-type", value: "text/css" },
            { name: "etag", value: "test" },
          ],
        },
      };
      expect(isRessourceUsingETag(resource)).toEqual(true);
    });

    it(" not using etag , should return false", () => {
      const resource = {
        response: {
          content: { size: 2000 },
          status: 200,
          statusText: "",
          httpVersion: "http/2.0",
          headers: [
            { name: "content-encoding", value: "GZIP" },
            { name: "content-type", value: "image/bmp" },
            { name: "toto", value: "test" },
          ],
        },
      };
      expect(isRessourceUsingETag(resource)).toEqual(false);
    });
  });

  describe("#function getDomainFromUrl", () => {
    it(" http://test should return test", () => {
      expect(getDomainFromUrl("http://test")).toEqual("test");
    });

    it(" http://test:8080 should return test", () => {
      expect(getDomainFromUrl("http://test:8080")).toEqual("test");
    });

    it(" http://test/test should return test", () => {
      expect(getDomainFromUrl("http://test")).toEqual("test");
    });

    it(" https://test.com should return test.com", () => {
      expect(getDomainFromUrl("http://test.com")).toEqual("test.com");
    });

    it(" http://test.com/test.com should return test.com", () => {
      expect(getDomainFromUrl("http://test.com/test.com")).toEqual("test.com");
    });

    it(" ftp://test.com/test.com should return test.com", () => {
      expect(getDomainFromUrl("ftp://test.com/test.com")).toEqual("test.com");
    });

    it(" http://test.com/a/b/c should return test.com", () => {
      expect(getDomainFromUrl("http://test.com/a/b/c")).toEqual("test.com");
    });

    it(" http:/test.com/a/b/c should return empty string", () => {
      expect(getDomainFromUrl("http:/test.com/a/b/c")).toEqual("");
    });

    it(" http:/test.com:100/a/b/c should return empty string", () => {
      expect(getDomainFromUrl("http:/test.com:100/a/b/c")).toEqual("");
    });

    it(" http://test.com:100/a/b/c should return test.com", () => {
      expect(getDomainFromUrl("http://test.com:100/a/b/c")).toEqual("test.com");
    });
  });

  describe("#function countChar", () => {
    it(" 2 a in aeat ", () => {
      expect(countChar("a", "aeat")).toEqual(2);
    });

    it(" 2 a in aeatAA ", () => {
      expect(countChar("a", "aeatAA")).toEqual(2);
    });

    it(" 0 a in AeBt ", () => {
      expect(countChar("a", "AeBt")).toEqual(0);
    });

    it(" 10 Z in ZZZZZZZZZZaaaaaaaaaaaaaaaaaaaaaaaaaaa ", () => {
      expect(countChar("Z", "ZZZZZZZZZZaaaaaaaaaaaaaaaaaaaaaaaaaaa")).toEqual(
        10,
      );
    });

    it(" 3 ( in ())(kdfhf()) ", () => {
      expect(countChar("(", "())(kdfhf())")).toEqual(3);
    });
    it(" 0 % in AeBt ", () => {
      expect(countChar("%", "AeBt")).toEqual(0);
    });
  });

  describe("#function isMinified", () => {
    const minifiedJS =
      "for(c=0;c<a;++c)b[c]=e[c];return f.buffer=b} F.prototype.b=function(f,e,c){var a=this.buffer,b=this.index,g=this.f,l=a[b],m;c&&1<e&&(f=8<e?(H[f&255]<<24|H[f>>>8&255]<<16|H[f>>>16&255]<<8|H[f>>>24&255])>>32-e:H[f]>>8-e);if(8>e+g)l=l<<e|f,g+=e;else for(m=0;m<e;++m)l=l<<1|f>>e-m-1&1,8===++g&&(g=0,a[b++]=H[l],l=0,b===a.length&&(a=ga(this)));a[b]=l;this.buffer=a;this.f=g;this.index=b};F.prototype.finish=function(){var f=this.buffer,e=this.index,c;0<this.f&&(f[e]<<=8-this.f,f[e]=H[f[e]],e++);C?c=f.subarray(0,e):(f.length=e,c=f);return c}";

    it('" var test=0;\n test++ ; \n windows.open(test)"  is not minified', () => {
      expect(
        isMinified("var test=0;\n test++ ; \n windows.open(test)"),
      ).toEqual(false);
    });

    it(`"${minifiedJS}"  is minified`, () => {
      expect(isMinified(minifiedJS)).toEqual(true);
    });
  });

  describe("#function isNetworkResource", () => {
    it("url is http:// should return true ", () => {
      const resource = {
        request: {
          url: "http://test",
          headers: [
            { name: "content-encoding", value: "gzip" },
            { name: "cookie", value: "12345" },
            { name: "toto", value: "test" },
          ],
        },
      };
      expect(isNetworkResource(resource)).toEqual(true);
    });

    it("url is data: should return false ", () => {
      const resource = {
        request: {
          url: "data:test",
          headers: [
            { name: "content-encoding", value: "gzip" },
            { name: "cookie", value: "12345" },
            { name: "toto", value: "test" },
          ],
        },
      };
      expect(isNetworkResource(resource)).toEqual(false);
    });
  });

  describe("#function isHttpRedirectCode", () => {
    it(" 301 should return true", () => {
      expect(isHttpRedirectCode(301)).toEqual(true);
    });
    it(" 302 should return true", () => {
      expect(isHttpRedirectCode(302)).toEqual(true);
    });
    it(" 303 should return true", () => {
      expect(isHttpRedirectCode(303)).toEqual(true);
    });
    it(" 307 should return true", () => {
      expect(isHttpRedirectCode(307)).toEqual(true);
    });
    it(" 200 should return false", () => {
      expect(isHttpRedirectCode(200)).toEqual(false);
    });
    it(" 201 should return false", () => {
      expect(isHttpRedirectCode(201)).toEqual(false);
    });
    it(" 404 should return false", () => {
      expect(isHttpRedirectCode(404)).toEqual(false);
    });
  });

  describe("#function getImageTypeFromResource", () => {
    it("no content type , should return an empty String", () => {
      const resource = {
        response: {
          url: "http://test",
          headers: [
            { name: "content-encoding", value: "gzip" },
            { name: "toto", value: "test" },
          ],
        },
      };
      expect(getImageTypeFromResource(resource)).toEqual("");
    });
    it("content type is not an image type , should return an empty String ", () => {
      const resource = {
        response: {
          url: "http://test",
          headers: [
            { name: "content-type", value: "test" },
            { name: "cookie", value: "12345" },
          ],
        },
      };
      expect(getImageTypeFromResource(resource)).toEqual("");
    });
    it("content type is image/png, should return png", () => {
      const resource = {
        response: {
          url: "http://test",
          headers: [
            { name: "content-type", value: "image/png" },
            { name: "toto", value: "test" },
          ],
        },
      };
      expect(getImageTypeFromResource(resource)).toEqual("png");
    });
    it("content type is image/jpg, should return jpeg", () => {
      const resource = {
        response: {
          url: "http://test",
          headers: [
            { name: "content-type", value: "image/jpeg" },
            { name: "toto", value: "test" },
          ],
        },
      };
      expect(getImageTypeFromResource(resource)).toEqual("jpeg");
    });
    it("content type is image/gif, should return gif", () => {
      const resource = {
        response: {
          url: "http://test",
          headers: [
            { name: "content-type", value: "image/gif" },
            { name: "toto", value: "test" },
          ],
        },
      };
      expect(getImageTypeFromResource(resource)).toEqual("gif");
    });
    it("content type is image/bmp, should return bmp", () => {
      const resource = {
        response: {
          url: "http://test",
          headers: [
            { name: "content-type", value: "image/bmp" },
            { name: "toto", value: "test" },
          ],
        },
      };
      expect(getImageTypeFromResource(resource)).toEqual("bmp");
    });
    it("content type is image/tiff, should return tiff", () => {
      const resource = {
        response: {
          url: "http://test",
          headers: [
            { name: "content-type", value: "image/tiff" },
            { name: "toto", value: "test" },
          ],
        },
      };
      expect(getImageTypeFromResource(resource)).toEqual("tiff");
    });
  });

  describe("#function getMinOptimisationGainsForImage", () => {
    it(" image png , pixels=5000000 and size=700000  should return 200000", () => {
      expect(getMinOptimisationGainsForImage(5000000, 700000, "png")).toEqual(
        200000,
      );
    });
    it(" image bmp , pixels=100000 size 30000 should return 10000", () => {
      expect(getMinOptimisationGainsForImage(100000, 30000, "bmp")).toEqual(
        10000,
      );
    });
    it(" image png size 1000 should return 0", () => {
      expect(getMinOptimisationGainsForImage(1000, 1000, "png")).toEqual(0);
    });
    it(" image png pixels=200000 size 20000 should return 0", () => {
      expect(getMinOptimisationGainsForImage(200000, 20000, "png")).toEqual(0);
    });
    it(" image jpeg size 1500 should return 0", () => {
      expect(getMinOptimisationGainsForImage(1000, 1500, "jpeg")).toEqual(0);
    });
    it(" image png pixel=200000 size=100000 should return 60000", () => {
      expect(getMinOptimisationGainsForImage(200000, 100000, "png")).toEqual(
        60000,
      );
    });
    it(" image tiff pixel=200000 size=100000 should return 60000", () => {
      expect(getMinOptimisationGainsForImage(200000, 100000, "tiff")).toEqual(
        60000,
      );
    });
    it(" image jpeg pixel=400000 size=100000 should return false", () => {
      expect(getMinOptimisationGainsForImage(400000, 100000, "jpeg")).toEqual(
        20000,
      );
    });
    it(" image jpeg pixel=10000 size=1000 should return 0", () => {
      expect(getMinOptimisationGainsForImage(10000, 1000, "jpeg")).toEqual(0);
    });
    it(" image jpeg pixel=20000 size=11000 should return 1000 (optimize can not go under 10K)", () => {
      expect(getMinOptimisationGainsForImage(20000, 11000, "jpeg")).toEqual(
        1000,
      );
    });
  });

  describe("#function isSvgUrl", () => {
    it(" /test/test.svg should return true ", () => {
      expect(isSvgUrl("/test/test.svg")).toEqual(true);
    });
    it(" /test/test.svg?dkjshfdjshfjk should return true ", () => {
      expect(isSvgUrl("/test/test.svg?dkjshfdjshfjk")).toEqual(true);
    });
    it(" /test/test.png should return false ", () => {
      expect(isSvgUrl("/test/test.png")).toEqual(false);
    });
  });

  describe("#function isSvgOptimized", () => {
    it(" if file < 1KB   should return true", () => {
      const svg = "  <svg>  </svg>";
      expect(isSvgOptimized(svg)).toEqual(true);
    });
    it(" if file > 1KB and no spaces inside before xml tags, should return true ", () => {
      let svg = "";
      for (let i = 0; i < 100; i++) svg += "<test></test>";
      expect(isSvgOptimized(svg)).toEqual(true);
    });
    it(" if file > 1KB and spaces inside before xml tags, should return false ", () => {
      let svg = "";
      for (let i = 0; i < 100; i++) svg += " <test></test>";
      expect(isSvgOptimized(svg)).toEqual(false);
    });
  });
});
