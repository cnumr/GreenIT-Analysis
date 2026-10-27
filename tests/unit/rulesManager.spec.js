import { RulesManager } from "@/entrypoints/devtools-panel/script/rulesManager";
import { beforeEach, describe, expect, it } from "vitest";

describe("rulesManager.js", function () {
  let rulesChecker;

  beforeEach(function () {
    const rulesManager = new RulesManager();
    rulesManager.registerRules();

    rulesChecker = rulesManager.getNewRulesChecker();
  });

  it(" instanciate rule checker", function () {
    expect(rulesChecker).toBeDefined();
  });

  it(" finds specific rule by key", function () {
    let rule = rulesChecker.getRule("UseStandardTypefaces");
    expect(rule.id).toEqual('UseStandardTypefaces');
  });
});
