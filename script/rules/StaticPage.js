rulesManager.registerRule({
    complianceLevel: 'A',
    id: "PromoteStaticPage",
    comment: chrome.i18n.getMessage("rule_PromoteStaticPage_DefaultComment"),
    detailComment: "",
  
    check: function (measures) {
      if (measures.ajaxMethodNumber > 0) {
        this.complianceLevel = 'C';
        this.comment = chrome.i18n.getMessage("rule_PromoteStaticPage_Comment", String(measures.ajaxMethodNumber));
      }
    }
  }, "frameMeasuresReceived");