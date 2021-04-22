rulesManager.registerRule(createSocialNetworkButtonRule(), "harReceived");

function createSocialNetworkButtonRule() {
    return {
        complianceLevel: 'A',
        id: "SocialNetworkButton",
        comment: chrome.i18n.getMessage("rule_SocialNetworkButton_DefaultComment"),
        detailComment: "",
        specificMeasures: {
            nbSocialNetworkButton: 0,
            socialNetworks: []
        },

        check: function (measures) {
            this.specificMeasures.nbSocialNetworkButton = 0;
            this.specificMeasures.socialNetworks = [];
            if (measures.entries.length) measures.entries.forEach(entry => {
                const officalSocialButton = getOfficialSocialButtonFormUrl(entry.request.url);
                if (officalSocialButton.length > 0) {
                    if (this.specificMeasures.socialNetworks.indexOf(officalSocialButton) === -1) {
                        this.specificMeasures.socialNetworks.push(officalSocialButton);
                        this.detailComment += chrome.i18n.getMessage("rule_SocialNetworkButton_detailComment", officalSocialButton) + "<br>";
                        this.specificMeasures.nbSocialNetworkButton++;
                    }
                }
            });
            if (this.specificMeasures.nbSocialNetworkButton > 0) {
                this.complianceLevel = 'C';
                this.comment = chrome.i18n.getMessage("rule_SocialNetworkButton_Comment", String(this.specificMeasures.nbSocialNetworkButton));
            }
        },

        getSpecificMeasures: function () {
            return this.specificMeasures;
        }
    }
}