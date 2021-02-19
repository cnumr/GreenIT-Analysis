rulesManager.registerRule({
    complianceLevel: 'A',
    id: "MaxCookiesLength",
    comment: "",
    detailComment: "",

    check: function (measures) {
        let maxCookiesLength = 0;
        let domains = new Map();
        if (measures.entries.length) measures.entries.forEach(entry => {
            const cookiesLength = getCookiesLength(entry);
            if (cookiesLength !== 0) {
                let domain = getDomainFromUrl(entry.request.url);
                if (domains.has(domain)) {
                    if (domains.get(domain) < cookiesLength) domains.set(domain, cookiesLength);
                }
                else domains.set(domain, cookiesLength);
                if (cookiesLength > maxCookiesLength) maxCookiesLength = cookiesLength;
            }
        });
        domains.forEach((value, key) => {
            this.detailComment += chrome.i18n.getMessage("rule_MaxCookiesLength_DetailComment",[value,key]) + '<br>' ;
        });
        if (maxCookiesLength !== 0) {
            this.comment = chrome.i18n.getMessage("rule_MaxCookiesLength_Comment", String(maxCookiesLength));
            if (maxCookiesLength > 512) this.complianceLevel = 'B';
            if (maxCookiesLength > 1024) this.complianceLevel = 'C';
        }
    }
}, "harReceived");