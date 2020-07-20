rulesManager.registerRule(createPrintStyleSheetRule(), "frameMeasuresReceived");

function createPrintStyleSheetRule() {
    return {
        complianceLevel: 'C',
        id: "PrintStyleSheet",
        comment: chrome.i18n.getMessage("rule_PrintStyleSheet_DefaultComment"),
        detailComment: "",
        specificMeasures: {
            printStyleSheetsNumber: 0
        },

        check: function (measures) {
            this.specificMeasures.printStyleSheetsNumber = measures.printStyleSheetsNumber;
            if (this.specificMeasures.printStyleSheetsNumber > 0) {
                this.complianceLevel = 'A';
                this.comment = chrome.i18n.getMessage("rule_PrintStyleSheet_Comment", String(this.specificMeasures.printStyleSheetsNumber));
            }
        },

        getSpecificMeasures: function () {
            return this.specificMeasures;
        }
    }
}