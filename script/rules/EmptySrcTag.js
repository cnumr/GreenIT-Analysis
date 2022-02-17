rulesManager.registerRule(createEmptySrcTagRule(), "frameMeasuresReceived");

function createEmptySrcTagRule() {
  return {
    complianceLevel: 'A',
    id: "EmptySrcTag",
    comment: chrome.i18n.getMessage("rule_EmptySrcTag_DefaultComment"),
    detailComment: "",
    specificMeasures: {
      emptySrcTagNumber: 0
    },

    check: function (measures) {
      this.specificMeasures.emptySrcTagNumber = measures.emptySrcTagNumber;
      if (this.specificMeasures.emptySrcTagNumber > 0) {
        this.complianceLevel = 'C';
        this.comment = chrome.i18n.getMessage("rule_EmptySrcTag_Comment", String(this.specificMeasures.emptySrcTagNumber));
      }
    },

    getSpecificMeasures: function () {
      return this.specificMeasures;
    }
  };
}
