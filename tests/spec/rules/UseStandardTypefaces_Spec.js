describe("Rules => UseStandardTypefaces.js", function () {

    let rule;
    beforeEach(function () {
        rule = createUseStandardTypefacesRule();
    });

    it(" 0 specific font, it should return A", function () {
        const measures = {
            entries:
                [{
                    request: { url: "test" },
                    response:
                        {
                            status: 200, statusText: "", httpVersion: "http/2.0", headers:
                                [{ name: 'test', value: "test" },
                                    { name: "content-type", value: "text/css" }]
                        }
                }],
            dataEntries :[]
        };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('A');
    });




    it(" 1 specific font file  should return  A", function () {
        const measures = {
            entries:
                [{
                    request: { url: "test" },
                    response:
                        {
                            content : {size : 1000}, status: 200, statusText: "", httpVersion: "http/2.0", headers:
                                [{ name: 'test', value: "test" },
                                    { name: "content-type", value: "application/font-woff" }]
                        }
                }],
            dataEntries :[]
        };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('A');
    });

    it(" 2 specific font files  should return  B", function () {
        const measures = {
            entries:
                [{
                    request: { url: "test" },
                    response:
                        {
                            content : {size : 1000}, status: 200, statusText: "", httpVersion: "http/2.0", headers:
                                [{ name: 'test', value: "test" },
                                    { name: "content-type", value: "application/font-woff" }]
                        }
                },
                    {
                        request: { url: "test2" },
                        response:
                            {
                                content : {size : 2000}, status: 200, statusText: "", httpVersion: "http/2.0", headers:
                                    [{ name: 'test', value: "test" },
                                        { name: "content-type", value: "application/font-woff" }]
                            }
                    }],
            dataEntries :[]
        };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('B');
    });



    it(" 3 specific font files  should return  C", function () {
        const measures = {
            entries:
                [{
                    request: { url: "test" },
                    response:
                        {
                            content : {size : 10000}, status: 200, statusText: "", httpVersion: "http/2.0", headers:
                                [{ name: 'test', value: "test" },
                                    { name: "content-type", value: "application/font-woff" }]
                        }
                },
                {
                    request: { url: "test2" },
                    response:
                        {
                            content : {size : 20000}, status: 200, statusText: "", httpVersion: "http/2.0", headers:
                                [{ name: 'test', value: "test" },
                                    { name: "content-type", value: "application/font-woff" }]
                        }
                },
                {
                    request: { url: "test3" },
                    response:
                        {
                            content : {size : 20000}, status: 200, statusText: "", httpVersion: "http/2.0", headers:
                                [{ name: 'test', value: "test" },
                                    { name: "content-type", value: "application/font-woff" }]
                        }
                }],
            dataEntries :[]
        };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('C');
    });
});



