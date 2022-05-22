

describe("analyseFrame.js", function() {
  
  const testFrame = window.frames["testFrame"].contentWindow;  

  describe("#function getPluginsNumber", function() {
 
    beforeEach(function() {
	
    });
	
    it("plugins number should return 0 ", function() {
      expect(testFrame.getPluginsNumber()).toEqual(0);
    });

    it("if tag <object> plugin number should return 1 ", function() {
      var new_element = testFrame.document.createElement("object");
      testFrame.document.getElementById("node").appendChild(new_element);
      expect(testFrame.getPluginsNumber()).toEqual(1);
    });

    it("if tag <embed> plugin number should return 1 ", function() {
      var new_element = testFrame.document.createElement("embed");
      testFrame.document.getElementById("node").appendChild(new_element);
      expect(testFrame.getPluginsNumber()).toEqual(1);
    });

    it("if 2  tag embed and object number should return 2 ", function() {
      var new_element = testFrame.document.createElement("object");
      testFrame.document.getElementById("node").appendChild(new_element);
      new_element = testFrame.document.createElement("embed");
      testFrame.document.getElementById("node").appendChild(new_element);
      expect(testFrame.getPluginsNumber()).toEqual(2);
    });


    afterEach(function() {
     let object_elements = testFrame.document.querySelectorAll("object");
     for (let i=0;i<object_elements.length;i++) {
      object_elements[i].parentNode.removeChild(object_elements[i]);
     }
     let embed_elements = testFrame.document.querySelectorAll("embed");
     for (let i=0;i<embed_elements.length;i++) {
      embed_elements[i].parentNode.removeChild(embed_elements[i]);
     }

    });
  });

  describe("#function getPrintStyleSheetsNumber", function() {
 
    beforeEach(function() {	
    });
	
    it(" should return 2", function() {
      expect(testFrame.getPrintStyleSheetsNumber()).toEqual(2);
    });

    afterEach(function() {
    });
  });

  describe("#function getInlineStyleSheetsNumber", function() {
 
    beforeEach(function() {	
    });
	
    it(" should return 3", function() {
      expect(testFrame.getInlineStyleSheetsNumber()).toEqual(3);
    });

    afterEach(function() {
    });
  });


  describe("#function getInlineJsScriptsNumber()", function() {
 
    beforeEach(function() {	
    });
	
    it(" should return 5", function() {
      expect(testFrame.getInlineJsScriptsNumber()).toEqual(5);
    });

    afterEach(function() {
    });
  });

  describe("#function getImagesResizedInBrowser()", function() {
 
    beforeEach(function() {	
    });
	
    it(" should return 1", function() {
      expect(testFrame.getImagesResizedInBrowser().length).toEqual(1);
    });

    afterEach(function() {
    });
  });

  describe("#function getDomSizeWithoutSvg()", function() {
    it(" should return 22 = 20 element + 2 svg images ", function() {
      expect(testFrame.getDomSizeWithoutSvg()).toEqual(22);
    });

  });

  
});
