rulesManager.registerRule({
    complianceLevel: 'A',
    id: "CompressCSS",
    comment: chrome.i18n.getMessage("rule_CompressCSS_DefaultComment"),
    detailComment: "",

    check: function (measures) {
    if (measures.compressCSS == 0) {
        this.complianceLevel = 'C';
        this.comment = chrome.i18n.getMessage("rule_CompressCSS_Comment", String(measures.compressCSS));
    }
}
}, "frameMeasuresReceived");
