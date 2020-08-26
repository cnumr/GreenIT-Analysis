rulesManager.registerRule({
    complianceLevel: 'A',
    id: "GetMethod",
    comment: chrome.i18n.getMessage("rule_GetMethod_DefaultComment"),
    detailComment: "",
  
    check: function (measures) {
        
      if (measures.getMethodNumber > 0) {
        this.complianceLevel = 'C';
        this.comment = chrome.i18n.getMessage("rule_GetMethod_Comment", String(measures.getMethodNumber));
      }
    }
  }, "frameMeasuresReceived");