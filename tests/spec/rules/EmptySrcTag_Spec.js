describe("Rules => EmptySrcTag.js", function () {

    let rule;
    beforeEach(function () {
        rule = createEmptySrcTagRule();
    });

    it(" no empty src tag, it should return A", function () {
        const measures = { emptySrcTagNumber: 0 };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('A');
    });

    it(" 1 empty src tag , it should return C", function () {
        const measures = { emptySrcTagNumber: 1 };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('C');
    });

    afterEach(function () {
    });
});



