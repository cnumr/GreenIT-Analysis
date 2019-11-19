
describe("ecoIndex.js", function() {

  describe("#function computeEcoIndex", function() {
    
    beforeEach(function() {	
    });
	
    it(" 100 , 100 ,100 should return 67", function() {
      expect(computeEcoIndex(100,100,100)).toEqual(67);
    });

    it(" 100 , 100 ,1000 should return 62", function() {
      expect(computeEcoIndex(100,100,1000)).toEqual(62);
    });

    it(" 100 , 100 ,10000 should return 53", function() {
      expect(computeEcoIndex(100,100,10000)).toEqual(53);
    });

    it(" 200 , 200 ,10000 should return 53", function() {
      expect(computeEcoIndex(200,200,10000)).toEqual(41);
    });


    it(" 2355 , 267 ,2493 should return 5", function() {
      expect(computeEcoIndex(2355,267,2493)).toEqual(5);
    });

    it(" 240 , 20 ,331 should return 78", function() {
      expect(computeEcoIndex(240,20,331)).toEqual(78);
    });

    afterEach(function() {
    });
  });

  describe("#function getEcoIndexGrade", function() {
    
    beforeEach(function() {	
    });
	
    it(" 2 should return G ", function() {
      expect(getEcoIndexGrade(2)).toEqual("G");
    });

    it(" 10 should return F ", function() {
      expect(getEcoIndexGrade(10)).toEqual("F");
    });

    it(" 25 should return E ", function() {
      expect(getEcoIndexGrade(25)).toEqual("E");
    });

    it(" 40 should return D ", function() {
      expect(getEcoIndexGrade(40)).toEqual("D");
    });

    it(" 50.2 should return C ", function() {
      expect(getEcoIndexGrade(50.2)).toEqual("C");
    });

    it(" 75 should return B ", function() {
      expect(getEcoIndexGrade(75)).toEqual("B");
    });

    it(" 100 should return A ", function() {
      expect(getEcoIndexGrade(100)).toEqual("A");
    });

    afterEach(function() {
    });
  });
  

  describe("#function computeGreenhouseGasesEmissionfromEcoIndex", function() {
    
    beforeEach(function() {	
    });
	
    it(" 2 should return 2.96", function() {
      expect(computeGreenhouseGasesEmissionfromEcoIndex(2)).toEqual(2.96);
    });

    it(" 10 should return 2.8", function() {
      expect(computeGreenhouseGasesEmissionfromEcoIndex(10)).toEqual(2.8);
    });

    it(" 50 should return 2", function() {
      expect(computeGreenhouseGasesEmissionfromEcoIndex(50)).toEqual(2);
    });

    it(" 70 should return 1.6", function() {
      expect(computeGreenhouseGasesEmissionfromEcoIndex(70)).toEqual(1.6);
    });

    afterEach(function() {
    });
  });
  

  describe("#function computeWaterConsumptionfromEcoIndex", function() {
    
    beforeEach(function() {	
    });
	
    it(" 2 should return 4.44", function() {
      expect(computeWaterConsumptionfromEcoIndex(2)).toEqual(4.44);
    });

    it(" 10 should return 4.2", function() {
      expect(computeWaterConsumptionfromEcoIndex(10)).toEqual(4.2);
    });

    it(" 50 should return 3", function() {
      expect(computeWaterConsumptionfromEcoIndex(50)).toEqual(3);
    });

    it(" 70 should return 2.4", function() {
      expect(computeWaterConsumptionfromEcoIndex(70)).toEqual(2.4);
    });

    afterEach(function() {
    });
  });


});

