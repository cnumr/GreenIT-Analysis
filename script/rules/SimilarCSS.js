rulesManager.registerRule({
    complianceLevel: 'A',
    id: "SimilarCSS",
    comment: chrome.i18n.getMessage("rule_SimilarCSS_DefaultComment"),
    count:0,
    detailComment: "",
    check: function (measures,resourceContent) {
        if (resourceContent.type === "stylesheet") {
            let count=getSimilarCSS(resourceContent.content);

            if (count > 0) {
                this.count+=count;
                this.complianceLevel = 'C';
                this.comment = chrome.i18n.getMessage("rule_SimilarCSS_Comment", String(this.count));
                this.detailComment += (`URL ${resourceContent.url} has ${count}  similar CSS <br>`);
            }
        }
    }
}, "resourceContentReceived");


function getSimilarCSS(CSSResponses)
{
    let count = 0;
    let CSSPattern;
    let repeatedCSS;
    let CSSlen = 0;
    let re;
    // let responses=CSSResponses;
    let responses=CSSResponses.replace(/(\/\*[\w\'\s\r\n\*]*\*\/)|(\/\/[\w\s\']*)|(\<![\-\-\s\w\>\/]*\>)/g,"");
    let result=null;
    result=responses;
    result = result.replace(/(\r\n|\n|\r)/gm,"");
    CSSPattern = result.match(/\{[0-9 a-z A-Z :\.,\-\#\%\!\/();\*\[\] ]*\}/g);
    if(CSSPattern)
    {
        CSSlen = CSSPattern.length;
    }
    for(let j=0;j<CSSlen;j++)
    {
        re = new RegExp(CSSPattern[j], 'g');
        repeatedCSS = result.match(re);
        if(repeatedCSS && repeatedCSS.length>1)
        {
            count++;
        }
    }
    return count;
}