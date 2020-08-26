rulesManager.registerRule({
    complianceLevel: 'A',
    id: "Flash",
    comment: chrome.i18n.getMessage("rule_Flash_DefaultComment"),
    detailComment: "",
    check: function (measures) {
        if (measures.flashNumber > 0 )
        {
            this.complianceLevel = 'C';
            this.comment = chrome.i18n.getMessage("rule_Flash_Comment", String(measures.flashNumber));
        }
    }
}, "frameMeasuresReceived");
