rulesManager.registerRule({
    complianceLevel: 'A',
    id: "ExpensiveAnimations",
    comment: chrome.i18n.getMessage("rule_ExpensiveAnimations_DefaultComment"),
    detailComment: "",

    check: function (measures) {
        if (measures.expensiveAnimations != 0) {
            this.complianceLevel = 'C';
            this.comment = chrome.i18n.getMessage("rule_ExpensiveAnimations_Comment", String(measures.expensiveAnimations));
        }
    }
}, "frameMeasuresReceived");