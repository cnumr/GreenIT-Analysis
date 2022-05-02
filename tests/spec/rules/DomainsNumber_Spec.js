describe("Rules => DomainsNumber.js", function () {

    let rule;
    beforeEach(function () {
        rule = createDomainsNumberRule();
    });

    it(" 2 urls, 1 domain, it should return A", function () {
        const measures = {
            entries:
                [
                    { request: { url: "http://test" } },
                    { request: { url: "http://test/toto" } }
                ]
        };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('A');
    });

    it(" 2 urls, 2 domains, it should return A", function () {
        const measures = {
            entries:
                [
                    { request: { url: "http://test" } },
                    { request: { url: "http://testb/toto" } }
                ]
        };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('A');
    });

    it(" 5 urls, 2 domains, it should return A", function () {
        const measures = {
            entries:
                [
                    { request: { url: "http://test" } },
                    { request: { url: "http://test/test" } },
                    { request: { url: "http://test/aaa" } },
                    { request: { url: "http://test/bbbb" } },
                    { request: { url: "http://testb/toto" } }
                ]
        };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('A');
    });
    it(" 6 urls, 4 domains, it should return B", function () {
        const measures = {
            entries:
                [
                    { request: { url: "http://test" } },
                    { request: { url: "http://test/test" } },
                    { request: { url: "http://test/aaa" } },
                    { request: { url: "http://testb/bbbb" } },
                    { request: { url: "http://testc/" } },
                    { request: { url: "http://testd/toto" } }
                ]
        };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('B');
    });
    it(" 6 urls, 6 domains, it should return C", function () {
        const measures = {
            entries:
                [
                    { request: { url: "http://test" } },
                    { request: { url: "http://testb/test" } },
                    { request: { url: "http://testc/aaa" } },
                    { request: { url: "http://testd/bbbb" } },
                    { request: { url: "http://teste/" } },
                    { request: { url: "http://testf/toto" } }
                ]
        };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('C');
    });
});



