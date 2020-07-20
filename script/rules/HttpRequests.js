rulesManager.registerRule(createHttpRequestsRule(), "harReceived");

function createHttpRequestsRule() {
    return {
        complianceLevel: 'A',
        id: "HttpRequests",
        comment: "",
        detailComment: "",
        specificMeasures: {
            nbRequest: 0
        },

        check: function (measures) {
            this.specificMeasures.nbRequest = measures.nbRequest
            if (measures.entries.length) measures.entries.forEach(entry => {
                this.detailComment += entry.request.url + "<br>";
            });
            if (this.specificMeasures.nbRequest > 40) this.complianceLevel = 'C';
            else if (this.specificMeasures.nbRequest > 26) this.complianceLevel = 'B';
            this.comment = chrome.i18n.getMessage("rule_HttpRequests_Comment", String(this.specificMeasures.nbRequest));
        },

        getSpecificMeasures: function () {
            return this.specificMeasures;
        }
    }
}