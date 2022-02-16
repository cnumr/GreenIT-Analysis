describe("Rules => ExternalizeCss.js", function () {

  let rule;
  beforeEach(function () {
    rule = createExternalizeCssRule();
  });

  it(" 0 inline css , it should return A", function () {
    const measures = {inlineStyleSheetsNumber: 0};
    rule.check(measures);
    expect(rule.complianceLevel).toEqual('A');
  });

  it(" 1 inline css, it should return C", function () {
    const measures = {inlineStyleSheetsNumber: 1};
    rule.check(measures);
    expect(rule.complianceLevel).toEqual('C');
  });

  afterEach(function () {
  });
});



