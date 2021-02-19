rulesManager.registerRule({
    complianceLevel: 'A',
    id: "HttpRequests",
    comment: "",
    detailComment: "",

    check: function (measures) {
        if (measures.entries.length) measures.entries.forEach(entry => {
            this.detailComment += entry.request.url + "<br>";
        });
        if (measures.nbRequest > 40) this.complianceLevel = 'C';
        else if (measures.nbRequest > 26) this.complianceLevel = 'B';
        this.comment = chrome.i18n.getMessage("rule_HttpRequests_Comment", String(measures.nbRequest));
    }
}, "harReceived");