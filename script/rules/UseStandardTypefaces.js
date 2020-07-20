rulesManager.registerRule(createUseStandardTypefacesRule(), "harReceived");

function createUseStandardTypefacesRule() {
    return {
        complianceLevel: 'A',
        id: "UseStandardTypefaces",
        comment: chrome.i18n.getMessage("rule_UseStandardTypefaces_DefaultComment"),
        detailComment: "",
        specificMeasures: {
            totalFontsSize: 0
        },

        check: function (measures) {
            if (measures.entries.length) measures.entries.forEach(entry => {
                if (isFontResource(entry) && (entry.response.content.size > 0)) {
                    this.specificMeasures.totalFontsSize += entry.response.content.size;
                    this.detailComment += entry.request.url + " " + Math.round(entry.response.content.size / 1000) + "KB <br>";
                }
            });
            if (measures.dataEntries.length) measures.dataEntries.forEach(entry => {
                if (isFontResource(entry) && (entry.response.content.size > 0)) {
                    this.specificMeasures.totalFontsSize += entry.response.content.size;
                    url_toshow = entry.request.url;
                    if (url_toshow.length > 80) url_toshow = url_toshow.substring(0, 80) + "...";
                    this.detailComment += url_toshow + " " + Math.round(entry.response.content.size / 1000) + "KB <br>";
                }
            });
            if (this.specificMeasures.totalFontsSize > 10000) this.complianceLevel = 'C';
            else if (this.specificMeasures.totalFontsSize > 0) this.complianceLevel = 'B';
            if (this.specificMeasures.totalFontsSize > 0) this.comment = chrome.i18n.getMessage("rule_UseStandardTypefaces_Comment", String(Math.round(this.specificMeasures.totalFontsSize / 1000)));
        },

        getSpecificMeasures: function () {
            return this.specificMeasures;
        }

    }
}