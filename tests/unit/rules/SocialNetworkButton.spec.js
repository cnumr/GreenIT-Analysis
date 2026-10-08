import { beforeEach, describe, expect, it } from "vitest";
import { createSocialNetworkButtonRule } from "@/entrypoints/devtools-panel/script/rules/SocialNetworkButton";

describe("Rules => SocialNetworkButton.js", () => {
  let rule;
  beforeEach(() => {
    rule = createSocialNetworkButtonRule();
  });

  it(" 1 url 0 social network script, it should return A", () => {
    const measures = {
      entries: [
        {
          request: { url: "test" },
          response: {
            status: 200,
            statusText: "",
            httpVersion: "http/2.0",
            headers: [
              { name: "content-encoding", value: "gzip" },
              { name: "content-type", value: "text/json" },
            ],
          },
        },
      ],
    };
    rule.check(measures);
    expect(rule.complianceLevel).toEqual("A");
  });

  it(" 3 url 0 social network script, it should return  A", () => {
    const measures = {
      entries: [
        {
          request: { url: "www.acebook.com/test.js" },
          response: {
            status: 200,
            statusText: "",
            httpVersion: "http/2.0",
            headers: [
              { name: "content-encoding", value: "gzip" },
              { name: "content-type", value: "text/css" },
            ],
          },
        },
        {
          request: { url: "http://www.gooel.fr/test2.js" },
          response: {
            status: 200,
            statusText: "",
            httpVersion: "http/2.0",
            headers: [
              { name: "content-encoding", value: "gzip" },
              { name: "content-type", value: "text/css" },
            ],
          },
        },
        {
          request: { url: "test3" },
          response: {
            status: 200,
            statusText: "",
            httpVersion: "http/2.0",
            headers: [
              { name: "content-encoding", value: "gzip" },
              { name: "content-type", value: "text/html" },
            ],
          },
        },
      ],
    };
    rule.check(measures);
    expect(rule.complianceLevel).toEqual("A");
  });

  it(" 3 url , a facebook social network script, it should return  C", () => {
    const measures = {
      entries: [
        {
          request: { url: "www.acebook.com/test.js" },
          response: {
            status: 200,
            statusText: "",
            httpVersion: "http/2.0",
            headers: [
              { name: "content-encoding", value: "gzip" },
              { name: "content-type", value: "text/css" },
            ],
          },
        },
        {
          request: { url: "connect.facebook.net/sdk.js" },
          response: {
            status: 200,
            statusText: "",
            httpVersion: "http/2.0",
            headers: [
              { name: "content-encoding", value: "gzip" },
              { name: "content-type", value: "text/css" },
            ],
          },
        },
        {
          request: { url: "test3" },
          response: {
            status: 200,
            statusText: "",
            httpVersion: "http/2.0",
            headers: [
              { name: "content-encoding", value: "gzip" },
              { name: "content-type", value: "text/html" },
            ],
          },
        },
      ],
    };
    rule.check(measures);
    expect(rule.complianceLevel).toEqual("C");
  });

  it(" 3 url , a linkedin social network script, it should return  C", () => {
    const measures = {
      entries: [
        {
          request: { url: "www.acebook.com/test.js" },
          response: {
            status: 200,
            statusText: "",
            httpVersion: "http/2.0",
            headers: [
              { name: "content-encoding", value: "gzip" },
              { name: "content-type", value: "text/css" },
            ],
          },
        },
        {
          request: { url: "platform.linkedin.com/in.js" },
          response: {
            status: 200,
            statusText: "",
            httpVersion: "http/2.0",
            headers: [
              { name: "content-encoding", value: "gzip" },
              { name: "content-type", value: "text/css" },
            ],
          },
        },
        {
          request: { url: "test3" },
          response: {
            status: 200,
            statusText: "",
            httpVersion: "http/2.0",
            headers: [
              { name: "content-encoding", value: "gzip" },
              { name: "content-type", value: "text/html" },
            ],
          },
        },
      ],
    };
    rule.check(measures);
    expect(rule.complianceLevel).toEqual("C");
  });

  it(" 3 url , 2 social network scripts, it should return  C", () => {
    const measures = {
      entries: [
        {
          request: { url: "platform.twitter.com/widgets.js" },
          response: {
            status: 200,
            statusText: "",
            httpVersion: "http/2.0",
            headers: [
              { name: "content-encoding", value: "gzip" },
              { name: "content-type", value: "text/css" },
            ],
          },
        },
        {
          request: { url: "platform.linkedin.com/in.js" },
          response: {
            status: 200,
            statusText: "",
            httpVersion: "http/2.0",
            headers: [
              { name: "content-encoding", value: "gzip" },
              { name: "content-type", value: "text/css" },
            ],
          },
        },
        {
          request: { url: "test3" },
          response: {
            status: 200,
            statusText: "",
            httpVersion: "http/2.0",
            headers: [
              { name: "content-encoding", value: "gzip" },
              { name: "content-type", value: "text/html" },
            ],
          },
        },
      ],
    };
    rule.check(measures);
    expect(rule.complianceLevel).toEqual("C");
  });
});
