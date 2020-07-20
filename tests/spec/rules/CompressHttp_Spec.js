describe("Rules => CompressHttp.js", function () {

    let rule;
    beforeEach(function () {
        rule = createCompressHttpRule();
    });

    it(" 1 static ressources not compressed, it should return C", function () {
        const measures = {
            entries:
                [{
                    request: { url: "test" },
                    response:
                        {
                            content: { size: 200 },
                            status: 200, statusText: "", httpVersion: "http/2.0", headers:
                                [
                                    { name: "content-type", value: "text/css" }]
                        }
                }]
        };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('C');
    });


    it(" 1 static ressources compressed, it should return A", function () {
        const measures = {
            entries:
                [{
                    request: { url: "test" },
                    response:
                        {
                            content: { size: 200 },
                            status: 200, statusText: "", httpVersion: "http/2.0", headers:
                                [{ name: 'content-encoding', value: "gzip" },
                                    { name: "content-type", value: "text/css" }]
                        }
                }]
        };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('A');
    });

    it("2 static ressources not compressed, it should return C", function () {
        const measures = {
            entries:
                [{
                    request: { url: "test2" },
                    response:
                        {
                            content: { size: 200 },
                            status: 200, statusText: "", httpVersion: "http/2.0", headers:
                                [{ name: "content-type", value: "text/css" }]
                        }
                },
                    {
                        request: { url: "test3" },
                        response:
                            {
                                content: { size: 200 },
                                status: 200, statusText: "", httpVersion: "http/2.0", headers:
                                    [{ name: "content-type", value: "text/css" }]
                            }
                    }]
        };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('C');
    });

    it(" 3 static ressources compressed, it should return A", function () {
       const measures = {
            entries:
                [{
                    request: { url: "test" },
                    response:
                        {
                            content: { size: 200 },
                            status: 200, statusText: "", httpVersion: "http/2.0", headers:
                                [{ name: 'content-encoding', value: "gzip" },
                                    { name: "content-type", value: "text/css" }]
                        }
                },
                    {
                        request: { url: "test2" },
                        response:
                            {
                                content: { size: 200 },
                                status: 200, statusText: "", httpVersion: "http/2.0", headers:
                                    [{ name: 'content-encoding', value: "gzip" },
                                        { name: "content-type", value: "text/css" }]
                            }
                    },
                    {
                        request: { url: "test3" },
                        response:
                            {
                                content: { size: 200 },
                                status: 200, statusText: "", httpVersion: "http/2.0", headers:
                                    [{ name: 'content-encoding', value: "gzip" },
                                        { name: "content-type", value: "text/css" }]
                            }
                    }]
        };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('A');
    });

    it(" 2 static ressources compressed and one not, 92% compressed,  it should return B", function () {
        const measures = {
            entries:
                [{
                    request: { url: "test" },
                    response:
                        {
                            content: { size:800 },
                            status: 200, statusText: "", httpVersion: "http/2.0", headers:
                                [{ name: "content-type", value: "text/css" }]
                        }
                },
                    {
                        request: { url: "test2" },
                        response:
                            {
                                content: { size: 1200 },
                                status: 200, statusText: "", httpVersion: "http/2.0", headers:
                                    [{ name: 'content-encoding', value: "gzip" },
                                        { name: "content-type", value: "text/css" }]
                            }
                    },
                    {
                        request: { url: "test3" },
                        response:
                            {
                                content: { size: 8000 },
                                status: 200, statusText: "", httpVersion: "http/2.0", headers:
                                    [{ name: 'content-encoding', value: "gzip" },
                                        { name: "content-type", value: "text/css" }]
                            }
                    }]
        };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('B');
    });

    it(" 1 static ressource compressed and two not, 50% compressed it should return C", function () {
        const measures = {
            entries:
                [{
                    request: { url: "test" },
                    response:
                        {
                            content: { size: 250 },
                            status: 200, statusText: "", httpVersion: "http/2.0", headers:
                                [{ name: "content-type", value: "text/css" }]
                        }
                },
                    {
                        request: { url: "test2" },
                        response:
                            {
                                content: { size: 250 },
                                status: 200, statusText: "", httpVersion: "http/2.0", headers:
                                    [{ name: "content-type", value: "text/css" }]
                            }
                    },
                    {
                        request: { url: "test3" },
                        response:
                            {
                                content: { size: 500 },
                                status: 200, statusText: "", httpVersion: "http/2.0", headers:
                                    [{ name: 'content-encoding', value: "gzip" },
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



