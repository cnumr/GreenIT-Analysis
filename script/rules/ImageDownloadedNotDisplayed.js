rulesManager.registerRule(createImageDownloadedNotDisplayedRule(), "frameMeasuresReceived");

function createImageDownloadedNotDisplayedRule() {
    return {
        complianceLevel: 'A',
        id: "ImageDownloadedNotDisplayed",
        comment: "",
        detailComment: "",
        specificMeasures: {
            imageDownloadedNotDisplayedNumber: 0,
            imgAnalysed: new Map()
        },

        // need to get a new map , otherwise it's share between instance
        initialize: function () {
            this.specificMeasures.imgAnalysed = new Map();
            this.specificMeasures.imageDownloadedNotDisplayedNumber = 0;
        },

        isRevelant: function (entry) {
            // Very small images could be download even if not display  as it may be icons
            if (entry.naturalWidth * entry.naturalHeight < 10000) return false;
            if (entry.clientWidth === 0 && entry.clientHeight === 0) return true;
            return false;
        },

        check: function (measures) {
            measures.imagesResizedInBrowser.forEach(entry => {
                if (!this.specificMeasures.imgAnalysed.has(entry.src) && this.isRevelant(entry)) { // Do not count two times the same picture
                    this.detailComment += chrome.i18n.getMessage("rule_ImageDownloadedNotDisplayed_DetailComment", [entry.src, `${entry.naturalWidth}x${entry.naturalHeight}`]) + '<br>';
                    this.specificMeasures.imgAnalysed.set(entry.src);
                    this.specificMeasures.imageDownloadedNotDisplayedNumber += 1;
                }
            });
            if (this.specificMeasures.imageDownloadedNotDisplayedNumber > 0) this.complianceLevel = 'C';
            this.comment = chrome.i18n.getMessage("rule_ImageDownloadedNotDisplayed_Comment", String(this.specificMeasures.imageDownloadedNotDisplayedNumber));
        },

        getSpecificMeasures: function () {
            return this.specificMeasures;
        }
    }
}