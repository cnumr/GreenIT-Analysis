rulesManager.registerRule({
    complianceLevel: 'A',
    id: "UseETags",
    comment: "",
    detailComment: "",
  
    check: function (measures) {
  
      let staticResourcesSize = 0;
      let staticResourcesWithETagsSize = 0;
  
      if (measures.entries.length) measures.entries.forEach(entry => {
        if (isStaticRessource(entry)) {
          staticResourcesSize += entry.response.content.size;
          if (isRessourceUsingETag(entry)) {
            staticResourcesWithETagsSize += entry.response.content.size;
          }
          else this.detailComment +=chrome.i18n.getMessage("rule_UseETags_DetailComment",`${entry.request.url} ${Math.round(entry.response.content.size / 100) / 10}`) + '<br>';
        }
      });
      if (staticResourcesSize > 0) {
        const eTagsRatio = staticResourcesWithETagsSize / staticResourcesSize * 100;
        if (eTagsRatio < 95) {
          if (eTagsRatio < 90) this.complianceLevel = 'C'
          else this.complianceLevel = 'B';
        }
        else this.complianceLevel = 'A';
        this.comment = chrome.i18n.getMessage("rule_UseETags_Comment",
          Math.round(eTagsRatio * 10) / 10 + "%");
      }
    }
  }, "harReceived");