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
    it(" 5 urls, 3 domains, it should return B", function () {
        const measures = {
            entries:
                [
                    { request: { url: "http://test" } },
                    { request: { url: "http://test/test" } },
                    { request: { url: "http://test/aaa" } },
                    { request: { url: "http://testb/bbbb" } },
                    { request: { url: "http://testc/toto" } }
                ]
        };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('B');
    });
    it(" 5 urls, 4 domains, it should return C", function () {
        const measures = {
            entries:
                [
                    { request: { url: "http://test" } },
                    { request: { url: "http://test/test" } },
                    { request: { url: "http://testb/aaa" } },
                    { request: { url: "http://testc/bbbb" } },
                    { request: { url: "http://testd/toto" } }
                ]
        };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('C');
    });

    afterEach(function () {
    });
});



