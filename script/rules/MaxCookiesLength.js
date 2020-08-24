rulesManager.registerRule(createMaxCookiesLengthRule(), "harReceived");

function createMaxCookiesLengthRule() {
    return {
        complianceLevel: 'A',
        id: "MaxCookiesLength",
        comment: chrome.i18n.getMessage("rule_MaxCookiesLength_DefaultComment"),
        detailComment: "",
        specificMeasures: {
            maxCookiesLength: 0
        },

        check: function (measures) {
            let domains = new Map();
            if (measures.entries.length) measures.entries.forEach(entry => {
                const cookiesLength = getCookiesLength(entry);
                if (cookiesLength !== 0) {
                    let domain = getDomainFromUrl(entry.request.url);
                    if (domains.has(domain)) {
                        if (domains.get(domain) < cookiesLength) domains.set(domain, cookiesLength);
                    } else domains.set(domain, cookiesLength);
                    if (cookiesLength > this.specificMeasures.maxCookiesLength) this.specificMeasures.maxCookiesLength = cookiesLength;
                }
            });
            domains.forEach((value, key) => {
                this.detailComment += chrome.i18n.getMessage("rule_MaxCookiesLength_DetailComment", [value, key]) + '<br>';
            });
            if (this.specificMeasures.maxCookiesLength !== 0) {
                this.comment = chrome.i18n.getMessage("rule_MaxCookiesLength_Comment", String(this.specificMeasures.maxCookiesLength));
                if (this.specificMeasures.maxCookiesLength > 512) this.complianceLevel = 'B';
                if (this.specificMeasures.maxCookiesLength > 1024) this.complianceLevel = 'C';
            }
        },

        getSpecificMeasures: function () {
            return this.specificMeasures;
        }
    }
}