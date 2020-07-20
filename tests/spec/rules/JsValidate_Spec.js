describe("Rules => JsValidate.js", function () {

    let rule;
    beforeEach(function () {
        rule = createJsValidateRule();
    });

    it(" 0 js errors, it should return A", function () {
        const resourceContent ={
            url:"test",
            type:"script",
            content:"const test=2;"
        }
        rule.check("",resourceContent);
        expect(rule.complianceLevel).toEqual('A');
    });

    it(" 1 js errors, it should return C", function () {
        const resourceContent ={
            url:"test",
            type:"script",
            content:"const test=2);"
        }
        rule.check("",resourceContent);
        expect(rule.complianceLevel).toEqual('C');
    });

    it(" 3 js errors, it should return C", function () {
        const resourceContent ={
            url:"test",
            type:"script",
            content:"const test=2);"
        }
        rule.check("",resourceContent);
        resourceContent.content = "ty ret);"
        rule.check("",resourceContent);
        resourceContent.content = "ty retmdfjqsksd);"
        rule.check("",resourceContent);
        expect(rule.complianceLevel).toEqual('C');
    });

    afterEach(function () {
    });
});



