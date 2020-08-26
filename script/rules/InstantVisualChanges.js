rulesManager.registerRule({
    complianceLevel: 'A',
    id: "InstantVisualChanges",
    comment: chrome.i18n.getMessage("rule_InstantVisualChanges_DefaultComment"),
    detailComment: "",
  
    check: function (measures) {
      if (measures.instantVisualChanges > 0) {
        this.complianceLevel = 'C';
        this.comment = chrome.i18n.getMessage("rule_InstantVisualChanges_Comment", String(measures.instantVisualChanges));
      }
    }
  }, "frameMeasuresReceived");  