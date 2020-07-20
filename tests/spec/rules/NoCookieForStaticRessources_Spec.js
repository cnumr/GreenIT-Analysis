describe("Rules => NoCookieForStaticRessources.js", function () {

    let rule;
    beforeEach(function () {
        rule = createNoCookieForStaticRessourcesRule();
    });

    it(" 1 static ressource ,  no cookie, it should return A", function () {
        const measures = {
            entries:
                [{
                    request: { url: "http://test", headers: [{ name: 'test', value: 'test' }] },
                    response: { headers: [{ name: 'content-type', value: 'text/css' }] }
                }]
        };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('A');
    });

    it(" 1 static ressource ,  one small cookie, it should return B", function () {
        const measures = {
            entries:
                [{
                    request: { url: "http://test", headers: [{ name: 'cookie', value: 'test' }] },
                    response: { headers: [{ name: 'content-type', value: 'text/css' }] }
                }]
        };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('B');
    });

    it(" 4 static ressources ,  2 cookie with small size, it should return B", function () {
        const measures = {
            entries:
                [
                    { request: { url: "http://test", headers: [{ name: 'cookie', value: 'test' }] }, response: { headers: [{ name: 'content-type', value: 'text/css' }] } },
                    { request: { url: "http://testa", headers: [{ name: 'cookie', value: 'test' }] }, response: { headers: [{ name: 'content-type', value: 'text/css' }] } },
                    { request: { url: "http://testb", headers: [{ name: 'test', value: 'test' }] }, response: { headers: [{ name: 'content-type', value: 'text/css' }] } },
                    { request: { url: "http://testc", headers: [{ name: 'test', value: 'test' }] }, response: { headers: [{ name: 'content-type', value: 'text/css' }] } },
                ]
        };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('B');
    });

    it(" 4 static ressources ,  2 cookie with total size > 2000 , it should return C", function () {
        let bigCookie = "";
        for (let i = 0; i < 100; i++) bigCookie += "0123456789"
        const measures = {
            entries:
                [
                    { request: { url: "http://test", headers: [{ name: 'cookie', value: bigCookie }] }, response: { headers: [{ name: 'content-type', value: 'text/css' }] } },
                    { request: { url: "http://testa", headers: [{ name: 'cookie', value: bigCookie }] }, response: { headers: [{ name: 'content-type', value: 'text/css' }] } },
                    { request: { url: "http://testb", headers: [{ name: 'test', value: 'test' }] }, response: { headers: [{ name: 'content-type', value: 'text/css' }] } },
                    { request: { url: "http://testc", headers: [{ name: 'test', value: 'test' }] }, response: { headers: [{ name: 'content-type', value: 'text/css' }] } },
                ]
        };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('C');
    });

    it(" 2 non static ressources with cookie it should return A", function () {
        let bigCookie = "";
        for (let i = 0; i < 100; i++) bigCookie += "0123456789"
        const measures = {
            entries:
                [
                    { request: { url: "http://test", headers: [{ name: 'cookie', value: 'test' }] }, response: { headers: [{ name: 'content-type', value: 'application/json' }] } },
                    { request: { url: "http://testa", headers: [{ name: 'cookie', value: 'test' }] }, response: { headers: [{ name: 'content-type', value: 'text/html' }] } }
                ]
        };

        rule.check(measures);
        expect(rule.complianceLevel).toEqual('A');
    });

    afterEach(function () {
    });
});



