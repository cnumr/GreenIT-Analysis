describe("Rules => MinifiedJs.js", function () {

  let rule;
  beforeEach(function () {
    rule = createMinifiedJsRule();
  });

  it(" ressources are not js, it should return A", function () {
    let content = "";
    for (let i = 0; i < 50; i++) {
      content += "var test=2;\n  ";
    }
    let resourceContent = {
      type: "stylesheet",
      url: "test.css",
      content: content
    };
    rule.check("", resourceContent);

    content = "";
    for (let i = 0; i < 50; i++) {
      content += "var test=3;";
    }
    resourceContent = {
      type: "stylesheet",
      url: "test.css",
      content: content
    };
    rule.check("", resourceContent);
    expect(rule.complianceLevel).toEqual('A');
  });


  it(" 100% is  minified, it should return A", function () {
    let content = "";
    for (let i = 0; i < 50; i++) {
      content += "var test=2;";
    }
    let resourceContent = {
      type: "script",
      url: "test.js",
      content: content
    };
    rule.check("", resourceContent);

    content = "";
    for (let i = 0; i < 50; i++) {
      content += "var test=3;";
    }
    resourceContent = {
      type: "script",
      url: "test.js",
      content: content
    };
    rule.check("", resourceContent);

    content = "";
    for (let i = 0; i < 50; i++) {
      content += "var test=3; \n   ";
    }
    resourceContent = {
      type: "stylesheet",
      url: "test.css",
      content: content
    };
    rule.check("", resourceContent);

    expect(rule.complianceLevel).toEqual('A');
  });

  it(" 96% is minified, it should return A", function () {
    let content = "";
    for (let i = 0; i < 96; i++) {
      content += "var test=2;";
    }
    let resourceContent = {
      type: "script",
      url: "test.js",
      content: content
    };
    rule.check("", resourceContent);

    content = "";
    for (let i = 0; i < 4; i++) {
      content += "var t=3;\n  ";
    }
    resourceContent = {
      type: "script",
      url: "test.js",
      content: content
    };
    rule.check("", resourceContent);
    expect(rule.complianceLevel).toEqual('A');
  });

  it(" 92% is minified, it should return B", function () {
    let content = "";
    for (let i = 0; i < 92; i++) {
      content += "var test=2;";
    }
    let resourceContent = {
      type: "script",
      url: "test.js",
      content: content
    };
    rule.check("", resourceContent);

    content = "";
    for (let i = 0; i < 8; i++) {
      content += "var t=3;\n  ";
    }
    resourceContent = {
      type: "script",
      url: "test.js",
      content: content
    };
    rule.check("", resourceContent);
    expect(rule.complianceLevel).toEqual('B');
  });

  it(" 88% is minified, it should return C", function () {
    let content = "";
    for (let i = 0; i < 88; i++) {
      content += "var test=2;";
    }
    let resourceContent = {
      type: "script",
      url: "test.js",
      content: content
    };
    rule.check("", resourceContent);

    content = "";
    for (let i = 0; i < 12; i++) {
      content += "var t=3;\n  ";
    }
    resourceContent = {
      type: "script",
      url: "test.js",
      content: content
    };
    rule.check("", resourceContent);
    expect(rule.complianceLevel).toEqual('C');
  });

  afterEach(function () {
  });
});



