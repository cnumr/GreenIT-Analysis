describe("Rules => StyleSheets.js", function () {

    let rule;
    beforeEach(function () {
        rule = createStyleSheetsRule();
    });

    it(" 0 stylesheet, it should return A", function () {
        const measures = {
            entries:
                [{
                    request: { url: "test" },
                    response:
                        {
                            status: 200, statusText: "", httpVersion: "http/2.0", headers:
                                [{ name: "content-encoding", value: "gzip" },
                                    { name: "content-type", value: "text/json" }]
                        }
                }]
        };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('A');
    });

    it(" 4 stylesheet, it should return A", function () {
        const measures = {
            entries:
                [{
                    request: { url: "test" },
                    response:
                        {
                            status: 200, statusText: "", httpVersion: "http/2.0", headers:
                                [{ name: "content-encoding", value: "gzip" },
                                    { name: "content-type", value: "text/css" }]
                        }
                },
                    {
                        request: { url: "test2" },
                        response:
                            {
                                status: 200, statusText: "", httpVersion: "http/2.0", headers:
                                    [{ name: "content-encoding", value: "gzip" },
                                        { name: "content-type", value: "text/css" }]
                            }
                    },
                    {
                        request: { url: "test3" },
                        response:
                            {
                                status: 200, statusText: "", httpVersion: "http/2.0", headers:
                                    [{ name: "content-encoding", value: "gzip" },
                                        { name: "content-type", value: "text/css" }]
                            }
                    },
                    {
                        request: { url: "test4" },
                        response:
                            {
                                status: 200, statusText: "", httpVersion: "http/2.0", headers:
                                    [{ name: "content-encoding", value: "gzip" },
                                        { name: "content-type", value: "text/css" }]
                            }
                    },
                    {
                        request: { url: "test5" },
                        response:
                            {
                                status: 200, statusText: "", httpVersion: "http/2.0", headers:
                                    [{ name: "content-encoding", value: "gzip" },
                                        { name: "content-type", value: "text/html" }]
                            }
                    }]
        };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('A');
    });

    it(" 8 stylesheet, it should return B", function () {
        const measures = {
            entries:
                [{
                    request: { url: "test" },
                    response:
                        {
                            status: 200, statusText: "", httpVersion: "http/2.0", headers:
                                [{ name: "content-encoding", value: "gzip" },
                                    { name: "content-type", value: "text/css" }]
                        }
                },
                    {
                        request: { url: "test2" },
                        response:
                            {
                                status: 200, statusText: "", httpVersion: "http/2.0", headers:
                                    [{ name: "content-encoding", value: "gzip" },
                                        { name: "content-type", value: "text/css" }]
                            }
                    },
                    {
                        request: { url: "test3" },
                        response:
                            {
                                status: 200, statusText: "", httpVersion: "http/2.0", headers:
                                    [{ name: "content-encoding", value: "gzip" },
                                        { name: "content-type", value: "text/css" }]
                            }
                    },
                    {
                        request: { url: "test4" },
                        response:
                            {
                                status: 200, statusText: "", httpVersion: "http/2.0", headers:
                                    [{ name: "content-encoding", value: "gzip" },
                                        { name: "content-type", value: "text/css" }]
                            }
                    },
                    {
                        request: { url: "test5" },
                        response:
                            {
                                status: 200, statusText: "", httpVersion: "http/2.0", headers:
                                    [{ name: "content-encoding", value: "gzip" },
                                        { name: "content-type", value: "text/css" }]
                            }
                    },
                    {
                        request: { url: "test6" },
                        response:
                            {
                                status: 200, statusText: "", httpVersion: "http/2.0", headers:
                                    [{ name: "content-encoding", value: "gzip" },
                                        { name: "content-type", value: "text/css" }]
                            }
                    },
                    {
                        request: { url: "test7" },
                        response:
                            {
                                status: 200, statusText: "", httpVersion: "http/2.0", headers:
                                    [{ name: "content-encoding", value: "gzip" },
                                        { name: "content-type", value: "text/css" }]
                            }
                    },
                    {
                        request: { url: "test8" },
                        response:
                            {
                                status: 200, statusText: "", httpVersion: "http/2.0", headers:
                                    [{ name: "content-encoding", value: "gzip" },
                                        { name: "content-type", value: "text/css" }]
                            }
                    }]
        };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('B');
    });

    it(" 8 stylesheet, it should return B", function () {
        const measures = {
            entries:
                [{
                    request: { url: "test" },
                    response:
                        {
                            status: 200, statusText: "", httpVersion: "http/2.0", headers:
                                [{ name: "content-encoding", value: "gzip" },
                                    { name: "content-type", value: "text/css" }]
                        }
                },
                    {
                        request: { url: "test2" },
                        response:
                            {
                                status: 200, statusText: "", httpVersion: "http/2.0", headers:
                                    [{ name: "content-encoding", value: "gzip" },
                                        { name: "content-type", value: "text/css" }]
                            }
                    },
                    {
                        request: { url: "test3" },
                        response:
                            {
                                status: 200, statusText: "", httpVersion: "http/2.0", headers:
                                    [{ name: "content-encoding", value: "gzip" },
                                        { name: "content-type", value: "text/css" }]
                            }
                    },
                    {
                        request: { url: "test4" },
                        response:
                            {
                                status: 200, statusText: "", httpVersion: "http/2.0", headers:
                                    [{ name: "content-encoding", value: "gzip" },
                                        { name: "content-type", value: "text/css" }]
                            }
                    },
                    {
                        request: { url: "test5" },
                        response:
                            {
                                status: 200, statusText: "", httpVersion: "http/2.0", headers:
                                    [{ name: "content-encoding", value: "gzip" },
                                        { name: "content-type", value: "text/css" }]
                            }
                    },
                    {
                        request: { url: "test6" },
                        response:
                            {
                                status: 200, statusText: "", httpVersion: "http/2.0", headers:
                                    [{ name: "content-encoding", value: "gzip" },
                                        { name: "content-type", value: "text/css" }]
                            }
                    },
                    {
                        request: { url: "test7" },
                        response:
                            {
                                status: 200, statusText: "", httpVersion: "http/2.0", headers:
                                    [{ name: "content-encoding", value: "gzip" },
                                        { name: "content-type", value: "text/css" }]
                            }
                    },
                    {
                        request: { url: "test8" },
                        response:
                            {
                                status: 200, statusText: "", httpVersion: "http/2.0", headers:
                                    [{ name: "content-encoding", value: "gzip" },
                                        { name: "content-type", value: "text/css" }]
                            }
                    },
                    {
                        request: { url: "test9" },
                        response:
                            {
                                status: 200, statusText: "", httpVersion: "http/2.0", headers:
                                    [{ name: "content-encoding", value: "gzip" },
                                        { name: "content-type", value: "text/css" }]
                            }
                    },
                    {
                        request: { url: "test10" },
                        response:
                            {
                                status: 200, statusText: "", httpVersion: "http/2.0", headers:
                                    [{ name: "content-encoding", value: "gzip" },
                                        { name: "content-type", value: "text/css" }]
                            }
                    },
                    {
                        request: { url: "test11" },
                        response:
                            {
                                status: 200, statusText: "", httpVersion: "http/2.0", headers:
                                    [{ name: "content-encoding", value: "gzip" },
                                        { name: "content-type", value: "text/css" }]
                            }
                    }]
        };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('C');
    });

});



