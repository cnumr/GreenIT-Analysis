rulesManager.registerRule({
    complianceLevel: 'C',
    id: "CSSPrint",
    comment: chrome.i18n.getMessage("rule_CSSPrint_DefaultComment"),
    detailComment: "",
  
    check: function (measures) {
      if (measures.cssPrintNumber > 0) {
        this.complianceLevel = 'A';
        this.comment = chrome.i18n.getMessage("rule_CSSPrint_Comment", String(measures.cssPrintNumber));
      }
    }
  }, "frameMeasuresReceived");