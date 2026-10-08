import { beforeEach, describe, expect, it } from "vitest";
import { createNoRedirectRule } from "@/entrypoints/devtools-panel/script/rules/NoRedirect";

describe("Rules => NoRedirect.js", () => {
  let rule;
  beforeEach(() => {
    rule = createNoRedirectRule();
  });

  it(" 0 redirect, it should return A", () => {
    const measures = {
      entries: [
        {
          request: { url: "test" },
          response: {
            status: 200,
            statusText: "",
            httpVersion: "http/2.0",
            headers: [{ name: "content-encoding", value: "gzip" }],
          },
        },
      ],
    };
    rule.check(measures);
    expect(rule.complianceLevel).toEqual("A");
  });

  it(" 1 redirect, it should return A", () => {
    const measures = {
      entries: [
        {
          request: { url: "test" },
          response: {
            status: 301,
            statusText: "",
            httpVersion: "http/2.0",
            headers: [{ name: "content-encoding", value: "gzip" }],
          },
        },
      ],
    };
    rule.check(measures);
    expect(rule.complianceLevel).toEqual("A");
  });

  it(" 2 redirect, it should return C", () => {
    const measures = {
      entries: [
        {
          request: { url: "test" },
          response: {
            status: 301,
            statusText: "",
            httpVersion: "http/2.0",
            headers: [{ name: "content-encoding", value: "gzip" }],
          },
        },
        {
          request: { url: "test2" },
          response: {
            status: 307,
            statusText: "",
            httpVersion: "http/2.0",
            headers: [{ name: "content-encoding", value: "gzip" }],
          },
        },
      ],
    };
    rule.check(measures);
    expect(rule.complianceLevel).toEqual("C");
  });
});
