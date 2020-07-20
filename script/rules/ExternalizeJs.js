rulesManager.registerRule(createExternalizeJsRule(), "frameMeasuresReceived");

function createExternalizeJsRule() {
    return {
        complianceLevel: 'A',
        id: "ExternalizeJs",
        comment: chrome.i18n.getMessage("rule_ExternalizeJs_DefaultComment"),
        detailComment: "",
        specificMeasures: {
            inlineJsScriptsNumber: 0
        },

        check: function (measures) {
            this.specificMeasures.inlineJsScriptsNumber = measures.inlineJsScriptsNumber;
            if (this.specificMeasures.inlineJsScriptsNumber > 0) {
                if (this.specificMeasures.inlineJsScriptsNumber > 1) this.complianceLevel = 'C';
                this.comment = chrome.i18n.getMessage("rule_ExternalizeJs_Comment", String(this.specificMeasures.inlineJsScriptsNumber));

            }
        },

        getSpecificMeasures: function () {
            return this.specificMeasures;
        }
    }
}