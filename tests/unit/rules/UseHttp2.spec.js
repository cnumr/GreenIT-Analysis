import { beforeEach, describe, expect, it } from "vitest";
import { createUseHttp2Rule } from "@/entrypoints/devtools-panel/script/rules/UseHttp2";

describe("Rules => UseHttp2Rule.js", () => {
  let rule;
  beforeEach(() => {
    rule = createUseHttp2Rule();
  });

  it(" 2 http requests with one HTTP/2.0 and one  HTTP/3.0 , it should return A", () => {
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
            httpVersion: "http/3.0",
            headers: [{ name: "content-encoding", value: "gzip" }],
          },
        },
      ],
    };
    rule.check(measures);
    expect(rule.complianceLevel).toEqual("A");
  });

  it(" 2 http requests with one http/1.1, it should return C", () => {
    const measures = {
      entries: [
        {
          request: { url: "test" },
          response: {
            status: 404,
            statusText: "",
            httpVersion: "http/1.1",
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

  it(" 2 http requests with one http/1.0 it should return C", () => {
    const measures = {
      entries: [
        {
          request: { url: "test" },
          response: {
            status: 500,
            statusText: "",
            httpVersion: "HTTP/1.0",
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
