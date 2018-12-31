

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
