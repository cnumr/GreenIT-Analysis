rulesManager.registerRule({
    complianceLevel: 'A',
    id: "PrimitiveOperators",
    comment: chrome.i18n.getMessage("rule_PrimitiveOperators_DefaultComment"),
    detailComment: "",

    check: function (measures) {
        if (measures.nonPrimitiveOperatorNumber > 0) {
            this.complianceLevel = 'C';
            this.comment = chrome.i18n.getMessage("rule_PrimitiveOperators_Comment", String(measures.nonPrimitiveOperatorNumber));
        }
    }
}, "frameMeasuresReceived");
