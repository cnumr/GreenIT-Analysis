
describe("rules.js", function () {

  // MOCKING 
  chrome.i18n = new function () {
    this.getMessage = function () {
      return "test";
    }
  };

  chrome.devtools = new function () {
    this.inspectedWindow = new function () {
      this.getResources = function () {
        return true;
      }
    }
  }
  // END MOCKING




  describe("#pluginsRule", function () {

    beforeEach(function () {

    });

    it(" 0 plugin, it should return true", function () {
      let rules = new Rules();
      const measures = { pluginsNumber: 0 };
      let rule = rules.getRule("plugins");
      rule.check(measures);
      expect(rule.isRespected).toBe(true);
    });


    it(" 1 plugin, it should return false", function () {
      let rules = new Rules();
      const measures = { pluginsNumber: 1 };
      let rule = rules.getRule("plugins");
      rule.check(measures);
      expect(rule.isRespected).toBe(false);
    });

    it(" 5 plugins, it should return false", function () {
      let rules = new Rules();
      const measures = { pluginsNumber: 5 };
      let rule = rules.getRule("plugins");
      rule.check(measures);
      expect(rule.isRespected).toBe(false);
    });

    afterEach(function () {
    });
  });

  describe("#styleSheetsRule", function () {

    beforeEach(function () {

    });

    it(" 0 stylesheet, it should return true", function () {
      let rules = new Rules();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-encoding", value: "gzip" },
                { name: "content-type", value: "text/json" }]
            }
          }]
      };
      let rule = rules.getRule("styleSheets");
      rule.check(measures);
      expect(rule.isRespected).toBe(true);
    });

    it(" 2 stylesheet, it should return true", function () {
      let rules = new Rules();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-encoding", value: "gzip" },
                { name: "content-type", value: "text/css" }]
            }
          },
          {
            request: { url: "test2" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-encoding", value: "gzip" },
                { name: "content-type", value: "text/css" }]
            }
          },
          {
            request: { url: "test3" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-encoding", value: "gzip" },
                { name: "content-type", value: "text/html" }]
            }
          }]
      };
      let rule = rules.getRule("styleSheets");
      rule.check(measures);
      expect(rule.isRespected).toBe(true);
    });

    it(" 3 stylesheet, it should return false", function () {
      let rules = new Rules();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-encoding", value: "gzip" },
                { name: "content-type", value: "text/css" }]
            }
          },
          {
            request: { url: "test2" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-encoding", value: "gzip" },
                { name: "content-type", value: "text/css" }]
            }
          },
          {
            request: { url: "test3" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-encoding", value: "gzip" },
                { name: "content-type", value: "text/css" }]
            }
          }]
      };
      let rule = rules.getRule("styleSheets");
      rule.check(measures);
      expect(rule.isRespected).toBe(false);
    });

    afterEach(function () {
    });
  });

  describe("#printStyleSheetsRule", function () {

    beforeEach(function () {

    });

    it(" 0 print stylesheet, it should return false", function () {
      let rules = new Rules();
      const measures = { printStyleSheetsNumber: 0 };
      let rule = rules.getRule("printStyleSheets");
      rule.check(measures);
      expect(rule.isRespected).toBe(false);
    });

    it(" 1 print stylesheet, it should return true", function () {
      let rules = new Rules();
      const measures = { printStyleSheetsNumber: 1 };
      let rule = rules.getRule("printStyleSheets");
      rule.check(measures);
      expect(rule.isRespected).toBe(true);
    });

    afterEach(function () {
    });
  });

  describe("#externalizeCssRule", function () {

    beforeEach(function () {

    });

    it(" 0 inline css , it should return true", function () {
      let rules = new Rules();
      const measures = { inlineStyleSheetsNumber: 0 };
      let rule = rules.getRule("externalizeCss");
      rule.check(measures);
      expect(rule.isRespected).toBe(true);
    });

    it(" 1 inline css, it should return false", function () {
      let rules = new Rules();
      const measures = { inlineStyleSheetsNumber: 1 };
      let rule = rules.getRule("externalizeCss");
      rule.check(measures);
      expect(rule.isRespected).toBe(false);
    });

    afterEach(function () {
    });
  });


  describe("#minifiedCssRule", function () {

    beforeEach(function () {

    });
    it(" 0 css of 10 shoud be minified, it should return true", function () {
      let rules = new Rules();
      const measures = {
        cssShouldBeMinified: [],
        minifiedCssNumber: 10,
        totalCss: 10
      };
      let rule = rules.getRule("minifiedCss");
      rule.check(measures);
      expect(rule.isRespected).toBe(true);
    });

    it(" 2 css of 100 shoud be minified, it should return true", function () {
      let rules = new Rules();
      const measures = {
        cssShouldBeMinified: ["test.css", "test2.css"],
        minifiedCssNumber: 98,
        totalCss: 100
      };
      let rule = rules.getRule("minifiedCss");
      rule.check(measures);
      expect(rule.isRespected).toBe(true);
    });

    it(" 2 css of 10 shoud be minified, it should return false", function () {
      let rules = new Rules();
      const measures = {
        cssShouldBeMinified: ["test.css", "test2.css"],
        minifiedCssNumber: 8,
        totalCss: 10
      };
      let rule = rules.getRule("minifiedCss");
      rule.check(measures);
      expect(rule.isRespected).toBe(false);
    });

    it(" 0 css of 0 shoud be minified, it should return true", function () {
      let rules = new Rules();
      const measures = {
        cssShouldBeMinified: [],
        minifiedCssNumber: 0,
        totalCss: 0
      };
      let rule = rules.getRule("minifiedCss");
      rule.check(measures);
      expect(rule.isRespected).toBe(true);
    });


    it(" 1 css of 9 shoud be minified, it should return false", function () {
      let rules = new Rules();
      const measures = {
        cssShouldBeMinified: [],
        minifiedCssNumber: 9,
        totalCss: 10
      };
      let rule = rules.getRule("minifiedCss");
      rule.check(measures);
      expect(rule.isRespected).toBe(false);
    });

    afterEach(function () {
    });
  });

  describe("#emptySrcTagRule", function () {

    beforeEach(function () {
    });

    it(" no empty src tag, it should return true", function () {
      let rules = new Rules();
      const measures = { emptySrcTagNumber: 0 };
      let rule = rules.getRule("emptySrcTag");
      rule.check(measures);
      expect(rule.isRespected).toBe(true);
    });

    it(" 1 empty src tag , it should return false", function () {
      let rules = new Rules();
      const measures = { emptySrcTagNumber: 1 };
      let rule = rules.getRule("emptySrcTag");
      rule.check(measures);
      expect(rule.isRespected).toBe(false);
    });

    afterEach(function () {
    });
  });

  describe("#jsValidateRule", function () {

    beforeEach(function () {
    });

    it(" 0 js errors, it should return true", function () {
      let rules = new Rules();
      const measures = {
        jsErrors: new Map()
      };
      let rule = rules.getRule("jsValidate");
      rule.check(measures);
      expect(rule.isRespected).toBe(true);
    });

    it(" 1 js errors, it should return false", function () {
      let rules = new Rules();
      const measures = {
        jsErrors: new Map()
      };
      measures.jsErrors.set("test", 1);
      let rule = rules.getRule("jsValidate");
      rule.check(measures);
      expect(rule.isRespected).toBe(false);
    });

    it(" 3 js errors, it should return false", function () {
      let rules = new Rules();
      const measures = {
        jsErrors: new Map()
      };
      measures.jsErrors.set("test", 1);
      measures.jsErrors.set("test2", 2);
      let rule = rules.getRule("jsValidate");
      rule.check(measures);
      expect(rule.isRespected).toBe(false);
    });

    afterEach(function () {
    });
  });

  describe("#externalizeJsRule", function () {

    beforeEach(function () {
    });

    it(" 0 inline js, it should return true", function () {
      let rules = new Rules();
      const measures = { inlineJsScriptsNumber: 0 };
      let rule = rules.getRule("externalizeJs");
      rule.check(measures);
      expect(rule.isRespected).toBe(true);
    });

    it(" 1 inline js, it should return true", function () {
      let rules = new Rules();
      const measures = { inlineJsScriptsNumber: 1 };
      let rule = rules.getRule("externalizeJs");
      rule.check(measures);
      expect(rule.isRespected).toBe(true);
    });

    it(" 2 inline js, it should return false", function () {
      let rules = new Rules();
      const measures = { inlineJsScriptsNumber: 2 };
      let rule = rules.getRule("externalizeJs");
      rule.check(measures);
      expect(rule.isRespected).toBe(false);
    });

    afterEach(function () {
    });
  });
  describe("#minifiedJsRule", function () {

    beforeEach(function () {

    });
    it(" 0 js of 10 shoud be minified, it should return true", function () {
      let rules = new Rules();
      const measures = {
        jsShouldBeMinified: [],
        minifiedJsNumber: 10,
        totalJs: 10
      };
      let rule = rules.getRule("minifiedJs");
      rule.check(measures);
      expect(rule.isRespected).toBe(true);
    });

    it(" 2 js of 100 shoud be minified, it should return true", function () {
      let rules = new Rules();
      const measures = {
        jsShouldBeMinified: ["test.js", "test2.js"],
        minifiedJsNumber: 98,
        totalJs: 100
      };
      let rule = rules.getRule("minifiedJs");
      rule.check(measures);
      expect(rule.isRespected).toBe(true);
    });

    it(" 2 js of 10 shoud be minified, it should return false", function () {
      let rules = new Rules();
      const measures = {
        jsShouldBeMinified: ["test.js", "test2.js"],
        minifiedJsNumber: 8,
        totalJs: 10
      };
      let rule = rules.getRule("minifiedJs");
      rule.check(measures);
      expect(rule.isRespected).toBe(false);
    });

    it(" 0 js of 0 shoud be minified, it should return true", function () {
      let rules = new Rules();
      const measures = {
        jsShouldBeMinified: [],
        minifiedJsNumber: 0,
        totalJs: 0
      };
      let rule = rules.getRule("minifiedJs");
      rule.check(measures);
      expect(rule.isRespected).toBe(true);
    });


    it(" 1 js of 9 shoud be minified, it should return false", function () {
      let rules = new Rules();
      const measures = {
        jsShouldBeMinified: [],
        minifiedJsNumber: 9,
        totalJs: 10
      };
      let rule = rules.getRule("minifiedJs");
      rule.check(measures);
      expect(rule.isRespected).toBe(false);
    });
  });
  describe("#httpRequestsRule", function () {

    beforeEach(function () {
    });

    it(" 5 http requests, it should return true", function () {
      let rules = new Rules();
      const measures = { nbRequest: 5, entries: [] };
      let rule = rules.getRule("httpRequests");
      rule.check(measures);
      expect(rule.isRespected).toBe(true);
    });

    it(" 26 http requests, it should return true", function () {
      let rules = new Rules();
      const measures = { nbRequest: 26, entries: [] };
      let rule = rules.getRule("httpRequests");
      rule.check(measures);
      expect(rule.isRespected).toBe(true);
    });

    it(" 27 http requests, it should return false", function () {
      let rules = new Rules();
      const measures = { nbRequest: 27, entries: [] };
      let rule = rules.getRule("httpRequests");
      rule.check(measures);
      expect(rule.isRespected).toBe(false);
    });

    afterEach(function () {
    });
  });



  describe("#domainsNumberRule", function () {

    beforeEach(function () {

    });

    it(" 2 urls, 1 domain, it should return true", function () {
      let rules = new Rules();
      const measures = {
        entries:
          [
            { request: { url: "http://test" } },
            { request: { url: "http://test/toto" } }
          ]
      };
      let rule = rules.getRule("domainsNumber");
      rule.check(measures);
      expect(rule.isRespected).toBe(true);
    });

    it(" 2 urls, 2 domains, it should return true", function () {
      let rules = new Rules();
      const measures = {
        entries:
          [
            { request: { url: "http://test" } },
            { request: { url: "http://testb/toto" } }
          ]
      };
      let rule = rules.getRule("domainsNumber");
      rule.check(measures);
      expect(rule.isRespected).toBe(true);
    });

    it(" 5 urls, 2 domains, it should return true", function () {
      let rules = new Rules();
      const measures = {
        entries:
          [
            { request: { url: "http://test" } },
            { request: { url: "http://test/test" } },
            { request: { url: "http://test/aaa" } },
            { request: { url: "http://test/bbbb" } },
            { request: { url: "http://testb/toto" } }
          ]
      };
      let rule = rules.getRule("domainsNumber");
      rule.check(measures);
      expect(rule.isRespected).toBe(true);
    });
    it(" 5 urls, 3 domains, it should return false", function () {
      let rules = new Rules();
      const measures = {
        entries:
          [
            { request: { url: "http://test" } },
            { request: { url: "http://test/test" } },
            { request: { url: "http://test/aaa" } },
            { request: { url: "http://testb/bbbb" } },
            { request: { url: "http://testc/toto" } }
          ]
      };
      let rule = rules.getRule("domainsNumber");
      rule.check(measures);
      expect(rule.isRespected).toBe(false);
    });
    afterEach(function () {
    });
  });

  describe("#addExpiresOrCacheControlHeadersRule", function () {

    beforeEach(function () {

    });

    it(" 1 static ressources with cache header, it should return true", function () {
      let rules = new Rules();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: 'Cache-Control', value: "test" },
                { name: 'Expires', value: "Mon, 05 Jan 2099 18:09:48 GMT" },
                { name: "content-type", value: "text/css" }]
            }
          }]
      };
      let rule = rules.getRule("addExpiresOrCacheControlHeaders");
      rule.check(measures);
      expect(rule.isRespected).toBe(true);
    });

    it(" 1 static ressources with no cache header, it should return false", function () {
      let rules = new Rules();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-type", value: "text/css" }]
            }
          }]
      };
      let rule = rules.getRule("addExpiresOrCacheControlHeaders");
      rule.check(measures);
      expect(rule.isRespected).toBe(false);
    });

    it(" 3 static ressources with cache header, it should return true", function () {
      let rules = new Rules();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: 'Cache-Control', value: "test" },
                { name: 'Expires', value: "Mon, 05 Jan 2099 18:09:48 GMT" },
                { name: "content-type", value: "text/css" }]
            }
          },
          {
            request: { url: "test2" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: 'Cache-Control', value: "test" },
                { name: 'Expires', value: "Mon, 05 Jan 2099 18:09:48 GMT" },
                { name: "content-type", value: "text/css" }]
            }
          },
          {
            request: { url: "test3" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: 'Cache-Control', value: "test" },
                { name: 'Expires', value: "Mon, 05 Jan 2099 18:09:48 GMT" },
                { name: "content-type", value: "text/css" }]
            }
          }]
      };
      let rule = rules.getRule("addExpiresOrCacheControlHeaders");
      rule.check(measures);
      expect(rule.isRespected).toBe(true);
    });

    it(" 3 static ressources with  2 cache header, it should return false", function () {
      let rules = new Rules();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-type", value: "text/css" }]
            }
          },
          {
            request: { url: "test2" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: 'Cache-Control', value: "test" },
                { name: 'Expires', value: "Mon, 05 Jan 2099 18:09:48 GMT" },
                { name: "content-type", value: "text/css" }]
            }
          },
          {
            request: { url: "test3" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: 'Cache-Control', value: "test" },
                { name: 'Expires', value: "Mon, 05 Jan 2099 18:09:48 GMT" },
                { name: "content-type", value: "text/css" }]
            }
          }]
      };
      let rule = rules.getRule("addExpiresOrCacheControlHeaders");
      rule.check(measures);
      expect(rule.isRespected).toBe(false);
    });

    it(" 30 static ressources with  29 cache header, it should return true", function () {
      let rules = new Rules();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-type", value: "text/css" }]
            }
          }]
      };
      for (let i = 0; i < 30; i++) {
        const req = {
          request: { url: "test2" },
          response:
          {
            status: 200, statusText: "", httpVersion: "http/2.0", headers:
              [{ name: 'Cache-Control', value: "test" },
              { name: 'Expires', value: "Mon, 05 Jan 2099 18:09:48 GMT" },
              { name: "content-type", value: "text/css" }]
          }
        };
        measures.entries.push(req)
      }
      let rule = rules.getRule("addExpiresOrCacheControlHeaders");
      rule.check(measures);
      expect(rule.isRespected).toBe(true);
    });

    it(" 16 static ressources with  15 cache header, it should return false", function () {
      let rules = new Rules();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-type", value: "text/css" }]
            }
          }]
      };
      for (let i = 0; i < 15; i++) {
        const req = {
          request: { url: "test2" },
          response:
          {
            status: 200, statusText: "", httpVersion: "http/2.0", headers:
              [{ name: 'Cache-Control', value: "test" },
              { name: 'Expires', value: "Mon, 05 Jan 2099 18:09:48 GMT" },
              { name: "content-type", value: "text/css" }]
          }
        };
        measures.entries.push(req)
      }
      let rule = rules.getRule("addExpiresOrCacheControlHeaders");
      rule.check(measures);
      expect(rule.isRespected).toBe(false);
    });
    afterEach(function () {
    });
  });

  describe("#useETagsRule", function () {

    beforeEach(function () {

    });

    it(" 1 static ressources with ETag, it should return true", function () {
      let rules = new Rules();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: 'Etag', value: "test" },
                { name: "content-type", value: "text/css" }]
            }
          }]
      };
      let rule = rules.getRule("useETags");
      rule.check(measures);
      expect(rule.isRespected).toBe(true);
    });

    it(" 1 static ressources with no ETag, it should return false", function () {
      let rules = new Rules();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-type", value: "text/css" }]
            }
          }]
      };
      let rule = rules.getRule("useETags");
      rule.check(measures);
      expect(rule.isRespected).toBe(false);
    });

    it(" 3 static ressources with ETag, it should return true", function () {
      let rules = new Rules();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: 'Etag', value: "test" },
                { name: "content-type", value: "text/css" }]
            }
          },
          {
            request: { url: "test2" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: 'Etag', value: "test" },
                { name: "content-type", value: "text/css" }]
            }
          },
          {
            request: { url: "test3" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: 'Etag', value: "test" },
                { name: "content-type", value: "text/css" }]
            }
          }]
      };
      let rule = rules.getRule("useETags");
      rule.check(measures);
      expect(rule.isRespected).toBe(true);
    });

    it(" 3 static ressources with 2 ETag, it should return false", function () {
      let rules = new Rules();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-type", value: "text/css" }]
            }
          },
          {
            request: { url: "test2" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: 'Etag', value: "test" },
                { name: "content-type", value: "text/css" }]
            }
          },
          {
            request: { url: "test3" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: 'Etag', value: "test" },
                { name: "content-type", value: "text/css" }]
            }
          }]
      };
      let rule = rules.getRule("useETags");
      rule.check(measures);
      expect(rule.isRespected).toBe(false);
    });

    it(" 30 static ressources with  29 ETag, it should return true", function () {
      let rules = new Rules();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-type", value: "text/css" }]
            }
          }]
      };
      for (let i = 0; i < 30; i++) {
        const req = {
          request: { url: "test2" },
          response:
          {
            status: 200, statusText: "", httpVersion: "http/2.0", headers:
              [{ name: 'Etag', value: "test" },
              { name: "content-type", value: "text/css" }]
          }
        };
        measures.entries.push(req)
      }
      let rule = rules.getRule("useETags");
      rule.check(measures);
      expect(rule.isRespected).toBe(true);
    });

    it(" 16 static ressources with  15 ETag, it should return false", function () {
      let rules = new Rules();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-type", value: "text/css" }]
            }
          }]
      };
      for (let i = 0; i < 15; i++) {
        const req = {
          request: { url: "test2" },
          response:
          {
            status: 200, statusText: "", httpVersion: "http/2.0", headers:
              [{ name: 'Etag', value: "test" },
              { name: "content-type", value: "text/css" }]
          }
        };
        measures.entries.push(req)
      }
      let rule = rules.getRule("useETags");
      rule.check(measures);
      expect(rule.isRespected).toBe(false);
    });
  });

  describe("#useStandardTypefacesRule", function () {

    beforeEach(function () {

    });

    it(" 0 specific font, it should return true", function () {
      let rules = new Rules();
      const measures = { cssFontFace: [] };
      let rule = rules.getRule("useStandardTypefaces");
      rule.check(measures);
      expect(rule.isRespected).toBe(true);
    });

    it(" 1 specific font, it should return false", function () {
      let rules = new Rules();
      const measures = { cssFontFace: ["test"] };
      let rule = rules.getRule("useStandardTypefaces");
      rule.check(measures);
      expect(rule.isRespected).toBe(false);
    });

    it(" 5 specific font, it should return false", function () {
      let rules = new Rules();
      const measures = { cssFontFace: ["test", "t2", "t3", "t4", "t5"] };
      let rule = rules.getRule("useStandardTypefaces");
      rule.check(measures);
      expect(rule.isRespected).toBe(false);
    });
    afterEach(function () {
    });
  });

  describe("#maxCookiesLengthRule", function () {

    beforeEach(function () {

    });

    it(" 1 ressource ,  no cookie, it should return true", function () {
      let rules = new Rules();
      const measures = {
        entries:
          [{
            request: { url: "http://test", headers: [{ name: 'test', value: 'test' }] },
          }]
      };
      let rule = rules.getRule("maxCookiesLength");
      rule.check(measures);
      expect(rule.isRespected).toBe(true);
    });
    it(" 1 ressource ,  one small cookie, it should return true", function () {
      let rules = new Rules();
      const measures = {
        entries:
          [{
            request: { url: "http://test", headers: [{ name: 'cookie', value: 'test' }] },
          }]
      };
      let rule = rules.getRule("maxCookiesLength");
      rule.check(measures);
      expect(rule.isRespected).toBe(true);
    });
    it(" 4 ressources ,  4 small cookie, it should return true", function () {
      let rules = new Rules();
      const measures = {
        entries:
          [
            { request: { url: "http://test", headers: [{ name: 'cookie', value: 'test' }] } },
            { request: { url: "http://testa", headers: [{ name: 'cookie', value: 'test' }] } },
            { request: { url: "http://testb", headers: [{ name: 'cookie', value: 'test' }] } },
            { request: { url: "http://testc", headers: [{ name: 'cookie', value: 'test' }] } },
          ]
      };
      let rule = rules.getRule("maxCookiesLength");
      rule.check(measures);
      expect(rule.isRespected).toBe(true);
    });

    it(" 4 ressources ,  3 small cookie and one big cookie, it should return false", function () {
      let rules = new Rules();
      let bigCookie ="";
      for (let i=0;i<100;i++) bigCookie+="01234556789"
      const measures = {
        entries:
          [
            { request: { url: "http://test", headers: [{ name: 'cookie', value: 'test' }] } },
            { request: { url: "http://testa", headers: [{ name: 'cookie', value: 'test' }] } },
            { request: { url: "http://testb", headers: [{ name: 'cookie', value: 'test' }] } },
            { request: { url: "http://testc", headers: [{ name: 'cookie', value: bigCookie }] } },
          ]
      };
      
      let rule = rules.getRule("maxCookiesLength");
      rule.check(measures);
      expect(rule.isRespected).toBe(false);
    });


  });
  afterEach(function () {
  });
});


