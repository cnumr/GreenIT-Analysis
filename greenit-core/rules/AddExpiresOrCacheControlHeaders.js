rulesManager.registerRule({
    complianceLevel: 'A',
    id: "AddExpiresOrCacheControlHeaders",
    comment: "",
    detailComment: "",

    check: function (measures) {
        let staticResourcesSize = 0;
        let staticResourcesWithCache = 0;

        if (measures.entries.length) measures.entries.forEach(entry => {
            if (isStaticRessource(entry)) {
                staticResourcesSize += entry.response.content.size;
                if (hasValidCacheHeaders(entry)) {
                    staticResourcesWithCache += entry.response.content.size;
                }
                else this.detailComment += chrome.i18n.getMessage("rule_AddExpiresOrCacheControlHeaders_DetailComment",`${entry.request.url} ${Math.round(entry.response.content.size / 100) / 10}`) + '<br>';
            }
        });

        if (staticResourcesSize > 0) {
            const cacheHeaderRatio = staticResourcesWithCache / staticResourcesSize * 100;
            if (cacheHeaderRatio < 95) {
                if (cacheHeaderRatio < 90) this.complianceLevel = 'C'
                else this.complianceLevel = 'B';
            }
            else this.complianceLevel = 'A';
            this.comment = chrome.i18n.getMessage("rule_AddExpiresOrCacheControlHeaders_Comment", String(Math.round(cacheHeaderRatio * 10) / 10) + "%");
        }
    }
}, "harReceived");  