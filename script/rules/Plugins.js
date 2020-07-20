rulesManager.registerRule(createPluginsRule(), "frameMeasuresReceived");

function createPluginsRule() {
    return {
        complianceLevel: 'A',
        id: "Plugins",
        comment: chrome.i18n.getMessage("rule_Plugins_DefaultComment"),
        detailComment: "",
        specificMeasures: {
            pluginsNumber: 0
        },

        check: function (measures) {
            this.specificMeasures.pluginsNumber = measures.pluginsNumber;
            if (this.specificMeasures.pluginsNumber > 0) {
                this.complianceLevel = 'C';
                this.comment = chrome.i18n.getMessage("rule_Plugins_Comment", String(this.specificMeasures.pluginsNumber));
            }
        },

        getSpecificMeasures: function () {
            return this.specificMeasures;
        }
    }
}