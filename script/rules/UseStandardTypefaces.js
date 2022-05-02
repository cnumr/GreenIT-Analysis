rulesManager.registerRule(createUseStandardTypefacesRule(), "harReceived");

function createUseStandardTypefacesRule() {
    return {
        complianceLevel: 'A',
        id: "UseStandardTypefaces",
        comment: chrome.i18n.getMessage("rule_UseStandardTypefaces_DefaultComment"),
        detailComment: "",
        specificMeasures: {
            totalFontsNumber: 0
        },

        check: function (measures) {
            this.specificMeasures.totalFontsNumber = 0;
            if (measures.entries.length) measures.entries.forEach(entry => {
                if (isFontResource(entry) && (entry.response.content.size > 0)) {
                    this.specificMeasures.totalFontsNumber += 1;
                    this.detailComment += entry.request.url + " <br>";
                }
            });
            if (measures.dataEntries.length) measures.dataEntries.forEach(entry => {
                if (isFontResource(entry) && (entry.response.content.size > 0)) {
                    this.specificMeasures.totalFontsNumber += 1;
                    url_toshow = entry.request.url;
                    if (url_toshow.length > 80) url_toshow = url_toshow.substring(0, 80) + "...";
                    this.detailComment += url_toshow + " <br>";
                }
            });
            if (this.specificMeasures.totalFontsNumber > 2) this.complianceLevel = 'C';
            else if (this.specificMeasures.totalFontsNumber === 2) this.complianceLevel = 'B';

            if (this.specificMeasures.totalFontsNumber > 0) this.comment = chrome.i18n.getMessage("rule_UseStandardTypefaces_Comment", String(this.specificMeasures.totalFontsNumber));
        },

        getSpecificMeasures: function () {
            return this.specificMeasures;
        }

    }
}