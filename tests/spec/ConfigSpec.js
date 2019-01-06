

describe("Analyse", function() {
  

  describe("#function getPluginsNumber", function() {
 
    beforeEach(function() {
	
    });
	
    it("plugins number should return 0 ", function() {
      expect(window.frames["testFrame"].contentWindow.getPluginsNumber()).toEqual(0);
    });

    it("if tag <object> plugin number should return 1 ", function() {
      var new_element = window.frames["testFrame"].contentWindow.document.createElement("object");
      window.frames["testFrame"].contentWindow.document.getElementById("node").appendChild(new_element);
      expect(window.frames["testFrame"].contentWindow.getPluginsNumber()).toEqual(1);
    });

    it("if tag <embed> plugin number should return 1 ", function() {
      var new_element = window.frames["testFrame"].contentWindow.document.createElement("embed");
      window.frames["testFrame"].contentWindow.document.getElementById("node").appendChild(new_element);
      expect(window.frames["testFrame"].contentWindow.getPluginsNumber()).toEqual(1);
    });

    it("if 2  tag embed and object number should return 2 ", function() {
      var new_element = window.frames["testFrame"].contentWindow.document.createElement("object");
      window.frames["testFrame"].contentWindow.document.getElementById("node").appendChild(new_element);
      new_element = window.frames["testFrame"].contentWindow.document.createElement("embed");
      window.frames["testFrame"].contentWindow.document.getElementById("node").appendChild(new_element);
      expect(window.frames["testFrame"].contentWindow.getPluginsNumber()).toEqual(2);
    });


    afterEach(function() {
     let object_elements = window.frames["testFrame"].contentWindow.document.querySelectorAll("object");
     for (let i=0;i<object_elements.length;i++) {
      object_elements[i].parentNode.removeChild(object_elements[i]);
     }
     let embed_elements = window.frames["testFrame"].contentWindow.document.querySelectorAll("embed");
     for (let i=0;i<embed_elements.length;i++) {
      embed_elements[i].parentNode.removeChild(embed_elements[i]);
     }

    });
  });


  describe("#function getStyleSheetsNumber", function() {
 
    beforeEach(function() {	
    });
	
    it(" should return 2", function() {
      expect(window.frames["testFrame"].contentWindow.getStyleSheetsNumber()).toEqual(2);
    });

    afterEach(function() {
    });
  });


  describe("#function getPrintStyleSheetsNumber", function() {
 
    beforeEach(function() {	
    });
	
    it(" should return 2", function() {
      expect(window.frames["testFrame"].contentWindow.getPrintStyleSheetsNumber()).toEqual(2);
    });

    afterEach(function() {
    });
  });

  describe("#function getInlineStyleSheetsNumber", function() {
 
    beforeEach(function() {	
    });
	
    it(" should return 3", function() {
      expect(window.frames["testFrame"].contentWindow.getInlineStyleSheetsNumber()).toEqual(3);
    });

    afterEach(function() {
    });
  });

  describe('#getEmptySrcTagNumber', function() {

    beforeEach(function() {	
    });
	
    it(" should return 4", function() {
      expect(window.frames["testFrame"].contentWindow.getEmptySrcTagNumber()).toEqual(4);
    });

    afterEach(function() {
    });
  });

  describe("#function getInlineJsScriptsNumber()", function() {
 
    beforeEach(function() {	
    });
	
    it(" should return 2", function() {
      expect(window.frames["testFrame"].contentWindow.getInlineJsScriptsNumber()).toEqual(2);
    });

    afterEach(function() {
    });
  });

});


describe("utils.js", function() {
  

  describe("#function getResponseHeaderFromResource", function() {
 
    beforeEach(function() {	
    });
	
    it(" should return text/css", function() {
	    const resource = {response: {status:200,statusText:"",httpVersion:"http/2.0",headers:[{name:"content-encoding",value:"gzip"},{name:"content-type",value:"text/css"},{name:"toto",value:"test"}]}};
      expect(window.frames["testFrame"].contentWindow.getResponseHeaderFromResource(resource,"content-type")).toEqual('text/css');
    });

    it(" should return gzip", function() {
	    const resource = {response: {status:200,statusText:"",httpVersion:"http/2.0",headers:[{name:"content-encoding",value:"gzip"},{name:"content-type",value:"text/css"},{name:"toto",value:"test"}]}};
      expect(window.frames["testFrame"].contentWindow.getResponseHeaderFromResource(resource,"content-encoding")).toEqual('gzip');
    });

    it(" should return an empty string", function() {
	    const resource = {response: {status:200,statusText:"",httpVersion:"http/2.0",headers:[{name:"content-encoding",value:"gzip"},{name:"content-type",value:"text/css"},{name:"toto",value:"test"}]}};
      expect(window.frames["testFrame"].contentWindow.getResponseHeaderFromResource(resource,"inexistant-header")).toEqual('');
    });
    afterEach(function() {
    });
  });


  describe("#function isStaticRessource", function() {
 
    beforeEach(function() {	
    });
	
    it(" text/css is static , should return true ", function() {
	    const resource = {response: {status:200,statusText:"",httpVersion:"http/2.0",headers:[{name:"content-encoding",value:"gzip"},{name:"content-type",value:"text/css"},{name:"toto",value:"test"}]}};
      expect(window.frames["testFrame"].contentWindow.isStaticRessource(resource)).toEqual(true);
    });

    it(" image/bmp is static , should return true", function() {
	    const resource = {response: {status:200,statusText:"",httpVersion:"http/2.0",headers:[{name:"content-encoding",value:"gzip"},{name:"content-type",value:"image/bmp"},{name:"toto",value:"test"}]}};
      expect(window.frames["testFrame"].contentWindow.isStaticRessource(resource)).toEqual(true);
    });

    it(" test/test is unknown , should return false", function() {
	    const resource = {response: {status:200,statusText:"",httpVersion:"http/2.0",headers:[{name:"content-encoding",value:"gzip"},{name:"content-type",value:"test/test"},{name:"toto",value:"test"}]}};
      expect(window.frames["testFrame"].contentWindow.isStaticRessource(resource)).toEqual(false);
    });
    afterEach(function() {
    });
  });

  describe("#function hasValidCacheHeaders", function() {
 
    beforeEach(function() {	
    });
	
    it(" no cache header, should return false ", function() {
	    const resource = {response: {status:200,statusText:"",httpVersion:"http/2.0",headers:[{name:"content-encoding",value:"gzip"},{name:"content-type",value:"text/css"},{name:"toto",value:"test"}]}};
      expect(window.frames["testFrame"].contentWindow.hasValidCacheHeaders(resource)).toEqual(false);
    });

    it(" Cache-Control=no-cache  , should return false", function() {
	    const resource = {response: {headers:[{name:'Cache-Control',value:"no-cache"},{name:"content-encoding",value:"gzip"},{name:"content-type",value:"image/bmp"},{name:"toto",value:"test"}]}};
      expect(window.frames["testFrame"].contentWindow.hasValidCacheHeaders(resource)).toEqual(false);
    });

    it(" Cache-Control=no-store , should return false", function() {
	    const resource = {response: {headers:[{name:'Cache-Control',value:"no-store"},{name:"content-encoding",value:"gzip"},{name:"content-type",value:"test/test"},{name:"toto",value:"test"}]}};
      expect(window.frames["testFrame"].contentWindow.hasValidCacheHeaders(resource)).toEqual(false);
    });


    it(" Cache expires in 2001, should return false", function() {
	    const resource = {response: {headers:[{name:'Cache-Control',value:"test"},{name:'Expires',value:"Fri, 05 Jan 2001 18:09:48 GMT"},{name:"content-encoding",value:"gzip"},{name:"content-type",value:"test/test"},{name:"toto",value:"test"}]}};
      expect(window.frames["testFrame"].contentWindow.hasValidCacheHeaders(resource)).toEqual(false);
    });

    it(" Cache expires in 2099, should return true", function() {
	    const resource = {response: {headers:[{name:'Cache-Control',value:"test"},{name:'Expires',value:"Mon, 05 Jan 2099 18:09:48 GMT"},{name:"content-encoding",value:"gzip"},{name:"content-type",value:"test/test"},{name:"toto",value:"test"}]}};
      expect(window.frames["testFrame"].contentWindow.hasValidCacheHeaders(resource)).toEqual(true);
    });

    it(" Date after Expires , shoud return false ", function() {
	    const resource = {response: {headers:[{name:'Cache-Control',value:"test"},{"name":"Date","value":"Mon, 05 Jan 2099 18:33:56 GMT"},{name:'Expires',value:"Mon, 05 Jan 2099 18:09:48 GMT"},{name:"content-encoding",value:"gzip"},{name:"content-type",value:"test/test"},{name:"toto",value:"test"}]}};
      expect(window.frames["testFrame"].contentWindow.hasValidCacheHeaders(resource)).toEqual(false);
    });

    afterEach(function() {
    });
  });

  


});

