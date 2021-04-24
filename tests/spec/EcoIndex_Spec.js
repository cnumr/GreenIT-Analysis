
describe("ecoIndex.js", function() {

  describe("#function computeEcoIndex", function() {
    
    beforeEach(function() {	
    });
	
    it(" 100 , 100 ,100 should return 72", function() {
      expect(Math.round(computeEcoIndex(100,100,100))).toEqual(72);
    });

    it(" 100 , 100 ,1000 should return 67", function() {
      expect(Math.round(computeEcoIndex(100,100,1000))).toEqual(67);
    });

    it(" 100 , 100 ,10000 should return 58", function() {
      expect(Math.round(computeEcoIndex(100,100,10000))).toEqual(58);
    });

    it(" 200 , 200 ,10000 should return 46", function() {
      expect(Math.round(computeEcoIndex(200,200,10000))).toEqual(46);
    });


    it(" 2355 , 267 ,2493 should return 10", function() {
      expect(Math.round(computeEcoIndex(2355,267,2493))).toEqual(10);
    });

    it(" 240 , 20 ,331 should return 83", function() {
      expect(Math.round(computeEcoIndex(240,20,331))).toEqual(83);
    });

    it(" 6000 , 4000 ,300000 should return 0", function() {
      expect(Math.round(computeEcoIndex(600000,4000,300000))).toEqual(0);
    });

    it(" 0 , 0 , 0 should return 100", function() {
      expect(Math.round(computeEcoIndex(0,0,0))).toEqual(100);
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

    it(" 15 should return F ", function() {
      expect(getEcoIndexGrade(15)).toEqual("F");
    });

    it(" 30 should return E ", function() {
      expect(getEcoIndexGrade(30)).toEqual("E");
    });

    it(" 45 should return D ", function() {
      expect(getEcoIndexGrade(45)).toEqual("D");
    });

    it(" 55.2 should return C ", function() {
      expect(getEcoIndexGrade(55.2)).toEqual("C");
    });

    it(" 80 should return B ", function() {
      expect(getEcoIndexGrade(80)).toEqual("B");
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
      expect(computeGreenhouseGasesEmissionfromEcoIndex(2)).toEqual("2.96");
    });

    it(" 10 should return 2.80", function() {
      expect(computeGreenhouseGasesEmissionfromEcoIndex(10)).toEqual("2.80");
    });

    it(" 50 should return 2.00", function() {
      expect(computeGreenhouseGasesEmissionfromEcoIndex(50)).toEqual("2.00");
    });

    it(" 70 should return 1.60", function() {
      expect(computeGreenhouseGasesEmissionfromEcoIndex(70)).toEqual("1.60");
    });

    afterEach(function() {
    });
  });
  

  describe("#function computeWaterConsumptionfromEcoIndex", function() {
    
    beforeEach(function() {	
    });
	
    it(" 2 should return 4.44", function() {
      expect(computeWaterConsumptionfromEcoIndex(2)).toEqual("4.44");
    });

    it(" 10 should return 4.20", function() {
      expect(computeWaterConsumptionfromEcoIndex(10)).toEqual("4.20");
    });

    it(" 50 should return 3.00", function() {
      expect(computeWaterConsumptionfromEcoIndex(50)).toEqual("3.00");
    });

    it(" 70 should return 2.40", function() {
      expect(computeWaterConsumptionfromEcoIndex(70)).toEqual("2.40");
    });

    afterEach(function() {
    });
  });


});

