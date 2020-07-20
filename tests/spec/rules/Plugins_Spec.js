describe("Rules => Plugins.js", function () {

    let rule;
    beforeEach(function () {
        rule = createPluginsRule();
    });

    it(" 0 plugin, it should return A", function () {
        const measures = { pluginsNumber: 0 };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('A');
    });


    it(" 1 plugin, it should return C", function () {
        const measures = { pluginsNumber: 1 };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('C');
    });

    it(" 5 plugins, it should return C", function () {
        const measures = { pluginsNumber: 5 };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('C');
    });


    afterEach(function () {
    });
});



