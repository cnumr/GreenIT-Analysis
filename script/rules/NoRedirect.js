rulesManager.registerRule({
    complianceLevel: 'A',
    id: "NoRedirect",
    comment: "",
    detailComment: "",
  
    check: function (measures) {
      let redirectNumber = 0;
      if (measures.entries.length) measures.entries.forEach(entry => {
        if (entry.response) {
          if (isHttpRedirectCode(entry.response.status)) {
            this.detailComment += entry.response.status + " " + entry.request.url + "<br>";
            redirectNumber++;
          }
        }
      });
      if (redirectNumber > 0) this.complianceLevel = 'C';
      this.comment = chrome.i18n.getMessage("rule_NoRedirect_Comment", String(redirectNumber));
    }
  }, "harReceived");