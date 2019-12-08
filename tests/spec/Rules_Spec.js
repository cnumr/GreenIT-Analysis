
describe("rules.js", function () {

  describe("#AddExpiresOrCacheControlHeadersRule", function () {

    beforeEach(function () {

    });

    it(" 1 static ressources with cache header, it should return A", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              content:{size:100}, status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: 'Cache-Control', value: "test" },
                { name: 'Expires', value: "Mon, 05 Jan 2099 18:09:48 GMT" },
                { name: "content-type", value: "text/css" }]
            }
          }]
      };
      let rule = rulesChecker.getRule("AddExpiresOrCacheControlHeaders");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('A');
    });

    it(" 1 static ressources with no cache header, it should return C", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              content:{size:100}, status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-type", value: "text/css" }]
            }
          }]
      };
      let rule = rulesChecker.getRule("AddExpiresOrCacheControlHeaders");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('C');
    });

    it(" 2 static ressources with no cache header, it should return C", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              content:{size:100}, status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-type", value: "text/css" }]
            }
          },
          {
            request: { url: "test2" },
            response:
            {
              content:{size:100}, status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-type", value: "text/css" }]
            }
          }]
      };
      let rule = rulesChecker.getRule("AddExpiresOrCacheControlHeaders");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('C');
    });

    it(" 3 static ressources with cache header, it should return A", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              content:{size:100}, status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: 'Cache-Control', value: "test" },
                { name: 'Expires', value: "Mon, 05 Jan 2099 18:09:48 GMT" },
                { name: "content-type", value: "text/css" }]
            }
          },
          {
            request: { url: "test2" },
            response:
            {
              content:{size:100}, status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: 'Cache-Control', value: "test" },
                { name: 'Expires', value: "Mon, 05 Jan 2099 18:09:48 GMT" },
                { name: "content-type", value: "text/css" }]
            }
          },
          {
            request: { url: "test3" },
            response:
            {
              content:{size:100},status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: 'Cache-Control', value: "test" },
                { name: 'Expires', value: "Mon, 05 Jan 2099 18:09:48 GMT" },
                { name: "content-type", value: "text/css" }]
            }
          }]
      };
      let rule = rulesChecker.getRule("AddExpiresOrCacheControlHeaders");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('A');
    });

    it(" 3 static ressources with  2 cache header, 91% resource cached it should return B", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              content:{size:90}, status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-type", value: "text/css" }]
            }
          },
          {
            request: { url: "test2" },
            response:
            {
              content:{size:110}, status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: 'Cache-Control', value: "test" },
                { name: 'Expires', value: "Mon, 05 Jan 2099 18:09:48 GMT" },
                { name: "content-type", value: "text/css" }]
            }
          },
          {
            request: { url: "test3" },
            response:
            {
              content:{size:800}, status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: 'Cache-Control', value: "test" },
                { name: 'Expires', value: "Mon, 05 Jan 2099 18:09:48 GMT" },
                { name: "content-type", value: "text/css" }]
            }
          }]
      };
      let rule = rulesChecker.getRule("AddExpiresOrCacheControlHeaders");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('B');
    });

    it(" 3 static ressources with  2 cache header, 80% resource cached it should return C", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              content:{size:200}, status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-type", value: "text/css" }]
            }
          },
          {
            request: { url: "test2" },
            response:
            {
              content:{size:100}, status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: 'Cache-Control', value: "test" },
                { name: 'Expires', value: "Mon, 05 Jan 2099 18:09:48 GMT" },
                { name: "content-type", value: "text/css" }]
            }
          },
          {
            request: { url: "test3" },
            response:
            {
              content:{size:700}, status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: 'Cache-Control', value: "test" },
                { name: 'Expires', value: "Mon, 05 Jan 2099 18:09:48 GMT" },
                { name: "content-type", value: "text/css" }]
            }
          }]
      };
      let rule = rulesChecker.getRule("AddExpiresOrCacheControlHeaders");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('C');
    });

    afterEach(function () {
    });
  });

  describe("#CompressHttpRule", function () {

    beforeEach(function () {

    });


    it(" 1 static ressources not compressed, it should return C", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              content: { size: 200 },
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [
                  { name: "content-type", value: "text/css" }]
            }
          }]
      };
      let rule = rulesChecker.getRule("CompressHttp");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('C');
    });


    it(" 1 static ressources compressed, it should return A", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              content: { size: 200 },
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: 'content-encoding', value: "gzip" },
                { name: "content-type", value: "text/css" }]
            }
          }]
      };
      let rule = rulesChecker.getRule("CompressHttp");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('A');
    });

    it("2 static ressources not compressed, it should return C", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "test2" },
            response:
            {
              content: { size: 200 },
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-type", value: "text/css" }]
            }
          },
          {
            request: { url: "test3" },
            response:
            {
              content: { size: 200 },
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-type", value: "text/css" }]
            }
          }]
      };
      let rule = rulesChecker.getRule("CompressHttp");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('C');
    });

    it(" 3 static ressources compressed, it should return A", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              content: { size: 200 },
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: 'content-encoding', value: "gzip" },
                { name: "content-type", value: "text/css" }]
            }
          },
          {
            request: { url: "test2" },
            response:
            {
              content: { size: 200 },
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: 'content-encoding', value: "gzip" },
                { name: "content-type", value: "text/css" }]
            }
          },
          {
            request: { url: "test3" },
            response:
            {
              content: { size: 200 },
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: 'content-encoding', value: "gzip" },
                { name: "content-type", value: "text/css" }]
            }
          }]
      };
      let rule = rulesChecker.getRule("CompressHttp");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('A');
    });

    it(" 2 static ressources compressed and one not, 92% compressed,  it should return B", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              content: { size:800 },
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-type", value: "text/css" }]
            }
          },
          {
            request: { url: "test2" },
            response:
            {
              content: { size: 1200 },
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: 'content-encoding', value: "gzip" },
                { name: "content-type", value: "text/css" }]
            }
          },
          {
            request: { url: "test3" },
            response:
            {
              content: { size: 8000 },
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: 'content-encoding', value: "gzip" },
                { name: "content-type", value: "text/css" }]
            }
          }]
      };
      let rule = rulesChecker.getRule("CompressHttp");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('B');
    });

    it(" 1 static ressource compressed and two not, 50% compressed it should return C", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              content: { size: 250 },
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-type", value: "text/css" }]
            }
          },
          {
            request: { url: "test2" },
            response:
            {
              content: { size: 250 },
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-type", value: "text/css" }]
            }
          },
          {
            request: { url: "test3" },
            response:
            {
              content: { size: 500 },
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: 'content-encoding', value: "gzip" },
                { name: "content-type", value: "text/css" }]
            }
          }]
      };
      let rule = rulesChecker.getRule("CompressHttp");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('C');
    });

  });

  describe("#DomainsNumberRule", function () {

    beforeEach(function () {

    });

    it(" 2 urls, 1 domain, it should return A", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [
            { request: { url: "http://test" } },
            { request: { url: "http://test/toto" } }
          ]
      };
      let rule = rulesChecker.getRule("DomainsNumber");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('A');
    });

    it(" 2 urls, 2 domains, it should return A", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [
            { request: { url: "http://test" } },
            { request: { url: "http://testb/toto" } }
          ]
      };
      let rule = rulesChecker.getRule("DomainsNumber");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('A');
    });

    it(" 5 urls, 2 domains, it should return A", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
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
      let rule = rulesChecker.getRule("DomainsNumber");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('A');
    });
    it(" 5 urls, 3 domains, it should return B", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
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
      let rule = rulesChecker.getRule("DomainsNumber");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('B');
    });
    it(" 5 urls, 4 domains, it should return C", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [
            { request: { url: "http://test" } },
            { request: { url: "http://test/test" } },
            { request: { url: "http://testb/aaa" } },
            { request: { url: "http://testc/bbbb" } },
            { request: { url: "http://testd/toto" } }
          ]
      };
      let rule = rulesChecker.getRule("DomainsNumber");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('C');
    });
    afterEach(function () {
    });
  });

  describe("#DontResizeImageInBrowserRule", function () {

    beforeEach(function () {

    });

    it(" no image , it should return A", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        imagesResizedInBrowser:
          [
          ]
      };
      let rule = rulesChecker.getRule("DontResizeImageInBrowser");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('A');
    });

    it(" 1 image not resized, it should return A", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        imagesResizedInBrowser:
          [
            { src:"test.jpg", naturalWidth :120,naturalHeight:200,clientWidth:120,clientHeight:200}
          ]
      };
      let rule = rulesChecker.getRule("DontResizeImageInBrowser");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('A');
    });


    it(" 1 image svg (test.svg) resized, it should return A", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        imagesResizedInBrowser:
          [
            { src:"test.svg", naturalWidth :120,naturalHeight:200,clientWidth:1000,clientHeight:2000}
          ]
      };
      let rule = rulesChecker.getRule("DontResizeImageInBrowser");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('A');
    });

    it(" 1 image svg (test.svg?params=test) resized, it should return A", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        imagesResizedInBrowser:
          [
            { src:"test.svg?params=test", naturalWidth :120,naturalHeight:200,clientWidth:1000,clientHeight:2000}
          ]
      };
      let rule = rulesChecker.getRule("DontResizeImageInBrowser");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('A');
    });

    it(" 1 image resized with one pixel less, it should return A", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        imagesResizedInBrowser:
          [
            { src:"test.jpg", naturalWidth :120,naturalHeight:200,clientWidth:119,clientHeight:200}
          ]
      };
      let rule = rulesChecker.getRule("DontResizeImageInBrowser");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('A');
    });

    it(" image not visible (Width=0 and height=0), it should return A", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        imagesResizedInBrowser:
          [
            { src:"test.jpg", naturalWidth :10,naturalHeight:20,clientWidth:0,clientHeight:0}
          ]
      };
      let rule = rulesChecker.getRule("DontResizeImageInBrowser");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('A');
    });

    it(" 1 image resized , it should return C", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        imagesResizedInBrowser:
          [
            { src:"test.jpg", naturalWidth :10,naturalHeight:20,clientWidth:5,clientHeight:10}
          ]
      };
      let rule = rulesChecker.getRule("DontResizeImageInBrowser");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('C');
    });

    it(" 1 image resized and one not resized, it should return C", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        imagesResizedInBrowser:
          [
            { src:"test.jpg", naturalWidth :10,naturalHeight:20,clientWidth:5,clientHeight:10},
            { src:"test2.jpg", naturalWidth :10,naturalHeight:20,clientWidth:10,clientHeight:20}
          ]
      };
      let rule = rulesChecker.getRule("DontResizeImageInBrowser");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('C');
    });

    afterEach(function () {
    });
  });

  describe("#ImageDownloadedNotDisplayedRule", function () {

    beforeEach(function () {

    });

    it(" no image , it should return A", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        imagesResizedInBrowser:
          [
          ]
      };
      let rule = rulesChecker.getRule("ImageDownloadedNotDisplayed");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('A');
    });

    it(" 1 image 120x200 displayed , it should return A", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        imagesResizedInBrowser:
          [
            { src:"test.jpg", naturalWidth :120,naturalHeight:200,clientWidth:120,clientHeight:200}
          ]
      };
      let rule = rulesChecker.getRule("ImageDownloadedNotDisplayed");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('A');
    });

    it(" 1 image 50x100 not displayed, it should return A as it is a too small image ", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        imagesResizedInBrowser:
          [
            { src:"test.jpg", naturalWidth :50,naturalHeight:100,clientWidth:20,clientHeight:40}
          ]
      };
      let rule = rulesChecker.getRule("ImageDownloadedNotDisplayed");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('A');
    });

    it(" 1 image 120x200 not displayed (with 0x0 size), it should return C", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        imagesResizedInBrowser:
          [
            { src:"test.jpg", naturalWidth :120,naturalHeight:200,clientWidth:0,clientHeight:0}
          ]
      };
      let rule = rulesChecker.getRule("ImageDownloadedNotDisplayed");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('C');
    });

    it(" 1 image not displayed and one displayed, it should return C", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        imagesResizedInBrowser:
          [
            { src:"test.jpg", naturalWidth :120,naturalHeight:200,clientWidth:0,clientHeight:0},
            { src:"test2.jpg", naturalWidth :120,naturalHeight:200,clientWidth:10,clientHeight:10}
          ]
      };
      let rule = rulesChecker.getRule("ImageDownloadedNotDisplayed");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('C');
    });

    afterEach(function () {
    });
  });

  describe("#EmptySrcTagRule", function () {

    beforeEach(function () {
    });

    it(" no empty src tag, it should return A", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = { emptySrcTagNumber: 0 };
      let rule = rulesChecker.getRule("EmptySrcTag");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('A');
    });

    it(" 1 empty src tag , it should return C", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = { emptySrcTagNumber: 1 };
      let rule = rulesChecker.getRule("EmptySrcTag");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('C');
    });

    afterEach(function () {
    });
  });

  describe("#ExternalizeCssRule", function () {

    beforeEach(function () {

    });

    it(" 0 inline css , it should return A", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = { inlineStyleSheetsNumber: 0 };
      let rule = rulesChecker.getRule("ExternalizeCss");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('A');
    });

    it(" 1 inline css, it should return C", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = { inlineStyleSheetsNumber: 1 };
      let rule = rulesChecker.getRule("ExternalizeCss");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('C');
    });

    afterEach(function () {
    });
  });

  describe("#ExternalizeJsRule", function () {

    beforeEach(function () {
    });

    it(" 0 inline js, it should return A", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = { inlineJsScriptsNumber: 0 };
      let rule = rulesChecker.getRule("ExternalizeJs");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('A');
    });

    it(" 1 inline js, it should return A", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = { inlineJsScriptsNumber: 1 };
      let rule = rulesChecker.getRule("ExternalizeJs");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('A');
    });

    it(" 2 inline js, it should return C", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = { inlineJsScriptsNumber: 2 };
      let rule = rulesChecker.getRule("ExternalizeJs");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('C');
    });

    afterEach(function () {
    });
  });

  describe("#HttpErrorRule", function () {

    beforeEach(function () {
    });

    it(" 2 http requests with no error, it should return A", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              status: 301, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-encoding", value: "gzip" }]
            }
          },
          {
            request: { url: "test2" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-encoding", value: "gzip" }]
            }
          }]
      };
      let rule = rulesChecker.getRule("HttpError");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('A');
    });

    it(" 2 http requests with one error, it should return C", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              status: 404, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-encoding", value: "gzip" }]
            }
          },
          {
            request: { url: "test2" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-encoding", value: "gzip" }]
            }
          }]
      };
      let rule = rulesChecker.getRule("HttpError");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('C');
    });


    it(" 2 http requests with one error, it should return C", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              status: 500, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-encoding", value: "gzip" }]
            }
          },
          {
            request: { url: "test2" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-encoding", value: "gzip" }]
            }
          }]
      };
      let rule = rulesChecker.getRule("HttpError");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('C');
    });

    afterEach(function () {
    });
  });



  describe("#HttpRequestsRule", function () {

    beforeEach(function () {
    });

    it(" 5 http requests, it should return A", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = { nbRequest: 5, entries: [] };
      let rule = rulesChecker.getRule("HttpRequests");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('A');
    });

    it(" 26 http requests, it should return A", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = { nbRequest: 26, entries: [] };
      let rule = rulesChecker.getRule("HttpRequests");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('A');
    });

    it(" 27 http requests, it should return B", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = { nbRequest: 27, entries: [] };
      let rule = rulesChecker.getRule("HttpRequests");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('B');
    });

    it(" 41 http requests, it should return C", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = { nbRequest: 41, entries: [] };
      let rule = rulesChecker.getRule("HttpRequests");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('C');
    });


    afterEach(function () {
    });
  });

  describe("#JsValidateRule", function () {

    beforeEach(function () {
    });

    it(" 0 js errors, it should return A", function () {
      const rule = rulesManager.getNewRulesChecker().getRule("JsValidate");
      const resourceContent ={
        url:"test",
        type:"script",
        content:"const test=2;"
      }
      rule.check("",resourceContent);
      expect(rule.complianceLevel).toEqual('A');
    });

    it(" 1 js errors, it should return C", function () {
      const rule = rulesManager.getNewRulesChecker().getRule("JsValidate");
      const resourceContent ={
        url:"test",
        type:"script",
        content:"const test=2);"
      }
      rule.check("",resourceContent);
      expect(rule.complianceLevel).toEqual('C');
    });

    it(" 3 js errors, it should return C", function () {
      const rule = rulesManager.getNewRulesChecker().getRule("JsValidate");
      const resourceContent ={
        url:"test",
        type:"script",
        content:"const test=2);"
      }
      rule.check("",resourceContent);
      resourceContent.content = "ty ret);"
      rule.check("",resourceContent);
      resourceContent.content = "ty retmdfjqsksd);"
      rule.check("",resourceContent);
      expect(rule.complianceLevel).toEqual('C');
    });

    afterEach(function () {
    });
  });

  describe("#MaxCookiesLengthRule", function () {

    beforeEach(function () {

    });

    it(" 1 ressource ,  no cookie, it should return A", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "http://test", headers: [{ name: 'test', value: 'test' }] },
          }]
      };
      let rule = rulesChecker.getRule("MaxCookiesLength");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('A');
    });
    it(" 1 ressource ,  one small cookie, it should return A", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "http://test", headers: [{ name: 'cookie', value: 'test' }] },
          }]
      };
      let rule = rulesChecker.getRule("MaxCookiesLength");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('A');
    });
    it(" 4 ressources ,  4 small cookie, it should return A", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [
            { request: { url: "http://test", headers: [{ name: 'cookie', value: 'test' }] } },
            { request: { url: "http://testa", headers: [{ name: 'cookie', value: 'test' }] } },
            { request: { url: "http://testb", headers: [{ name: 'cookie', value: 'test' }] } },
            { request: { url: "http://testc", headers: [{ name: 'cookie', value: 'test' }] } },
          ]
      };
      let rule = rulesChecker.getRule("MaxCookiesLength");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('A');
    });

    it(" 4 ressources ,  3 small cookie and one medium cookie, it should return B", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      let bigCookie = "";
      for (let i = 0; i < 100; i++) bigCookie += "0123456789"
      const measures = {
        entries:
          [
            { request: { url: "http://test", headers: [{ name: 'cookie', value: 'test' }] } },
            { request: { url: "http://testa", headers: [{ name: 'cookie', value: 'test' }] } },
            { request: { url: "http://testb", headers: [{ name: 'cookie', value: 'test' }] } },
            { request: { url: "http://testc", headers: [{ name: 'cookie', value: bigCookie }] } },
          ]
      };

      let rule = rulesChecker.getRule("MaxCookiesLength");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('B');
    });

    it(" 4 ressources ,  3 small cookie and one big cookie, it should return C  ", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      let bigCookie = "";
      for (let i = 0; i < 200; i++) bigCookie += "01234556789"
      const measures = {
        entries:
          [
            { request: { url: "http://test", headers: [{ name: 'cookie', value: 'test' }] } },
            { request: { url: "http://testa", headers: [{ name: 'cookie', value: 'test' }] } },
            { request: { url: "http://testb", headers: [{ name: 'cookie', value: 'test' }] } },
            { request: { url: "http://testc", headers: [{ name: 'cookie', value: bigCookie }] } },
          ]
      };

      let rule = rulesChecker.getRule("MaxCookiesLength");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('C');
    });
    afterEach(function () {
    });
  });

  describe("#MinifiedCssRule", function () {

    beforeEach(function () {

    });

    it(" resource is not css, it should return A", function () {
      let rule = rulesManager.getNewRulesChecker().getRule("MinifiedCss");
      let content="";
      for (let i=0;i<100;i++) {content+= "let t=2;\n  ";}
      const resourceContent = {
        type:"script",
        url:"test.js",
        content:window.btoa(content)
      };
      rule.check("",resourceContent);
      expect(rule.complianceLevel).toEqual('A');
    });


    it(" 100% css minified, it should return A", function () {
      let rule = rulesManager.getNewRulesChecker().getRule("MinifiedCss");
      let content="";
      for (let i=0;i<100;i++) {content+= "style:test;";}
      const resourceContent = {
        type:"stylesheet",
        url:"test.css",
        content:window.btoa(content)
      };
      rule.check("",resourceContent);
      expect(rule.complianceLevel).toEqual('A');
    });

    it(" >95% css minified, it should return A", function () {
      let rule = rulesManager.getNewRulesChecker().getRule("MinifiedCss");
      let content="";
      for (let i=0;i<120;i++) {content+= "style:test;";}
      let resourceContent = {
        type:"stylesheet",
        url:"test.css",
        content:content
      };
      rule.check("",resourceContent);

      content = "";
      for (let i=0;i<4;i++) {content+= "style:test;\n  ";}
      resourceContent = {
        type:"stylesheet",
        url:"test.css",
        content:content
      };
      rule.check("",resourceContent);

      expect(rule.complianceLevel).toEqual('A');
    });


    it(" 91% css Minified , it should return B", function () {
      let rule = rulesManager.getNewRulesChecker().getRule("MinifiedCss");

      let content="";
      for (let i=0;i<91;i++) {content+= "style:test;";}
      let resourceContent = {
        type:"stylesheet",
        url:"test.css",
        content:content
      };
      rule.check("",resourceContent);

      content = "";
      for (let i=0;i<9;i++) {content+= "style:t;\n  ";}
      resourceContent = {
        type:"stylesheet",
        url:"test.css",
        content:content
      };
      rule.check("",resourceContent);

      content = "";
      for (let i=0;i<100;i++) {content+= "let t=1;\n  ";}
      resourceContent = {
        type:"script",
        url:"test.js",
        content:content
      };
      rule.check("",resourceContent);

      expect(rule.complianceLevel).toEqual('B');
    });

    it(" 94% css minified , it should return B", function () {
      let rule = rulesManager.getNewRulesChecker().getRule("MinifiedCss");
      let content="";
      for (let i=0;i<94;i++) {content+= "style:test;";}
      let resourceContent = {
        type:"stylesheet",
        url:"test.css",
        content:content
      };
      rule.check("",resourceContent);

      content = "";
      for (let i=0;i<3;i++) {content+= "style:t;\n  ";}
      resourceContent = {
        type:"stylesheet",
        url:"test.css",
        content:content
      };
      rule.check("",resourceContent);

      content = "";
      for (let i=0;i<3;i++) {content+= "style:t;\n  ";}
      resourceContent = {
        type:"stylesheet",
        url:"test.css",
        content:content
      };
      rule.check("",resourceContent);

      expect(rule.complianceLevel).toEqual('B');
    });


    it(" 88% css minified , it should return C", function () {
      let rule = rulesManager.getNewRulesChecker().getRule("MinifiedCss");

      let content="";
      for (let i=0;i<88;i++) {content+= "style:test;";}
      let resourceContent = {
        type:"stylesheet",
        url:"test.css",
        content:content
      };
      rule.check("",resourceContent);

      content = "";
      for (let i=0;i<12;i++) {content+= "style:t;\n  ";}
      resourceContent = {
        type:"stylesheet",
        url:"test.css",
        content:content
      };
      rule.check("",resourceContent);

      expect(rule.complianceLevel).toEqual('C');
    });

    afterEach(function () {
    });
  });

  describe("#minifiedJsRule", function () {

    beforeEach(function () {

    });

    it(" ressources are not js, it should return A", function () {
      let rule = rulesManager.getNewRulesChecker().getRule("MinifiedJs");
      let content="";
      for (let i=0;i<50;i++) {content+= "var test=2;\n  ";}
      let resourceContent = {
        type:"stylesheet",
        url:"test.css",
        content:content
      };
      rule.check("",resourceContent);

      content = "";
      for (let i=0;i<50;i++) {content+= "var test=3;";}
      resourceContent = {
        type:"stylesheet",
        url:"test.css",
        content:content
      };
      rule.check("",resourceContent);
      expect(rule.complianceLevel).toEqual('A');
    });


    it(" 100% is  minified, it should return A", function () {
      let rule = rulesManager.getNewRulesChecker().getRule("MinifiedJs");
      let content="";
      for (let i=0;i<50;i++) {content+= "var test=2;";}
      let resourceContent = {
        type:"script",
        url:"test.js",
        content:content
      };
      rule.check("",resourceContent);

      content = "";
      for (let i=0;i<50;i++) {content+= "var test=3;";}
      resourceContent = {
        type:"script",
        url:"test.js",
        content:content
      };
      rule.check("",resourceContent);

      content = "";
      for (let i=0;i<50;i++) {content+= "var test=3; \n   ";}
      resourceContent = {
        type:"stylesheet",
        url:"test.css",
        content:content
      };
      rule.check("",resourceContent);

      expect(rule.complianceLevel).toEqual('A');
    });

    it(" 96% is minified, it should return A", function () {
      let rule = rulesManager.getNewRulesChecker().getRule("MinifiedJs");
      let content="";
      for (let i=0;i<96;i++) {content+= "var test=2;";}
      let resourceContent = {
        type:"script",
        url:"test.js",
        content:content
      };
      rule.check("",resourceContent);

      content = "";
      for (let i=0;i<4;i++) {content+= "var t=3;\n  ";}
      resourceContent = {
        type:"script",
        url:"test.js",
        content:content
      };
      rule.check("",resourceContent);
      expect(rule.complianceLevel).toEqual('A');
    });

    it(" 92% is minified, it should return B", function () {
      let rule = rulesManager.getNewRulesChecker().getRule("MinifiedJs");
      let content="";
      for (let i=0;i<92;i++) {content+= "var test=2;";}
      let resourceContent = {
        type:"script",
        url:"test.js",
        content:content
      };
      rule.check("",resourceContent);

      content = "";
      for (let i=0;i<8;i++) {content+= "var t=3;\n  ";}
      resourceContent = {
        type:"script",
        url:"test.js",
        content:content
      };
      rule.check("",resourceContent);
      expect(rule.complianceLevel).toEqual('B');
    });

    it(" 88% is minified, it should return C", function () {
      let rule = rulesManager.getNewRulesChecker().getRule("MinifiedJs");
      let content="";
      for (let i=0;i<88;i++) {content+= "var test=2;";}
      let resourceContent = {
        type:"script",
        url:"test.js",
        content:content
      };
      rule.check("",resourceContent);

      content = "";
      for (let i=0;i<12;i++) {content+= "var t=3;\n  ";}
      resourceContent = {
        type:"script",
        url:"test.js",
        content:content
      };
      rule.check("",resourceContent);
      expect(rule.complianceLevel).toEqual('C');
    });

  });

  describe("#NoCookieForStaticRessourcesRule", function () {

    beforeEach(function () {

    });

    it(" 1 static ressource ,  no cookie, it should return A", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "http://test", headers: [{ name: 'test', value: 'test' }] },
            response: { headers: [{ name: 'content-type', value: 'text/css' }] }
          }]
      };
      let rule = rulesChecker.getRule("NoCookieForStaticRessources");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('A');
    });
    it(" 1 static ressource ,  one small cookie, it should return B", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "http://test", headers: [{ name: 'cookie', value: 'test' }] },
            response: { headers: [{ name: 'content-type', value: 'text/css' }] }
          }]
      };
      let rule = rulesChecker.getRule("NoCookieForStaticRessources");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('B');
    });
    it(" 4 static ressources ,  2 cookie with small size, it should return B", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [
            { request: { url: "http://test", headers: [{ name: 'cookie', value: 'test' }] }, response: { headers: [{ name: 'content-type', value: 'text/css' }] } },
            { request: { url: "http://testa", headers: [{ name: 'cookie', value: 'test' }] }, response: { headers: [{ name: 'content-type', value: 'text/css' }] } },
            { request: { url: "http://testb", headers: [{ name: 'test', value: 'test' }] }, response: { headers: [{ name: 'content-type', value: 'text/css' }] } },
            { request: { url: "http://testc", headers: [{ name: 'test', value: 'test' }] }, response: { headers: [{ name: 'content-type', value: 'text/css' }] } },
          ]
      };
      let rule = rulesChecker.getRule("NoCookieForStaticRessources");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('B');
    });

    it(" 4 static ressources ,  2 cookie with total size > 2000 , it should return C", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      let bigCookie = "";
      for (let i = 0; i < 100; i++) bigCookie += "0123456789"
      const measures = {
        entries:
          [
            { request: { url: "http://test", headers: [{ name: 'cookie', value: bigCookie }] }, response: { headers: [{ name: 'content-type', value: 'text/css' }] } },
            { request: { url: "http://testa", headers: [{ name: 'cookie', value: bigCookie }] }, response: { headers: [{ name: 'content-type', value: 'text/css' }] } },
            { request: { url: "http://testb", headers: [{ name: 'test', value: 'test' }] }, response: { headers: [{ name: 'content-type', value: 'text/css' }] } },
            { request: { url: "http://testc", headers: [{ name: 'test', value: 'test' }] }, response: { headers: [{ name: 'content-type', value: 'text/css' }] } },
          ]
      };
      let rule = rulesChecker.getRule("NoCookieForStaticRessources");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('C');
    });

    it(" 2 non static ressources with cookie it should return A", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      let bigCookie = "";
      for (let i = 0; i < 100; i++) bigCookie += "0123456789"
      const measures = {
        entries:
          [
            { request: { url: "http://test", headers: [{ name: 'cookie', value: 'test' }] }, response: { headers: [{ name: 'content-type', value: 'application/json' }] } },
            { request: { url: "http://testa", headers: [{ name: 'cookie', value: 'test' }] }, response: { headers: [{ name: 'content-type', value: 'text/html' }] } }
          ]
      };

      let rule = rulesChecker.getRule("NoCookieForStaticRessources");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('A');
    });
    afterEach(function () {
    });
  });

  describe("#NoRedirectRule", function () {

    beforeEach(function () {

    });

    it(" 0 redirect, it should return A", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-encoding", value: "gzip" }]
            }
          }]
      };
      let rule = rulesChecker.getRule("NoRedirect");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('A');
    });

    it(" 1 redirect, it should return C", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              status: 301, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-encoding", value: "gzip" }]
            }
          }]
      };
      let rule = rulesChecker.getRule("NoRedirect");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('C');
    });


    it(" 2 redirect, it should return C", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              status: 301, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-encoding", value: "gzip" }]
            }
          },
          {
            request: { url: "test2" },
            response:
            {
              status: 307, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-encoding", value: "gzip" }]
            }
          }]
      };
      let rule = rulesChecker.getRule("NoRedirect");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('C');
    });


    afterEach(function () {
    });
  });

  describe("#OptimizeSvgRule", function () {

    beforeEach(function () {

    });

    it(" no svg image , it should return A", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const resourceContent = {
        type:"script",
        url:"test"
      };
      let rule = rulesChecker.getRule("OptimizeSvg");
      rule.check("",resourceContent);
      expect(rule.complianceLevel).toEqual('A');
    });

    it(" 1 svg image not optimized , total < 20Kb , it should return B", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      let content="";
      for (let i=0;i<100;i++) {content+= "      <tag></tag>";}
      const resourceContent = {
        type:"image",
        url:"test.svg",
        content:window.btoa(content)
      };
      let rule = rulesChecker.getRule("OptimizeSvg");
      rule.check("",resourceContent);
      expect(rule.complianceLevel).toEqual('B');
    });

    it(" 1 svg image not optimized , total > 20Kb , it should return C", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      let content="";
      for (let i=0;i<2000;i++) {content+= "      <tag></tag>";}   
      const resourceContent = {
        type:"image",
        url:"test.svg",
        content:window.btoa(content)
      };
      
      let rule = rulesChecker.getRule("OptimizeSvg");
      rule.check("",resourceContent);
      expect(rule.complianceLevel).toEqual('C');
    });

    it(" 2 svg image  , total < 20Kb , it should return B", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      let content="";
      for (let i=0;i<100;i++) {content+= "      <tag></tag>";}   
      const resourceContent = {
        type:"image",
        url:"test.svg",
        content:window.btoa(content)
      };
      let rule = rulesChecker.getRule("OptimizeSvg");
      rule.check("",resourceContent);
      rule.check("",resourceContent);
      expect(rule.complianceLevel).toEqual('B');
    });


    it(" 2 svg image  , total > 20Kb , it should return C", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      let content="";
      for (let i=0;i<1000;i++) {content+= "      <tag></tag>";}   
      const resourceContent = {
        type:"image",
        url:"test.svg",
        content:window.btoa(content)
      };
      let rule = rulesChecker.getRule("OptimizeSvg");
      rule.check("",resourceContent);
      rule.check("",resourceContent);
      expect(rule.complianceLevel).toEqual('C');
    });

    afterEach(function () {
    });

  });

  describe("#PluginsRule", function () {

    beforeEach(function () {

    });

    it(" 0 plugin, it should return A", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = { pluginsNumber: 0 };
      let rule = rulesChecker.getRule("Plugins");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('A');
    });


    it(" 1 plugin, it should return C", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = { pluginsNumber: 1 };
      let rule = rulesChecker.getRule("Plugins");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('C');
    });

    it(" 5 plugins, it should return C", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = { pluginsNumber: 5 };
      let rule = rulesChecker.getRule("Plugins");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('C');
    });

    afterEach(function () {
    });
  });

  describe("#PrintStyleSheetRule", function () {

    beforeEach(function () {

    });

    it(" 0 print stylesheet, it should return C", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = { printStyleSheetsNumber: 0 };
      let rule = rulesChecker.getRule("PrintStyleSheet");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('C');
    });

    it(" 1 print stylesheet, it should return A", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = { printStyleSheetsNumber: 1 };
      let rule = rulesChecker.getRule("PrintStyleSheet");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('A');
    });

    afterEach(function () {
    });
  });


  describe("#SocialNetworkButtonRule", function () {

    beforeEach(function () {

    });

    it(" 1 url 0 social network script, it should return A", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
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
      let rule = rulesChecker.getRule("SocialNetworkButton");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('A');
    });



    it(" 3 url 0 social network script, it should return  A", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "www.acebook.com/test.js" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-encoding", value: "gzip" },
                { name: "content-type", value: "text/css" }]
            }
          },
          {
            request: { url: "http://www.gooel.fr/test2.js" },
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
      let rule = rulesChecker.getRule("SocialNetworkButton");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('A');
    });

    it(" 3 url , a facebook social network script, it should return  C", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "www.acebook.com/test.js" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-encoding", value: "gzip" },
                { name: "content-type", value: "text/css" }]
            }
          },
          {
            request: { url: "connect.facebook.net/sdk.js" },
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
      let rule = rulesChecker.getRule("SocialNetworkButton");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('C');
    });


    it(" 3 url , a linkedin social network script, it should return  C", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "www.acebook.com/test.js" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-encoding", value: "gzip" },
                { name: "content-type", value: "text/css" }]
            }
          },
          {
            request: { url: "platform.linkedin.com/in.js" },
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
      let rule = rulesChecker.getRule("SocialNetworkButton");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('C');
    });
    it(" 3 url , 2 social network scripts, it should return  C", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "platform.twitter.com/widgets.js" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-encoding", value: "gzip" },
                { name: "content-type", value: "text/css" }]
            }
          },
          {
            request: { url: "platform.linkedin.com/in.js" },
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
      let rule = rulesChecker.getRule("SocialNetworkButton");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('C');
    });

    afterEach(function () {
    });
  });



  describe("#StyleSheetsRule", function () {

    beforeEach(function () {

    });

    it(" 0 stylesheet, it should return A", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
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
      let rule = rulesChecker.getRule("StyleSheets");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('A');
    });

    it(" 2 stylesheet, it should return A", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
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
      let rule = rulesChecker.getRule("StyleSheets");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('A');
    });

    it(" 3 stylesheet, it should return B", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
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
      let rule = rulesChecker.getRule("StyleSheets");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('B');
    });

    it("  4 stylesheet, it should return C", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
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
          },
          {
            request: { url: "test4" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-encoding", value: "gzip" },
                { name: "content-type", value: "text/css" }]
            }
          }]
      };
      let rule = rulesChecker.getRule("StyleSheets");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('C');
    });

    afterEach(function () {
    });
  });

  describe("#UseETagsRule", function () {

    beforeEach(function () {

    });

    it(" 1 static ressources with ETag, it should return A", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              content:{size:100},status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: 'Etag', value: "test" },
                { name: "content-type", value: "text/css" }]
            }
          }]
      };
      let rule = rulesChecker.getRule("UseETags");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('A');
    });

    it(" 1 static ressources with no ETag, it should return C", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              content:{size:100},status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-type", value: "text/css" }]
            }
          }]
      };
      let rule = rulesChecker.getRule("UseETags");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('C');
    });

    it(" 2 static ressources with no ETag, it should return C", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              content:{size:100},status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-type", value: "text/css" }]
            }
          },
          {
            request: { url: "test2" },
            response:
            {
              content:{size:100},status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-type", value: "text/css" }]
            }
          }]
      };
      let rule = rulesChecker.getRule("UseETags");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('C');
    });

    it(" 3 static ressources with ETag, it should return A", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              content:{size:100},status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: 'Etag', value: "test" },
                { name: "content-type", value: "text/css" }]
            }
          },
          {
            request: { url: "test2" },
            response:
            {
              content:{size:100},status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: 'Etag', value: "test" },
                { name: "content-type", value: "text/css" }]
            }
          },
          {
            request: { url: "test3" },
            response:
            {
              content:{size:100}, status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: 'Etag', value: "test" },
                { name: "content-type", value: "text/css" }]
            }
          }]
      };
      let rule = rulesChecker.getRule("UseETags");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('A');
    });

    it(" 3 static ressources with 2 ETag, 91% with e-tag it should return B", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              content:{size:90}, status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-type", value: "text/css" }]
            }
          },
          {
            request: { url: "test2" },
            response:
            {
              content:{size:810}, status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: 'Etag', value: "test" },
                { name: "content-type", value: "text/css" }]
            }
          },
          {
            request: { url: "test3" },
            response:
            {
              content:{size:100}, status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: 'Etag', value: "test" },
                { name: "content-type", value: "text/css" }]
            }
          }]
      };
      let rule = rulesChecker.getRule("UseETags");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('B');
    });

    it(" 3 static ressources with 2 ETag, 80% with e-tag it should return C", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              content:{size:200}, status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: "content-type", value: "text/css" }]
            }
          },
          {
            request: { url: "test2" },
            response:
            {
              content:{size:700}, status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: 'Etag', value: "test" },
                { name: "content-type", value: "text/css" }]
            }
          },
          {
            request: { url: "test3" },
            response:
            {
              content:{size:100}, status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: 'Etag', value: "test" },
                { name: "content-type", value: "text/css" }]
            }
          }]
      };
      let rule = rulesChecker.getRule("UseETags");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('C');
    });
  });

  describe("#UseStandardTypefacesRule", function () {

    beforeEach(function () {

    });

    it(" 0 specific font, it should return A", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: 'test', value: "test" },
                { name: "content-type", value: "text/css" }]
            }
          }],
          dataEntries :[]
      };
      let rule = rulesChecker.getRule("UseStandardTypefaces");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('A');
    });




    it(" 1 specific font file with size < 10KB  should return  B", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              content : {size : 1000}, status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: 'test', value: "test" },
                { name: "content-type", value: "application/font-woff" }]
            }
          }],
          dataEntries :[]
      };
      let rule = rulesChecker.getRule("UseStandardTypefaces");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('B');
    });

    it(" 2 specific font files  with size < 10KB  should return  B", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              content : {size : 1000}, status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: 'test', value: "test" },
                { name: "content-type", value: "application/font-woff" }]
            }
          },
          {
            request: { url: "test2" },
            response:
            {
              content : {size : 2000}, status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: 'test', value: "test" },
                { name: "content-type", value: "application/font-woff" }]
            }
          }],
          dataEntries :[]
      };
      let rule = rulesChecker.getRule("UseStandardTypefaces");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('B');
    });

    it(" 1 specific font file  with size > 10KB  should return  C", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              content : {size : 100000}, status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: 'test', value: "test" },
                { name: "content-type", value: "application/font-woff" }]
            }
          }],
          dataEntries :[]
      };
      let rule = rulesChecker.getRule("UseStandardTypefaces");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('C');
    });

    it(" 2 specific font files  with size > 10KB  should return  C", function () {
      let rulesChecker = rulesManager.getNewRulesChecker();
      const measures = {
        entries:
          [{
            request: { url: "test" },
            response:
            {
              content : {size : 10000}, status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: 'test', value: "test" },
                { name: "content-type", value: "application/font-woff" }]
            }
          },
          {
            request: { url: "test2" },
            response:
            {
              content : {size : 20000}, status: 200, statusText: "", httpVersion: "http/2.0", headers:
                [{ name: 'test', value: "test" },
                { name: "content-type", value: "application/font-woff" }]
            }
          }],
          dataEntries :[]
      };
      let rule = rulesChecker.getRule("UseStandardTypefaces");
      rule.check(measures);
      expect(rule.complianceLevel).toEqual('C');
    });

    afterEach(function () {
    });
  });
});