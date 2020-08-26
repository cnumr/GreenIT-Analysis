rulesManager.registerRule({
    complianceLevel: 'A',
    id: "CacheFavicon",
    comment: chrome.i18n.getMessage("rule_CacheFavicon_DefaultComment"),
    detailComment: "",
  
    check: function (measures) {
      if (measures.cacheFaviconNumber != 0) {
        this.complianceLevel = 'C';
        this.comment = chrome.i18n.getMessage("rule_CacheFavicon_Comment", String(measures.cacheFaviconNumber));
      }
    }
  }, "frameMeasuresReceived");