describe("Rules => MaxCookiesLength.js", function () {

    let rule;
    beforeEach(function () {
        rule = createMaxCookiesLengthRule();
    });

    it(" 1 ressource ,  no cookie, it should return A", function () {
        const measures = {
            entries:
                [{
                    request: { url: "http://test", headers: [{ name: 'test', value: 'test' }] },
                }]
        };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('A');
    });
    it(" 1 ressource ,  one small cookie, it should return A", function () {
        const measures = {
            entries:
                [{
                    request: { url: "http://test", headers: [{ name: 'cookie', value: 'test' }] },
                }]
        };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('A');
    });
    it(" 4 ressources ,  4 small cookie, it should return A", function () {
        const measures = {
            entries:
                [
                    { request: { url: "http://test", headers: [{ name: 'cookie', value: 'test' }] } },
                    { request: { url: "http://testa", headers: [{ name: 'cookie', value: 'test' }] } },
                    { request: { url: "http://testb", headers: [{ name: 'cookie', value: 'test' }] } },
                    { request: { url: "http://testc", headers: [{ name: 'cookie', value: 'test' }] } },
                ]
        };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('A');
    });

    it(" 4 ressources ,  3 small cookie and one medium cookie, it should return B", function () {
        let bigCookie = "";
        for (let i = 0; i < 100; i++) bigCookie += "0123456789"
        const measures = {
            entries:
                [
                    { request: { url: "http://test", headers: [{ name: 'cookie', value: 'test' }] } },
                    { request: { url: "http://testa", headers: [{ name: 'cookie', value: 'test' }] } },
                    { request: { url: "http://testb", headers: [{ name: 'cookie', value: 'test' }] } },
                    { request: { url: "http://testc", headers: [{ name: 'cookie', value: bigCookie }] } },
                ]
        };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('B');
    });

    it(" 4 ressources ,  3 small cookie and one big cookie, it should return C  ", function () {
        let bigCookie = "";
        for (let i = 0; i < 200; i++) bigCookie += "01234556789"
        const measures = {
            entries:
                [
                    { request: { url: "http://test", headers: [{ name: 'cookie', value: 'test' }] } },
                    { request: { url: "http://testa", headers: [{ name: 'cookie', value: 'test' }] } },
                    { request: { url: "http://testb", headers: [{ name: 'cookie', value: 'test' }] } },
                    { request: { url: "http://testc", headers: [{ name: 'cookie', value: bigCookie }] } },
                ]
        };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('C');
    });

    afterEach(function () {
    });
});



