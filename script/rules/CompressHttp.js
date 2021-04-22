rulesManager.registerRule(createCompressHttpRule(), "harReceived");

function createCompressHttpRule() {
    return {
        complianceLevel: 'A',
        id: "CompressHttp",
        comment: "",
        detailComment: "",
        specificMeasures: {
            compressibleResourcesSize: 0,
            compressibleResourcesCompressedSize: 0
        },

        check: function (measures) {
            this.specificMeasures.compressibleResourcesSize = 0;
            this.specificMeasures.compressibleResourcesCompressedSize = 0;
            if (measures.entries.length) measures.entries.forEach(entry => {
                if (isCompressibleResource(entry)) {
                    this.specificMeasures.compressibleResourcesSize += entry.response.content.size;
                    if (isResourceCompressed(entry)) {
                        this.specificMeasures.compressibleResourcesCompressedSize += entry.response.content.size;
                    } else this.detailComment += chrome.i18n.getMessage("rule_CompressHttp_DetailComment", `${entry.request.url} ${Math.round(entry.response.content.size / 100) / 10}`) + '<br>';
                }
            });
            if (this.specificMeasures.compressibleResourcesSize > 0) {
                const compressRatio = this.specificMeasures.compressibleResourcesCompressedSize / this.specificMeasures.compressibleResourcesSize * 100;
                if (compressRatio < 95) {
                    if (compressRatio < 90) this.complianceLevel = 'C'
                    else this.complianceLevel = 'B';
                } else this.complianceLevel = 'A';
                this.comment = chrome.i18n.getMessage("rule_CompressHttp_Comment",
                    String(Math.round(compressRatio * 10) / 10) + "%");
            }
        },

        getSpecificMeasures: function () {
            return this.specificMeasures;
        }
    }
}