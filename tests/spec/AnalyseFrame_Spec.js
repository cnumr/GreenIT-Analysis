

describe("analyseFrame.js", function() {
  
  const testFrame = window.frames["testFrame"].contentWindow;  

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
