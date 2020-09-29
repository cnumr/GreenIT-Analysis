rulesManager.registerRule({
    complianceLevel: 'A',
    id: "NoFunctionInFor",
    comment: chrome.i18n.getMessage("rule_NoFunctionInFor_DefaultComment"),
    count:0,
    detailComment: "",
  
    check: function (measures, resourceContent) {
        if (resourceContent.type === "script") {
            let count=getFunctionInFor(resourceContent.content);

            if (count > 0) {
                this.count+=count;
                this.complianceLevel = 'C';
                this.comment = chrome.i18n.getMessage("rule_NoFunctionInFor_Comment", String(this.count));
                this.detailComment += (`URL ${resourceContent.url} has ${count} function(s) in for loop <br>`);
            }
        }
    }
  }, "resourceContentReceived",);


function getFunctionInFor(JSResponses)
{
    let count = 0;
    let responses=JSResponses;
    let result=null;
    result=responses;
    if(result.match(/for\s*(.*;.*\(.*\).*;.*).*/g) || result.match(/for\s*(.*\(.*\).*;.*.*;).*/g))
    {
        ++count;

    }
    return count;
}