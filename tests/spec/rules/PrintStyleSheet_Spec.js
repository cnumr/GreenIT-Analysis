describe("Rules => PrintStyleSheet.js", function () {

    let rule;
    beforeEach(function () {
        rule = createPrintStyleSheetRule();
    });

    it(" 0 print stylesheet, it should return C", function () {
        let rulesChecker = rulesManager.getNewRulesChecker();
        const measures = { printStyleSheetsNumber: 0 };
        let rule = rulesChecker.getRule("PrintStyleSheet");
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('C');
    });

    it(" 1 print stylesheet, it should return A", function () {
        let rulesChecker = rulesManager.getNewRulesChecker();
        const measures = { printStyleSheetsNumber: 1 };
        let rule = rulesChecker.getRule("PrintStyleSheet");
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('A');
    });

    afterEach(function () {
    });
});



