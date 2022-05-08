rulesManager.registerRule(createUseHttp2Rule(), "harReceived");

function createUseHttp2Rule() {
    return {
        complianceLevel: 'A',
        id: "UseHTTP2",
        comment: "",
        detailComment: "",
        specificMeasures : {
            HTTP1Requests : 0
        },

        check: function (measures) {
            this.specificMeasures.HTTP1Requests = 0;
            if (measures.entries.length) measures.entries.forEach(entry => {
                if (entry.response.httpVersion) {
                    if (entry.response.httpVersion.toUpperCase().includes("HTTP/1"))  {
                        this.specificMeasures.HTTP1Requests +=1;
                        let url_toshow = entry.request.url;
                        if (url_toshow.length > 80) url_toshow = url_toshow.substring(0, 80) + "...";
                        this.detailComment += chrome.i18n.getMessage("rule_UseHttp2_DetailComment",[ url_toshow , entry.response.httpVersion]) + '<br>';
                    }
                }
            });
            if (this.specificMeasures.HTTP1Requests > 0) this.complianceLevel = 'C';
            this.comment = chrome.i18n.getMessage("rule_UseHttp2_Comment", String(this.specificMeasures.HTTP1Requests + '/' + measures.entries.length));
        },

        getSpecificMeasures: function () {
            return this.specificMeasures;
        }
    };
}