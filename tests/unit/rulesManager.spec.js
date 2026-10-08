import { beforeEach, describe, expect, it } from "vitest";
import { RulesManager } from "@/entrypoints/devtools-panel/script/rulesManager";

describe("rulesManager.js", () => {
  let rulesChecker;

  beforeEach(() => {
    const rulesManager = new RulesManager();
    rulesManager.registerRules();

    rulesChecker = rulesManager.getNewRulesChecker();
  });

  it(" instanciate rule checker", () => {
    expect(rulesChecker).toBeDefined();
  });

  it(" finds specific rule by key", () => {
    const rule = rulesChecker.getRule("UseStandardTypefaces");
    expect(rule.id).toEqual("UseStandardTypefaces");
  });
});
