rulesManager.registerRule(createMinifiedCssJsRule(), "resourceContentReceived");

function createMinifiedCssJsRule() {
    return{
    complianceLevel: 'A',
    id: "MinifiedCssJs",
    comment: chrome.i18n.getMessage("rule_MinifiedCssJs_DefaultComment"),
    detailComment: "",
    specificMeasures : {
        totalCssJsNumber: 0,
        notMinifiedCssJsNumber: 0
    },

    check: function (measures, resourceContent) {
        if ((resourceContent.type === "script") ||  (resourceContent.type === "stylesheet"))  {
            this.specificMeasures.totalCssJsNumber += 1;
            if (!isMinified(resourceContent.content)) {
                let url_toshow = resourceContent.url;
                if (url_toshow.length > 80) url_toshow = url_toshow.substring(0, 80) + "...";
                this.detailComment += chrome.i18n.getMessage("rule_MinifiedCssJs_DetailComment",url_toshow) + '<br>';
                this.specificMeasures.notMinifiedCssJsNumber += 1;
            }

            this.complianceLevel = 'A';
            if (this.specificMeasures.notMinifiedCssJsNumber > 0) {
                this.complianceLevel = 'C';
                this.comment = chrome.i18n.getMessage("rule_MinifiedCssJs_Comment",this.specificMeasures.notMinifiedCssJsNumber + "/" +this.specificMeasures.totalCssJsNumber );
            }
        }
    },

    initialize: function() {
        this.specificMeasures.totalCssJsNumber = 0;
        this.specificMeasures.notMinifiedCssJsNumber =0;
    },

    getSpecificMeasures: function () {
        return this.specificMeasures;
    }
}}
