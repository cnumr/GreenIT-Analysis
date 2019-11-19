rulesManager.registerRule({
    complianceLevel: 'A',
    id: "ExternalizeJs",
    comment: chrome.i18n.getMessage("rule_ExternalizeJs_DefaultComment"),
    detailComment: "",

    check: function (measures) {
        if (measures.inlineJsScriptsNumber > 0) {
            if (measures.inlineJsScriptsNumber > 1) this.complianceLevel = 'C';
            this.comment = chrome.i18n.getMessage("rule_ExternalizeJs_Comment", String(measures.inlineJsScriptsNumber));

        }
    }
}, "frameMeasuresReceived");