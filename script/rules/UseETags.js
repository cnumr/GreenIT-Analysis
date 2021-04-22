rulesManager.registerRule(createUseETagsRule(), "harReceived");

function createUseETagsRule() {
    return {
        complianceLevel: 'A',
        id: "UseETags",
        comment: "",
        detailComment: "",
        specificMeasures: {
            staticResourcesWithETagsSize: 0,
            staticResourcesSize: 0
        },

        check: function (measures) {
            this.specificMeasures.staticResourcesWithETagsSize = 0;
            this.specificMeasures.staticResourcesSize = 0;
            if (measures.entries.length) measures.entries.forEach(entry => {
                if (isStaticRessource(entry)) {
                    this.specificMeasures.staticResourcesSize += entry.response.content.size;
                    if (isRessourceUsingETag(entry)) {
                        this.specificMeasures.staticResourcesWithETagsSize += entry.response.content.size;
                    } else this.detailComment += chrome.i18n.getMessage("rule_UseETags_DetailComment", `${entry.request.url} ${Math.round(entry.response.content.size / 100) / 10}`) + '<br>';
                }
            });
            if (this.specificMeasures.staticResourcesSize > 0) {
                let eTagsRatio = this.specificMeasures.staticResourcesWithETagsSize / this.specificMeasures.staticResourcesSize * 100;
                if (eTagsRatio < 95) {
                    if (eTagsRatio < 90) this.complianceLevel = 'C'
                    else this.complianceLevel = 'B';
                } else this.complianceLevel = 'A';
                this.comment = chrome.i18n.getMessage("rule_UseETags_Comment",
                    Math.round(eTagsRatio * 10) / 10 + "%");
            }
        },

        getSpecificMeasures: function () {
            return this.specificMeasures;
        }
    }
}