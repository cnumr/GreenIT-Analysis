import { beforeEach, describe, expect, it } from "vitest";
import { createHttpRequestsRule } from "@/entrypoints/devtools-panel/script/rules/HttpRequests";

describe("Rules => HttpRequests.js", () => {
  let rule;
  beforeEach(() => {
    rule = createHttpRequestsRule();
  });

  it(" 5 http requests, it should return A", () => {
    const measures = { nbRequest: 5, entries: [] };
    rule.check(measures);
    expect(rule.complianceLevel).toEqual("A");
  });

  it(" 26 http requests, it should return A", () => {
    const measures = { nbRequest: 26, entries: [] };
    rule.check(measures);
    expect(rule.complianceLevel).toEqual("A");
  });

  it(" 41 http requests, it should return C", () => {
    const measures = { nbRequest: 41, entries: [] };
    rule.check(measures);
    expect(rule.complianceLevel).toEqual("C");
  });
});
