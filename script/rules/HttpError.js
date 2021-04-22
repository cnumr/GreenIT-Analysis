rulesManager.registerRule(createHttpErrorRule(), "harReceived");

function createHttpErrorRule() {
    return {
        complianceLevel: 'A',
        id: "HttpError",
        comment: "",
        detailComment: "",
        specificMeasures : {
            errorNumber : 0
        },

        check: function (measures) {
            this.specificMeasures.errorNumber = 0;
            if (measures.entries.length) measures.entries.forEach(entry => {
                if (entry.response) {
                    if (entry.response.status >=400  ) {
                        this.detailComment += entry.response.status + " " + entry.request.url + "<br>";
                        this.specificMeasures.errorNumber++;
                    }
                }
            });
            if (this.specificMeasures.errorNumber > 0) this.complianceLevel = 'C';
            this.comment = chrome.i18n.getMessage("rule_HttpError_Comment", String(this.specificMeasures.errorNumber));
        },

        getSpecificMeasures: function () {
            return this.specificMeasures;
        }
    };
}