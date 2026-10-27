import { createPrintStyleSheetRule } from "@/entrypoints/devtools-panel/script/rules/PrintStyleSheet";
import { RulesManager } from "@/entrypoints/devtools-panel/script/rulesManager";
import { beforeEach, describe, expect, it } from "vitest";

describe("Rules => PrintStyleSheet.js", function () {
    let rule;
    let rulesManager;
    beforeEach(function () {
        rulesManager = new RulesManager();
        rulesManager.registerRules();
        rule = createPrintStyleSheetRule();
    });

    it(" 0 print stylesheet, it should return C", function () {
        let rulesChecker = rulesManager.getNewRulesChecker();
        const measures = { printStyleSheetsNumber: 0 };
        let rule = rulesChecker.getRule("PrintStyleSheet");
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('C');
    });

    it(" 1 print stylesheet, it should return A", function () {
        let rulesChecker = rulesManager.getNewRulesChecker();
        const measures = { printStyleSheetsNumber: 1 };
        let rule = rulesChecker.getRule("PrintStyleSheet");
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('A');
    });
});
