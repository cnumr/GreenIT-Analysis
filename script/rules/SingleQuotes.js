rulesManager.registerRule({
    complianceLevel: 'A',
    id: "SingleQuotes",
    comment: chrome.i18n.getMessage("rule_SingleQuotes_DefaultComment"),
    detailComment: "",

    check: function (measures) {
        if (measures.singleQuotesNumber > 0) {
            this.complianceLevel = 'C';
            this.comment = chrome.i18n.getMessage("rule_SingleQuotes_Comment", String(measures.singleQuotesNumber));
        }
    }
}, "frameMeasuresReceived");
