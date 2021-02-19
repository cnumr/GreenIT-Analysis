rulesManager.registerRule({
    complianceLevel: 'A',
    id: "JsValidate",
    comment: "",
    detailComment: "",
    errors: 0,
    totalJsSize: 0,

    check: function (measures, resourceContent) {
        if (resourceContent.type === "script") {
            this.totalJsSize += resourceContent.content.length;
            let errorNumber = computeNumberOfErrorsInJSCode(resourceContent.content, resourceContent.url);
            if (errorNumber > 0) {
                this.detailComment += (`URL ${resourceContent.url} has ${errorNumber} error(s) <br>`);
                this.errors += errorNumber;
                this.complianceLevel = 'C';
                this.comment = chrome.i18n.getMessage("rule_JsValidate_Comment", String(this.errors));
            }
        }
    }
}, "resourceContentReceived");