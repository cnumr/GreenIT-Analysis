
describe("rulesManager.js", function () {

  let rulesChecker;
  beforeEach(function () {
     rulesChecker = rulesManager.getNewRulesChecker();
  });

  it(" instanciate rule checker", function () {
    expect(rulesChecker).toBeDefined();
  });

  it(" finds specific rule by key", function () {
    let rule = rulesChecker.getRule("UseStandardTypefaces");
    expect(rule.id).toEqual('UseStandardTypefaces');
  });

  afterEach(function () {
  });

});