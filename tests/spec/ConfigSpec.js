

describe("Analyse", function() {
  

  describe("#function getPluginNumber", function() {
 
    beforeEach(function() {
	
    });
	
    it("plugin number should return 0 ", function() {
      expect(window.frames["testFrame"].contentWindow.getPluginNumber()).toEqual(0);
    });

    it("if tag <object> plugin number should return 1 ", function() {
      var new_element = window.frames["testFrame"].contentWindow.document.createElement("object");
      window.frames["testFrame"].contentWindow.document.getElementById("node").appendChild(new_element);
      expect(window.frames["testFrame"].contentWindow.getPluginNumber()).toEqual(1);
    });

    it("if tag <embed> plugin number should return 1 ", function() {
      var new_element = window.frames["testFrame"].contentWindow.document.createElement("embed");
      window.frames["testFrame"].contentWindow.document.getElementById("node").appendChild(new_element);
      expect(window.frames["testFrame"].contentWindow.getPluginNumber()).toEqual(1);
    });

    it("if 2  tag embed and object number should return 2 ", function() {
      var new_element = window.frames["testFrame"].contentWindow.document.createElement("object");
      window.frames["testFrame"].contentWindow.document.getElementById("node").appendChild(new_element);
      new_element = window.frames["testFrame"].contentWindow.document.createElement("embed");
      window.frames["testFrame"].contentWindow.document.getElementById("node").appendChild(new_element);
      expect(window.frames["testFrame"].contentWindow.getPluginNumber()).toEqual(2);
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


  describe("#function getMaxStyleSheetsNumber", function() {
 
    beforeEach(function() {	
    });
	
    it(" should return 2", function() {
      expect(window.frames["testFrame"].contentWindow.getStyleSheetsNumber()).toEqual(2);
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


  describe('#getPrintSheetsNumber', function() {

    beforeEach(function() {	
    });
	
    it(" should return 2", function() {
      expect(window.frames["testFrame"].contentWindow.getPrintSheetsNumber()).toEqual(2);
    });

    afterEach(function() {
    });
  });
});
