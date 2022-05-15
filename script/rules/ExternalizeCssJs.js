rulesManager.registerRule(createExternalizeCssJsRule(), "frameMeasuresReceived");

function createExternalizeCssJsRule() {
    return {
        complianceLevel: 'A',
        id: "ExternalizeCssJs",
        comment: chrome.i18n.getMessage("rule_ExternalizeCssJs_DefaultComment"),
        detailComment: "",
        specificMeasures: {
            inlineCssJsNumber: 0
        },

        check: function (measures) {
            this.specificMeasures.inlineCssJsNumber = measures.inlineStyleSheetsNumber + measures.inlineJsScriptsNumber;
            if (this.specificMeasures.inlineCssJsNumber > 2) {
                this.complianceLevel = 'C';
            }
            if (this.specificMeasures.inlineCssJsNumber > 0) this.comment = chrome.i18n.getMessage("rule_ExternalizeCssJs_Comment", String(this.specificMeasures.inlineCssJsNumber));
        },

        getSpecificMeasures: function () {
            return this.specificMeasures;
        }
    }
}