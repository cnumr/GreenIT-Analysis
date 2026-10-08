import { beforeEach, describe, expect, it } from "vitest";
import { createAddExpiresOrCacheControlHeadersRule } from "@/entrypoints/devtools-panel/script/rules/AddExpiresOrCacheControlHeaders";

describe("Rules => AddExpiresOrCacheControlHeadersRule.js", () => {
  let rule;
  beforeEach(() => {
    rule = createAddExpiresOrCacheControlHeadersRule();
  });

  it(" 1 static ressources with cache header, it should return A", () => {
    const measures = {
      entries: [
        {
          request: { url: "test" },
          response: {
            content: { size: 100 },
            status: 200,
            statusText: "",
            httpVersion: "http/2.0",
            headers: [
              { name: "Cache-Control", value: "test" },
              { name: "Expires", value: "Mon, 05 Jan 2099 18:09:48 GMT" },
              { name: "content-type", value: "text/css" },
            ],
          },
        },
      ],
    };
    rule.check(measures);
    expect(rule.complianceLevel).toEqual("A");
  });

  it(" 1 static ressources with no cache header, it should return C", () => {
    const measures = {
      entries: [
        {
          request: { url: "test" },
          response: {
            content: { size: 100 },
            status: 200,
            statusText: "",
            httpVersion: "http/2.0",
            headers: [{ name: "content-type", value: "text/css" }],
          },
        },
      ],
    };
    rule.check(measures);
    expect(rule.complianceLevel).toEqual("C");
  });

  it(" 2 static ressources with no cache header, it should return C", () => {
    const measures = {
      entries: [
        {
          request: { url: "test" },
          response: {
            content: { size: 100 },
            status: 200,
            statusText: "",
            httpVersion: "http/2.0",
            headers: [{ name: "content-type", value: "text/css" }],
          },
        },
        {
          request: { url: "test2" },
          response: {
            content: { size: 100 },
            status: 200,
            statusText: "",
            httpVersion: "http/2.0",
            headers: [{ name: "content-type", value: "text/css" }],
          },
        },
      ],
    };
    rule.check(measures);
    expect(rule.complianceLevel).toEqual("C");
  });

  it(" 3 static ressources with cache header, it should return A", () => {
    const measures = {
      entries: [
        {
          request: { url: "test" },
          response: {
            content: { size: 100 },
            status: 200,
            statusText: "",
            httpVersion: "http/2.0",
            headers: [
              { name: "Cache-Control", value: "test" },
              { name: "Expires", value: "Mon, 05 Jan 2099 18:09:48 GMT" },
              { name: "content-type", value: "text/css" },
            ],
          },
        },
        {
          request: { url: "test2" },
          response: {
            content: { size: 100 },
            status: 200,
            statusText: "",
            httpVersion: "http/2.0",
            headers: [
              { name: "Cache-Control", value: "test" },
              { name: "Expires", value: "Mon, 05 Jan 2099 18:09:48 GMT" },
              { name: "content-type", value: "text/css" },
            ],
          },
        },
        {
          request: { url: "test3" },
          response: {
            content: { size: 100 },
            status: 200,
            statusText: "",
            httpVersion: "http/2.0",
            headers: [
              { name: "Cache-Control", value: "test" },
              { name: "Expires", value: "Mon, 05 Jan 2099 18:09:48 GMT" },
              { name: "content-type", value: "text/css" },
            ],
          },
        },
      ],
    };
    rule.check(measures);
    expect(rule.complianceLevel).toEqual("A");
  });

  it(" 3 static ressources with  2 cache header, it should return C", () => {
    const measures = {
      entries: [
        {
          request: { url: "test" },
          response: {
            content: { size: 90 },
            status: 200,
            statusText: "",
            httpVersion: "http/2.0",
            headers: [{ name: "content-type", value: "text/css" }],
          },
        },
        {
          request: { url: "test2" },
          response: {
            content: { size: 110 },
            status: 200,
            statusText: "",
            httpVersion: "http/2.0",
            headers: [
              { name: "Cache-Control", value: "test" },
              { name: "Expires", value: "Mon, 05 Jan 2099 18:09:48 GMT" },
              { name: "content-type", value: "text/css" },
            ],
          },
        },
        {
          request: { url: "test3" },
          response: {
            content: { size: 800 },
            status: 200,
            statusText: "",
            httpVersion: "http/2.0",
            headers: [
              { name: "Cache-Control", value: "test" },
              { name: "Expires", value: "Mon, 05 Jan 2099 18:09:48 GMT" },
              { name: "content-type", value: "text/css" },
            ],
          },
        },
      ],
    };
    rule.check(measures);
    expect(rule.complianceLevel).toEqual("C");
  });
});
