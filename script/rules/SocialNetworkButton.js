rulesManager.registerRule({
    complianceLevel: 'A',
    id: "SocialNetworkButton",
    comment: chrome.i18n.getMessage("rule_SocialNetworkButton_DefaultComment"),
    detailComment: "",

    check: function (measures) {
        let nbSocialNetworkButton = 0;
        if (measures.entries.length) measures.entries.forEach(entry => {
            const officalSocialButton = getOfficialSocialButtonFormUrl(entry.request.url);
            if (officalSocialButton.length > 0) {
                this.detailComment += officalSocialButton + "<br>";
                nbSocialNetworkButton++;
            }
        });
        if (nbSocialNetworkButton > 0) 
        {
            this.complianceLevel = 'C';
            this.comment = chrome.i18n.getMessage("rule_SocialNetworkButton_Comment", String(nbSocialNetworkButton));
        }
    }
}, "harReceived");