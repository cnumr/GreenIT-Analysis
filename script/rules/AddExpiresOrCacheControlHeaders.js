rulesManager.registerRule(createAddExpiresOrCacheControlHeadersRule(), "harReceived");

function createAddExpiresOrCacheControlHeadersRule() {
    return {
        complianceLevel: 'A',
        id: "AddExpiresOrCacheControlHeaders",
        comment: "",
        detailComment: "",
        specificMeasures: {
            staticResources: 0,
            staticResourcesWithCache: 0
        },

        check: function (measures) {

            this.specificMeasures.staticResources =0;
            this.specificMeasures.staticResourcesWithCache =0;
            if (measures.entries.length) measures.entries.forEach(entry => {
                if (isStaticRessource(entry)) {
                    this.specificMeasures.staticResources += 1;
                    if (hasValidCacheHeaders(entry)) {
                        this.specificMeasures.staticResourcesWithCache += 1;
                    } else this.detailComment += chrome.i18n.getMessage("rule_AddExpiresOrCacheControlHeaders_DetailComment", entry.request.url) + '<br>';
                }
            });

            if (this.specificMeasures.staticResources > 0) {
                if  (this.specificMeasures.staticResources - this.specificMeasures.staticResourcesWithCache > 0)  this.complianceLevel = 'C'
                else this.complianceLevel = 'A';
                this.comment = chrome.i18n.getMessage("rule_AddExpiresOrCacheControlHeaders_Comment",
                    this.specificMeasures.staticResourcesWithCache + ' / ' +   this.specificMeasures.staticResources);
            }
        },

        getSpecificMeasures: function () {
            return this.specificMeasures;
        }
    }
}