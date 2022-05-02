rulesManager.registerRule(createDomainsNumberRule(), "harReceived");

function createDomainsNumberRule() {
    return {
        complianceLevel: 'A',
        id: "DomainsNumber",
        comment: "",
        detailComment: "",
        specificMeasures: {
            domains: []
        },

        check: function (measures) {
            this.specificMeasures.domains = [];
            if (measures.entries.length) measures.entries.forEach(entry => {
                let domain = getDomainFromUrl(entry.request.url);
                if (this.specificMeasures.domains.indexOf(domain) === -1) {
                    this.specificMeasures.domains.push(domain);
                }
            });
            if (this.specificMeasures.domains.length > 3) {
                if (this.specificMeasures.domains.length < 6) this.complianceLevel = 'B';
                else this.complianceLevel = 'C';
            }
            this.specificMeasures.domains.forEach(domain => {
                this.detailComment += domain + "<br>";
            });

            this.comment = chrome.i18n.getMessage("rule_DomainsNumber_Comment", String(this.specificMeasures.domains.length));
        },

        getSpecificMeasures: function () {
            return this.specificMeasures;
        }
    }
}