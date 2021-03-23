rulesManager.registerRule({
    complianceLevel: 'A',
    id: "AbbreviatedCSS",
    comment: chrome.i18n.getMessage("rule_AbbreviatedCSS_DefaultComment"),
    detailComment: "",
    check: function (measures) {
        if (measures.abbreviatedCSSNumber > 0 )
        {
            this.complianceLevel = 'C';
            this.comment = chrome.i18n.getMessage("rule_AbbreviatedCSS_Comment", String(measures.abbreviatedCSSNumber));
        }
    }
}, "frameMeasuresReceived");