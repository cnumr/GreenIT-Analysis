rulesManager.registerRule({
    complianceLevel: 'A',
    id: "StyleSheets",
    comment: "",
    detailComment: "",
  
    check: function (measures) {
      let styleSheets = [];
      if (measures.entries.length) measures.entries.forEach(entry => {
        if (getResponseHeaderFromResource(entry, "content-type").toLowerCase().includes('text/css')) {
          if (styleSheets.indexOf(entry.request.url) === -1) {
            styleSheets.push(entry.request.url);
            this.detailComment += entry.request.url + "<br>";
          }
        }
      });
      if (styleSheets.length > 2) {
        if (styleSheets.length === 3) this.complianceLevel = 'B';
        else this.complianceLevel = 'C';
        this.comment = chrome.i18n.getMessage("rule_StyleSheets_Comment", String(styleSheets.length));
      }
    }
  }, "harReceived");