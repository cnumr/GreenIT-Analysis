rulesManager.registerRule(createStyleSheetsRule(), "harReceived");

function createStyleSheetsRule() {
    return {
        complianceLevel: 'A',
        id: "StyleSheets",
        comment: chrome.i18n.getMessage("rule_StyleSheets_DefaultComment"),
        detailComment: "",
        specificMeasures: {
            styleSheets: []
        },

        check: function (measures) {
            this.specificMeasures.styleSheets =[];
            if (measures.entries.length) measures.entries.forEach(entry => {
                if (getResponseHeaderFromResource(entry, "content-type").toLowerCase().includes('text/css')) {
                    if (this.specificMeasures.styleSheets.indexOf(entry.request.url) === -1) {
                        this.specificMeasures.styleSheets.push(entry.request.url);
                        this.detailComment += entry.request.url + "<br>";
                    }
                }
            });
            if (this.specificMeasures.styleSheets.length > 7) {
                if (this.specificMeasures.styleSheets.length < 11) this.complianceLevel = 'B';
                else this.complianceLevel = 'C';
                this.comment = chrome.i18n.getMessage("rule_StyleSheets_Comment", String(this.specificMeasures.styleSheets.length));
            }
        },

        getSpecificMeasures: function () {
            return this.specificMeasures;
        }
    }
}