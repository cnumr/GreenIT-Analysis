rulesManager.registerRule({
    complianceLevel: 'A',
    id: "IncrementOperator",
    comment: chrome.i18n.getMessage("rule_IncrementOperator_DefaultComment"),
    detailComment: "",

    check: function (measures) {
        if (measures.incrementOperatorNumber > 0) {
            this.complianceLevel = 'C';
            this.comment = chrome.i18n.getMessage("rule_IncrementOperator_Comment", String(measures.incrementOperatorNumber));
        }
    }
}, "frameMeasuresReceived");
