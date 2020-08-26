rulesManager.registerRule({
    complianceLevel: 'A',
    id: "AvoidForInLoop",
    comment: chrome.i18n.getMessage("rule_AvoidForInLoop_DefaultComment"),
    detailComment: "",
  
    check: function (measures) {
      if (measures.forInLoopNumber > 0) {
        this.complianceLevel = 'C';
        this.comment = chrome.i18n.getMessage("rule_AvoidForInLoop_Comment", String(measures.forInLoopNumber));
      }
    }
  }, "frameMeasuresReceived");