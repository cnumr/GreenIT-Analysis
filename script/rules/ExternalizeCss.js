rulesManager.registerRule(createExternalizeCssRule(), "frameMeasuresReceived");

function createExternalizeCssRule() {
    return {
        complianceLevel: 'A',
        id: "ExternalizeCss",
        comment: chrome.i18n.getMessage("rule_ExternalizeCss_DefaultComment"),
        detailComment: "",
        specificMeasures: {
            inlineStyleSheetsNumber: 0
        },

        check: function (measures) {
            this.specificMeasures.inlineStyleSheetsNumber = measures.inlineStyleSheetsNumber;
            if (this.specificMeasures.inlineStyleSheetsNumber > 0) {
                this.complianceLevel = 'C';
                this.comment = chrome.i18n.getMessage("rule_ExternalizeCss_Comment", String(this.specificMeasures.inlineStyleSheetsNumber));
            }
        },

        getSpecificMeasures: function () {
            return this.specificMeasures;
        }
    }
}