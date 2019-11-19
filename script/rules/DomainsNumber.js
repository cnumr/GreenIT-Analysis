rulesManager.registerRule({
    complianceLevel: 'A',
    id: "DomainsNumber",
    comment: "",
    detailComment: "",

    check: function (measures) {
        let domains = [];
        if (measures.entries.length) measures.entries.forEach(entry => {
            let domain = getDomainFromUrl(entry.request.url);
            if (domains.indexOf(domain) === -1) {
                domains.push(domain);
            }
        });
        if (domains.length > 2) {
            if (domains.length === 3) this.complianceLevel = 'B';
            else this.complianceLevel = 'C';
        }
        domains.forEach(domain => {
            this.detailComment += domain + "<br>";
        });

        this.comment = chrome.i18n.getMessage("rule_DomainsNumber_Comment", String(domains.length));
    }
}, "harReceived");