import { beforeEach, describe, expect, it } from "vitest";
import { createHttpErrorRule } from "@/entrypoints/devtools-panel/script/rules/HttpError";

describe("Rules => HttpErrorRule.js", () => {
  let rule;
  beforeEach(() => {
    rule = createHttpErrorRule();
  });

  it(" 2 http requests with no error, it should return A", () => {
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

  it(" 2 http requests with one error, it should return C", () => {
    const measures = {
      entries: [
        {
          request: { url: "test" },
          response: {
            status: 404,
            statusText: "",
            httpVersion: "http/2.0",
            headers: [{ name: "content-encoding", value: "gzip" }],
          },
        },
        {
          request: { url: "test2" },
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
    expect(rule.complianceLevel).toEqual("C");
  });

  it(" 2 http requests with one error, it should return C", () => {
    const measures = {
      entries: [
        {
          request: { url: "test" },
          response: {
            status: 500,
            statusText: "",
            httpVersion: "http/2.0",
            headers: [{ name: "content-encoding", value: "gzip" }],
          },
        },
        {
          request: { url: "test2" },
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
    expect(rule.complianceLevel).toEqual("C");
  });
});
