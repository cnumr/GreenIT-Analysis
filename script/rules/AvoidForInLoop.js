rulesManager.registerRule({
    complianceLevel: 'A',
    id: "AvoidForInLoop",
    comment: chrome.i18n.getMessage("rule_AvoidForInLoop_DefaultComment"),
    count:0,
    detailComment: "",
  
    check: function (measures,resourceContent) {
        if (resourceContent.type === "script") {
            let count=getForInLoop(resourceContent.content);

            if (count > 0) {
                this.count+=count;
                this.complianceLevel = 'C';
                this.comment = chrome.i18n.getMessage("rule_AvoidForInLoop_Comment", String(this.count));
                this.detailComment += (`URL ${resourceContent.url} has ${count} for ... in loop(s) <br>`);
            }
        }
    }
  }, "resourceContentReceived");


function getForInLoop(JSResponses)
{
    let count = 0;
    let responses=JSResponses;
    let result=responses;
    if(result.match(/for\s*\(.* in .*\)/g))
    {
        ++count;

    }
    return count;
}