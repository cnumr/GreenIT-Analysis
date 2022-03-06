describe("Rules => MinifiedCss.js", function () {

  let rule;
  beforeEach(function () {
    rule = createMinifiedCssRule();
  });


  it(" resource is not css, it should return A", function () {
    let content = "";
    for (let i = 0; i < 100; i++) {
      content += "let t=2;\n  ";
    }
    const resourceContent = {
      type: "script",
      url: "test.js",
      content: window.btoa(content)
    };
    rule.check("", resourceContent);
    expect(rule.complianceLevel).toEqual('A');
  });


  it(" 100% css minified, it should return A", function () {
    let content = "";
    for (let i = 0; i < 100; i++) {
      content += "style:test;";
    }
    const resourceContent = {
      type: "stylesheet",
      url: "test.css",
      content: window.btoa(content)
    };
    rule.check("", resourceContent);
    expect(rule.complianceLevel).toEqual('A');
  });

  it(" >95% css minified, it should return A", function () {
    let content = "";
    for (let i = 0; i < 120; i++) {
      content += "style:test;";
    }
    let resourceContent = {
      type: "stylesheet",
      url: "test.css",
      content: content
    };
    rule.check("", resourceContent);

    content = "";
    for (let i = 0; i < 4; i++) {
      content += "style:test;\n  ";
    }
    resourceContent = {
      type: "stylesheet",
      url: "test.css",
      content: content
    };
    rule.check("", resourceContent);

    expect(rule.complianceLevel).toEqual('A');
  });


  it(" 91% css Minified , it should return B", function () {

    let content = "";
    for (let i = 0; i < 91; i++) {
      content += "style:test;";
    }
    let resourceContent = {
      type: "stylesheet",
      url: "test.css",
      content: content
    };
    rule.check("", resourceContent);

    content = "";
    for (let i = 0; i < 9; i++) {
      content += "style:t;\n  ";
    }
    resourceContent = {
      type: "stylesheet",
      url: "test.css",
      content: content
    };
    rule.check("", resourceContent);

    content = "";
    for (let i = 0; i < 100; i++) {
      content += "let t=1;\n  ";
    }
    resourceContent = {
      type: "script",
      url: "test.js",
      content: content
    };
    rule.check("", resourceContent);

    expect(rule.complianceLevel).toEqual('B');
  });

  it(" 94% css minified , it should return B", function () {
    let content = "";
    for (let i = 0; i < 94; i++) {
      content += "style:test;";
    }
    let resourceContent = {
      type: "stylesheet",
      url: "test.css",
      content: content
    };
    rule.check("", resourceContent);

    content = "";
    for (let i = 0; i < 3; i++) {
      content += "style:t;\n  ";
    }
    resourceContent = {
      type: "stylesheet",
      url: "test.css",
      content: content
    };
    rule.check("", resourceContent);

    content = "";
    for (let i = 0; i < 3; i++) {
      content += "style:t;\n  ";
    }
    resourceContent = {
      type: "stylesheet",
      url: "test.css",
      content: content
    };
    rule.check("", resourceContent);

    expect(rule.complianceLevel).toEqual('B');
  });


  it(" 88% css minified , it should return C", function () {

    let content = "";
    for (let i = 0; i < 88; i++) {
      content += "style:test;";
    }
    let resourceContent = {
      type: "stylesheet",
      url: "test.css",
      content: content
    };
    rule.check("", resourceContent);

    content = "";
    for (let i = 0; i < 12; i++) {
      content += "style:t;\n  ";
    }
    resourceContent = {
      type: "stylesheet",
      url: "test.css",
      content: content
    };
    rule.check("", resourceContent);

    expect(rule.complianceLevel).toEqual('C');
  });


  afterEach(function () {
  });
});



