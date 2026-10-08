import { beforeEach, describe, expect, it } from "vitest";
import { createMinifiedCssJsRule } from "@/entrypoints/devtools-panel/script/rules/MinifiedCssJs";

describe("Rules => MinifiedCssJs.js", () => {
  let rule;
  beforeEach(() => {
    rule = createMinifiedCssJsRule();
  });

  it(" resource is not css and not js , it should return A", () => {
    let content = "";
    for (let i = 0; i < 100; i++) {
      content += "let t=2;\n  ";
    }
    const resourceContent = {
      type: "image",
      url: "test.txt",
      content: content,
    };
    rule.check("", resourceContent);
    expect(rule.complianceLevel).toEqual("A");
  });

  it(" all css or js minified, it should return A", () => {
    let content = "";
    for (let i = 0; i < 100; i++) {
      content += "style:test;";
    }
    let resourceContent = {
      type: "stylesheet",
      url: "test.css",
      content: content,
    };
    for (let i = 0; i < 50; i++) {
      content += "var test=2;";
    }
    resourceContent = {
      type: "script",
      url: "test.js",
      content: content,
    };
    rule.check("", resourceContent);

    content = "";
    for (let i = 0; i < 50; i++) {
      content += "var test=3;";
    }
    resourceContent = {
      type: "script",
      url: "test.js",
      content: content,
    };
    rule.check("", resourceContent);
    rule.check("", resourceContent);
    expect(rule.complianceLevel).toEqual("A");
  });

  it("  1 js is not  minified, it should return C", () => {
    let content = "";
    for (let i = 0; i < 50; i++) {
      content += "var test=2;";
    }
    let resourceContent = {
      type: "script",
      url: "test.js",
      content: content,
    };
    rule.check("", resourceContent);

    content = "";
    for (let i = 0; i < 4; i++) {
      content += "var t=3;\n  ";
    }
    resourceContent = {
      type: "script",
      url: "test.js",
      content: content,
    };
    rule.check("", resourceContent);

    expect(rule.complianceLevel).toEqual("C");
  });

  it(" 1 css in not minified, it should return C", () => {
    let content = "";
    for (let i = 0; i < 120; i++) {
      content += "style:test;";
    }
    let resourceContent = {
      type: "stylesheet",
      url: "test.css",
      content: content,
    };
    rule.check("", resourceContent);

    content = "";
    for (let i = 0; i < 4; i++) {
      content += "style:test;\n  ";
    }
    resourceContent = {
      type: "stylesheet",
      url: "test.css",
      content: content,
    };
    rule.check("", resourceContent);

    expect(rule.complianceLevel).toEqual("C");
  });
});
