import { beforeEach, describe, expect, it } from "vitest";
import { createOptimizeSvgRule } from "@/entrypoints/devtools-panel/script/rules/OptimizeSvg";

describe("Rules => OptimizeSvg.js", () => {
  let rule;
  beforeEach(() => {
    rule = createOptimizeSvgRule();
  });

  it(" no svg image , it should return A", () => {
    const resourceContent = {
      type: "script",
      url: "test",
    };
    rule.check("", resourceContent);
    expect(rule.complianceLevel).toEqual("A");
  });

  it(" 1 svg image not optimized , total < 20Kb , it should return B", () => {
    let content = "";
    for (let i = 0; i < 100; i++) {
      content += "      <tag></tag>";
    }
    const resourceContent = {
      type: "image",
      url: "test.svg",
      content: btoa(content),
    };
    rule.check("", resourceContent);
    expect(rule.complianceLevel).toEqual("B");
  });

  it(" 1 svg image not optimized , total > 20Kb , it should return C", () => {
    let content = "";
    for (let i = 0; i < 2000; i++) {
      content += "      <tag></tag>";
    }
    const resourceContent = {
      type: "image",
      url: "test.svg",
      content: btoa(content),
    };

    rule.check("", resourceContent);
    expect(rule.complianceLevel).toEqual("C");
  });

  it(" 2 svg image  , total < 20Kb , it should return B", () => {
    let content = "";
    for (let i = 0; i < 100; i++) {
      content += "      <tag></tag>";
    }
    const resourceContent = {
      type: "image",
      url: "test.svg",
      content: btoa(content),
    };
    rule.check("", resourceContent);
    rule.check("", resourceContent);
    expect(rule.complianceLevel).toEqual("B");
  });

  it(" 2 svg image  , total > 20Kb , it should return C", () => {
    let content = "";
    for (let i = 0; i < 1000; i++) {
      content += "      <tag></tag>";
    }
    const resourceContent = {
      type: "image",
      url: "test.svg",
      content: btoa(content),
    };
    rule.check("", resourceContent);
    rule.check("", resourceContent);
    expect(rule.complianceLevel).toEqual("C");
  });
});
