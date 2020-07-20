describe("Rules => UseETags.js", function () {

    let rule;
    beforeEach(function () {
        rule = createUseETagsRule();
    });

    it(" 1 static ressources with ETag, it should return A", function () {
        const measures = {
            entries:
                [{
                    request: { url: "test" },
                    response:
                        {
                            content:{size:100},status: 200, statusText: "", httpVersion: "http/2.0", headers:
                                [{ name: 'Etag', value: "test" },
                                    { name: "content-type", value: "text/css" }]
                        }
                }]
        };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('A');
    });

    it(" 1 static ressources with no ETag, it should return C", function () {
        const measures = {
            entries:
                [{
                    request: { url: "test" },
                    response:
                        {
                            content:{size:100},status: 200, statusText: "", httpVersion: "http/2.0", headers:
                                [{ name: "content-type", value: "text/css" }]
                        }
                }]
        };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('C');
    });

    it(" 2 static ressources with no ETag, it should return C", function () {
        const measures = {
            entries:
                [{
                    request: { url: "test" },
                    response:
                        {
                            content:{size:100},status: 200, statusText: "", httpVersion: "http/2.0", headers:
                                [{ name: "content-type", value: "text/css" }]
                        }
                },
                    {
                        request: { url: "test2" },
                        response:
                            {
                                content:{size:100},status: 200, statusText: "", httpVersion: "http/2.0", headers:
                                    [{ name: "content-type", value: "text/css" }]
                            }
                    }]
        };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('C');
    });

    it(" 3 static ressources with ETag, it should return A", function () {
        const measures = {
            entries:
                [{
                    request: { url: "test" },
                    response:
                        {
                            content:{size:100},status: 200, statusText: "", httpVersion: "http/2.0", headers:
                                [{ name: 'Etag', value: "test" },
                                    { name: "content-type", value: "text/css" }]
                        }
                },
                    {
                        request: { url: "test2" },
                        response:
                            {
                                content:{size:100},status: 200, statusText: "", httpVersion: "http/2.0", headers:
                                    [{ name: 'Etag', value: "test" },
                                        { name: "content-type", value: "text/css" }]
                            }
                    },
                    {
                        request: { url: "test3" },
                        response:
                            {
                                content:{size:100}, status: 200, statusText: "", httpVersion: "http/2.0", headers:
                                    [{ name: 'Etag', value: "test" },
                                        { name: "content-type", value: "text/css" }]
                            }
                    }]
        };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('A');
    });

    it(" 3 static ressources with 2 ETag, 91% with e-tag it should return B", function () {
        const measures = {
            entries:
                [{
                    request: { url: "test" },
                    response:
                        {
                            content:{size:90}, status: 200, statusText: "", httpVersion: "http/2.0", headers:
                                [{ name: "content-type", value: "text/css" }]
                        }
                },
                    {
                        request: { url: "test2" },
                        response:
                            {
                                content:{size:810}, status: 200, statusText: "", httpVersion: "http/2.0", headers:
                                    [{ name: 'Etag', value: "test" },
                                        { name: "content-type", value: "text/css" }]
                            }
                    },
                    {
                        request: { url: "test3" },
                        response:
                            {
                                content:{size:100}, status: 200, statusText: "", httpVersion: "http/2.0", headers:
                                    [{ name: 'Etag', value: "test" },
                                        { name: "content-type", value: "text/css" }]
                            }
                    }]
        };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('B');
    });

    it(" 3 static ressources with 2 ETag, 80% with e-tag it should return C", function () {
        const measures = {
            entries:
                [{
                    request: { url: "test" },
                    response:
                        {
                            content:{size:200}, status: 200, statusText: "", httpVersion: "http/2.0", headers:
                                [{ name: "content-type", value: "text/css" }]
                        }
                },
                    {
                        request: { url: "test2" },
                        response:
                            {
                                content:{size:700}, status: 200, statusText: "", httpVersion: "http/2.0", headers:
                                    [{ name: 'Etag', value: "test" },
                                        { name: "content-type", value: "text/css" }]
                            }
                    },
                    {
                        request: { url: "test3" },
                        response:
                            {
                                content:{size:100}, status: 200, statusText: "", httpVersion: "http/2.0", headers:
                                    [{ name: 'Etag', value: "test" },
                                        { name: "content-type", value: "text/css" }]
                            }
                    }]
        };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('C');
    });

    afterEach(function () {
    });
});



