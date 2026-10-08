import { beforeEach, describe, expect, it } from "vitest";
import { RulesManager } from "@/entrypoints/devtools-panel/script/rulesManager";

describe("Rules => PrintStyleSheet.js", () => {
  let rulesManager;
  beforeEach(() => {
    rulesManager = new RulesManager();
    rulesManager.registerRules();
  });

  it(" 0 print stylesheet, it should return C", () => {
    const rulesChecker = rulesManager.getNewRulesChecker();
    const measures = { printStyleSheetsNumber: 0 };
    const rule = rulesChecker.getRule("PrintStyleSheet");
    rule.check(measures);
    expect(rule.complianceLevel).toEqual("C");
  });

  it(" 1 print stylesheet, it should return A", () => {
    const rulesChecker = rulesManager.getNewRulesChecker();
    const measures = { printStyleSheetsNumber: 1 };
    const rule = rulesChecker.getRule("PrintStyleSheet");
    rule.check(measures);
    expect(rule.complianceLevel).toEqual("A");
  });
});
