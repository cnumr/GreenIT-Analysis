rulesManager.registerRule({
    complianceLevel: 'C',
    id: "PrintStyleSheet",
    comment: "",
    detailComment: "",
  
    check: function (measures) {
      if (measures.printStyleSheetsNumber > 0) {
        this.complianceLevel = 'A';
        this.comment = chrome.i18n.getMessage("rule_PrintStyleSheet_Comment", String(measures.printStyleSheetsNumber));
      }
    }
  }, "frameMeasuresReceived");