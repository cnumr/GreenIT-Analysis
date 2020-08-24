rulesManager.registerRule(createOptimizeSvgRule(), "resourceContentReceived");

function createOptimizeSvgRule() {
    return {
        complianceLevel: 'A',
        id: "OptimizeSvg",
        comment: chrome.i18n.getMessage("rule_OptimizeSvg_DefaultComment"),
        detailComment: "",
        specificMeasures: {
            totalSizeToOptimize: 0,
            totalResourcesToOptimize: 0
        },

        check: function (measures, resourceContent) {
            if ((resourceContent.type === 'image') && isSvgUrl(resourceContent.url)) {
                if (!isSvgOptimized(window.atob(resourceContent.content)))  // code is in base64 , decode base64 data with atob
                {
                    this.detailComment += chrome.i18n.getMessage("rule_OptimizeSvg_detailComment", [resourceContent.url, String(Math.round(resourceContent.content.length / 100) / 10)]) + '<br>';
                    this.specificMeasures.totalSizeToOptimize += resourceContent.content.length;
                    this.specificMeasures.totalResourcesToOptimize++;
                }
                if (this.specificMeasures.totalSizeToOptimize > 0) {
                    if (this.specificMeasures.totalSizeToOptimize < 20000) this.complianceLevel = 'B';
                    else this.complianceLevel = 'C';
                    this.comment = chrome.i18n.getMessage("rule_OptimizeSvg_Comment", String(this.specificMeasures.totalResourcesToOptimize));
                }
            }
        },

        getSpecificMeasures: function () {
            return this.specificMeasures;
        }
    }
}