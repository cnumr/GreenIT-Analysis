describe("Rules => ExternalizeJs.js", function () {

  let rule;
  beforeEach(function () {
    rule = createExternalizeJsRule();
  });

  it(" 0 inline js, it should return A", function () {
    const measures = {inlineJsScriptsNumber: 0};
    rule.check(measures);
    expect(rule.complianceLevel).toEqual('A');
  });

  it(" 1 inline js, it should return A", function () {
    const measures = {inlineJsScriptsNumber: 1};
    rule.check(measures);
    expect(rule.complianceLevel).toEqual('A');
  });

  it(" 2 inline js, it should return C", function () {
    const measures = {inlineJsScriptsNumber: 2};
    rule.check(measures);
    expect(rule.complianceLevel).toEqual('C');
  });

  afterEach(function () {
  });
});



