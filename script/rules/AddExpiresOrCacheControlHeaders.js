rulesManager.registerRule(createAddExpiresOrCacheControlHeadersRule(), "harReceived");

function createAddExpiresOrCacheControlHeadersRule() {
  return {
    complianceLevel: 'A',
    id: "AddExpiresOrCacheControlHeaders",
    comment: "",
    detailComment: "",
    specificMeasures: {
      staticResourcesSize: 0,
      staticResourcesWithCache: 0
    },

    check: function (measures) {
      this.specificMeasures.staticResourcesSize = 0;
      this.specificMeasures.staticResourcesWithCache = 0;
      if (measures.entries.length) {
        measures.entries.forEach(entry => {
          if (isStaticRessource(entry)) {
            this.specificMeasures.staticResourcesSize += entry.response.content.size;
            if (hasValidCacheHeaders(entry)) {
              this.specificMeasures.staticResourcesWithCache += entry.response.content.size;
            }
            else {
              this.detailComment += chrome.i18n.getMessage("rule_AddExpiresOrCacheControlHeaders_DetailComment", `${entry.request.url} ${Math.round(entry.response.content.size / 100) / 10}`) + '<br>';
            }
          }
        });
      }

      if (this.specificMeasures.staticResourcesSize > 0) {
        const cacheHeaderRatio = this.specificMeasures.staticResourcesWithCache / this.specificMeasures.staticResourcesSize * 100;
        if (cacheHeaderRatio < 95) {
          if (cacheHeaderRatio < 90) {
            this.complianceLevel = 'C';
          }
          else {
            this.complianceLevel = 'B';
          }
        }
        else {
          this.complianceLevel = 'A';
        }
        this.comment = chrome.i18n.getMessage("rule_AddExpiresOrCacheControlHeaders_Comment",
            String(Math.round(cacheHeaderRatio * 10) / 10) + "%");
      }
    },

    getSpecificMeasures: function () {
      return this.specificMeasures;
    }
  }
}
