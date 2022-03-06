describe("Rules => StyleSheets.js", function () {

  let rule;
  beforeEach(function () {
    rule = createStyleSheetsRule();
  });

  it(" 0 stylesheet, it should return A", function () {
    const measures = {
      entries:
          [{
            request: {url: "test"},
            response:
                {
                  status: 200, statusText: "", httpVersion: "http/2.0", headers:
                      [{name: "content-encoding", value: "gzip"},
                        {name: "content-type", value: "text/json"}]
                }
          }]
    };
    rule.check(measures);
    expect(rule.complianceLevel).toEqual('A');
  });

  it(" 2 stylesheet, it should return A", function () {
    const measures = {
      entries:
          [{
            request: {url: "test"},
            response:
                {
                  status: 200, statusText: "", httpVersion: "http/2.0", headers:
                      [{name: "content-encoding", value: "gzip"},
                        {name: "content-type", value: "text/css"}]
                }
          },
            {
              request: {url: "test2"},
              response:
                  {
                    status: 200, statusText: "", httpVersion: "http/2.0", headers:
                        [{name: "content-encoding", value: "gzip"},
                          {name: "content-type", value: "text/css"}]
                  }
            },
            {
              request: {url: "test3"},
              response:
                  {
                    status: 200, statusText: "", httpVersion: "http/2.0", headers:
                        [{name: "content-encoding", value: "gzip"},
                          {name: "content-type", value: "text/html"}]
                  }
            }]
    };
    rule.check(measures);
    expect(rule.complianceLevel).toEqual('A');
  });

  it(" 3 stylesheet, it should return B", function () {
    const measures = {
      entries:
          [{
            request: {url: "test"},
            response:
                {
                  status: 200, statusText: "", httpVersion: "http/2.0", headers:
                      [{name: "content-encoding", value: "gzip"},
                        {name: "content-type", value: "text/css"}]
                }
          },
            {
              request: {url: "test2"},
              response:
                  {
                    status: 200, statusText: "", httpVersion: "http/2.0", headers:
                        [{name: "content-encoding", value: "gzip"},
                          {name: "content-type", value: "text/css"}]
                  }
            },
            {
              request: {url: "test3"},
              response:
                  {
                    status: 200, statusText: "", httpVersion: "http/2.0", headers:
                        [{name: "content-encoding", value: "gzip"},
                          {name: "content-type", value: "text/css"}]
                  }
            }]
    };
    rule.check(measures);
    expect(rule.complianceLevel).toEqual('B');
  });

  it("  4 stylesheet, it should return C", function () {
    const measures = {
      entries:
          [{
            request: {url: "test"},
            response:
                {
                  status: 200, statusText: "", httpVersion: "http/2.0", headers:
                      [{name: "content-encoding", value: "gzip"},
                        {name: "content-type", value: "text/css"}]
                }
          },
            {
              request: {url: "test2"},
              response:
                  {
                    status: 200, statusText: "", httpVersion: "http/2.0", headers:
                        [{name: "content-encoding", value: "gzip"},
                          {name: "content-type", value: "text/css"}]
                  }
            },
            {
              request: {url: "test3"},
              response:
                  {
                    status: 200, statusText: "", httpVersion: "http/2.0", headers:
                        [{name: "content-encoding", value: "gzip"},
                          {name: "content-type", value: "text/css"}]
                  }
            },
            {
              request: {url: "test4"},
              response:
                  {
                    status: 200, statusText: "", httpVersion: "http/2.0", headers:
                        [{name: "content-encoding", value: "gzip"},
                          {name: "content-type", value: "text/css"}]
                  }
            }]
    };
    rule.check(measures);
    expect(rule.complianceLevel).toEqual('C');
  });


  afterEach(function () {
  });
});



