describe("Rules => HttpRequests.js", function () {

    let rule;
    beforeEach(function () {
        rule = createHttpRequestsRule();
    });

    it(" 5 http requests, it should return A", function () {
        const measures = { nbRequest: 5, entries: [] };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('A');
    });

    it(" 26 http requests, it should return A", function () {
        const measures = { nbRequest: 26, entries: [] };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('A');
    });

    it(" 27 http requests, it should return B", function () {
        const measures = { nbRequest: 27, entries: [] };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('B');
    });

    it(" 41 http requests, it should return C", function () {
        const measures = { nbRequest: 41, entries: [] };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('C');
    });

    afterEach(function () {
    });
});



