rulesManager.registerRule({
    complianceLevel: 'A',
    id: "Plugins",
    comment: chrome.i18n.getMessage("rule_Plugins_DefaultComment"),
    detailComment: "",
  
    check: function (measures) {
      if (measures.pluginsNumber > 0) {
        this.complianceLevel = 'C';
        this.comment = chrome.i18n.getMessage("rule_Plugins_Comment", String(measures.pluginsNumber));
      }
    }
  }, "frameMeasuresReceived");