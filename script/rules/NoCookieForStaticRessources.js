rulesManager.registerRule(createNoCookieForStaticRessourcesRule(), "harReceived");

function createNoCookieForStaticRessourcesRule() {
    return {
        complianceLevel: 'A',
        id: "NoCookieForStaticRessources",
        comment: chrome.i18n.getMessage("rule_NoCookieForStaticRessources_DefaultComment"),
        detailComment: "",
        specificMeasures: {
            nbRessourcesStaticWithCookie: 0,
            totalCookiesSize: 0
        },

        check: function (measures) {
            this.specificMeasures.nbRessourcesStaticWithCookie = 0;
            this.specificMeasures.totalCookiesSize =0;
            if (measures.entries.length) measures.entries.forEach(entry => {
                const cookiesLength = getCookiesLength(entry);
                if (isStaticRessource(entry) && (cookiesLength > 0)) {
                    this.specificMeasures.nbRessourcesStaticWithCookie++;
                    this.specificMeasures.totalCookiesSize += cookiesLength + 7; // 7 is size for the header name "cookie:"
                    this.detailComment += chrome.i18n.getMessage("rule_NoCookieForStaticRessources_DetailComment", entry.request.url) + "<br> ";
                }
            });
            if (this.specificMeasures.nbRessourcesStaticWithCookie > 0) {
                if (this.specificMeasures.totalCookiesSize > 2000) this.complianceLevel = 'C';
                else this.complianceLevel = 'B';
                this.comment = chrome.i18n.getMessage("rule_NoCookieForStaticRessources_Comment", [String(this.specificMeasures.nbRessourcesStaticWithCookie), String(Math.round(this.specificMeasures.totalCookiesSize / 100) / 10)]);
            }
        },

        getSpecificMeasures: function () {
            return this.specificMeasures;
        }
    }
}