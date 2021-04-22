rulesManager.registerRule(createMinifiedCssRule(), "resourceContentReceived");

function createMinifiedCssRule() {
    return {
        complianceLevel: 'A',
        id: "MinifiedCss",
        comment: chrome.i18n.getMessage("rule_MinifiedCss_DefaultComment"),
        detailComment: "",
        specificMeasures: {
            totalCssSize: 0,
            minifiedCssSize: 0
        },

        check: function (measures, resourceContent) {
            if (resourceContent.type === "stylesheet") {
                this.specificMeasures.totalCssSize += resourceContent.content.length;
                if (!isMinified(resourceContent.content)) this.detailComment += chrome.i18n.getMessage("rule_MinifiedCss_DetailComment", resourceContent.url) + '<br>';
                else this.specificMeasures.minifiedCssSize += resourceContent.content.length;
                const percentMinifiedCss = this.specificMeasures.minifiedCssSize / this.specificMeasures.totalCssSize * 100;
                this.complianceLevel = 'A';
                if (percentMinifiedCss < 90) this.complianceLevel = 'C';
                else if (percentMinifiedCss < 95) this.complianceLevel = 'B';
                this.comment = chrome.i18n.getMessage("rule_MinifiedCss_Comment", String(Math.round(percentMinifiedCss * 10) / 10));
            }
        },

        initialize: function() {
            this.specificMeasures.totalCssSize = 0;
            this.specificMeasures.minifiedCssSize =0;
        },

        getSpecificMeasures: function () {
            return this.specificMeasures;
        }
    }
}
