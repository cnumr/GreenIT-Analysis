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
    // let result=JSResponses;
    let result=JSResponses.replace(/(\/\*[\w\'\s\r\n\*]*\*\/)|(\/\/[\w\s\']*)|(\<![\-\-\s\w\>\/]*\>)/g,"");
    let mat1=result.match(/for\s*\(.* in .*\)/g);
    mat1=mat1?mat1:[];
    if(mat1)
    {
        count=mat1.length;

    }
    return count;
}