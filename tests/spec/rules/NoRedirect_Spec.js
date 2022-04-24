describe("Rules => NoRedirect.js", function () {

    let rule;
    beforeEach(function () {
        rule = createNoRedirectRule();
    });

    it(" 0 redirect, it should return A", function () {
        const measures = {
            entries:
                [{
                    request: { url: "test" },
                    response:
                        {
                            status: 200, statusText: "", httpVersion: "http/2.0", headers:
                                [{ name: "content-encoding", value: "gzip" }]
                        }
                }]
        };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('A');
    });

    it(" 1 redirect, it should return A", function () {
        const measures = {
            entries:
                [{
                    request: { url: "test" },
                    response:
                        {
                            status: 301, statusText: "", httpVersion: "http/2.0", headers:
                                [{ name: "content-encoding", value: "gzip" }]
                        }
                }]
        };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('A');
    });


    it(" 2 redirect, it should return C", function () {
        const measures = {
            entries:
                [{
                    request: { url: "test" },
                    response:
                        {
                            status: 301, statusText: "", httpVersion: "http/2.0", headers:
                                [{ name: "content-encoding", value: "gzip" }]
                        }
                },
                    {
                        request: { url: "test2" },
                        response:
                            {
                                status: 307, statusText: "", httpVersion: "http/2.0", headers:
                                    [{ name: "content-encoding", value: "gzip" }]
                            }
                    }]
        };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('C');
    });

    afterEach(function () {
    });
});



