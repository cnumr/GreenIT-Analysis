rulesManager.registerRule({
    complianceLevel: 'A',
    id: "EmptySrcTag",
    comment: "",
    detailComment: "",

    check: function (measures) {
        if (measures.emptySrcTagNumber > 0) {
            this.complianceLevel = 'C';
            this.comment = chrome.i18n.getMessage("rule_EmptySrcTag_Comment", String(measures.emptySrcTagNumber));
        }
    }
}, "frameMeasuresReceived");