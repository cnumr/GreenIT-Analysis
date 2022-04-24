rulesManager.registerRule(createNoRedirectRule(), "harReceived");

function createNoRedirectRule() {
    return {
        complianceLevel: 'A',
        id: "NoRedirect",
        comment: "",
        detailComment: "",
        specificMeasures: {
            redirectNumber: 0
        },

        check: function (measures) {
            this.specificMeasures.redirectNumber =0;
            if (measures.entries.length) measures.entries.forEach(entry => {
                if (entry.response) {
                    if (isHttpRedirectCode(entry.response.status)) {
                        this.detailComment += entry.response.status + " " + entry.request.url + "<br>";
                        this.specificMeasures.redirectNumber++;
                    }
                }
            });
            if (this.specificMeasures.redirectNumber > 1) this.complianceLevel = 'C';
            this.comment = chrome.i18n.getMessage("rule_NoRedirect_Comment", String(this.specificMeasures.redirectNumber));
        },

        getSpecificMeasures: function () {
            return this.specificMeasures;
        }
    }
}