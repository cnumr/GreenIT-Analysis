rulesManager.registerRule({
    complianceLevel: 'A',
    id: "NoFunctionInFor",
    comment: chrome.i18n.getMessage("rule_NoFunctionInFor_DefaultComment"),
    detailComment: "",
  
    check: function (measures) {
      if (measures.functionInForNumber > 0) {
        this.complianceLevel = 'C';
        this.comment = chrome.i18n.getMessage("rule_NoFunctionInFor_Comment", String(measures.functionInForNumber));
      }
    }
  }, "frameMeasuresReceived");