rulesManager.registerRule({
    complianceLevel: 'A',
    id: "ExternalizeCss",
    comment: chrome.i18n.getMessage("rule_ExternalizeCss_DefaultComment"),
    detailComment: "",

    check: function (measures) {
        if (measures.inlineStyleSheetsNumber > 0) {
            this.complianceLevel = 'C';
            this.comment = chrome.i18n.getMessage("rule_ExternalizeCss_Comment", String(measures.inlineStyleSheetsNumber));
        }
    }
}, "frameMeasuresReceived");