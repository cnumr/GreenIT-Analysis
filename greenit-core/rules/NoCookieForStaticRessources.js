rulesManager.registerRule({
    complianceLevel: 'A',
    id: "NoCookieForStaticRessources",
    comment: "",
    detailComment: "",
  
    check: function (measures) {
      let nbRessourcesStaticWithCookie = 0;
      let totalCookiesSize = 0;
      if (measures.entries.length) measures.entries.forEach(entry => {
        const cookiesLength = getCookiesLength(entry);
        if (isStaticRessource(entry) && (cookiesLength > 0)) {
          nbRessourcesStaticWithCookie++;
          totalCookiesSize += cookiesLength + 7; // 7 is size for the header name "cookie:"
          this.detailComment += chrome.i18n.getMessage("rule_NoCookieForStaticRessources_DetailComment",entry.request.url) + "<br> ";
        }
      });
      if (nbRessourcesStaticWithCookie > 0) {
        if (totalCookiesSize > 2000) this.complianceLevel = 'C';
        else this.complianceLevel = 'B';
        this.comment = chrome.i18n.getMessage("rule_NoCookieForStaticRessources_Comment", [String(nbRessourcesStaticWithCookie), String(Math.round(totalCookiesSize / 100) / 10)]);
      }
    }
  }, "harReceived");