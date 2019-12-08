rulesManager.registerRule({
    complianceLevel: 'A',
    id: "HttpError",
    comment: "",
    detailComment: "",
  
    check: function (measures) {
      let errorNumber = 0;
      if (measures.entries.length) measures.entries.forEach(entry => {
        if (entry.response) {
          if (entry.response.status >=400  ) {
            this.detailComment += entry.response.status + " " + entry.request.url + "<br>";
            errorNumber++;
          }
        }
      });
      if (errorNumber > 0) this.complianceLevel = 'C';
      this.comment = chrome.i18n.getMessage("rule_HttpError_Comment", String(errorNumber));
    }
  }, "harReceived");