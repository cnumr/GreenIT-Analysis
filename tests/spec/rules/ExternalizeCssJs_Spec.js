describe("Rules => ExternalizeCssJs.js", function () {

    let rule;
    beforeEach(function () {
        rule = createExternalizeCssJsRule();
    });

    it(" 0 inline css or js  , it should return A", function () {
        const measures = { inlineStyleSheetsNumber: 0 , inlineJsScriptsNumber:0  };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('A');
    });

    it(" 2 inline css or js , it should return A", function () {
        const measures = { inlineStyleSheetsNumber: 2 , inlineJsScriptsNumber:0  };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('A');
    });

    it(" 3 inline css or js , it should return C", function () {
        const measures = { inlineStyleSheetsNumber: 2 , inlineJsScriptsNumber:1  };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('C');
    });

    it(" 5 inline js or css , it should return C", function () {
        const measures = { inlineStyleSheetsNumber: 2 , inlineJsScriptsNumber:3  };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('C');
    });

});



