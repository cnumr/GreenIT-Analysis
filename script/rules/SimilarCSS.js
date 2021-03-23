rulesManager.registerRule({
    complianceLevel: 'A',
    id: "SimilarCSS",
    comment: chrome.i18n.getMessage("rule_SimilarCSS_DefaultComment"),
    detailComment: "",
    check: function (measures) {
        if (measures.similarCSSNumber > 0 )
        {
            this.complianceLevel = 'C';
            this.comment = chrome.i18n.getMessage("rule_SimilarCSS_Comment", String(measures.similarCSSNumber));
        }
    }
}, "frameMeasuresReceived");
