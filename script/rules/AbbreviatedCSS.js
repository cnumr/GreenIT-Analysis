rulesManager.registerRule({
    complianceLevel: 'A',
    id: "AbbreviatedCSS",
    comment: chrome.i18n.getMessage("rule_AbbreviatedCSS_DefaultComment"),
    count:0,
    detailComment: "",
    check: function (measures,resourceContent) {
        if (resourceContent.type === "stylesheet") {
            let count=getAbbreviatedCSSNumber(resourceContent.content);

            if (count > 0) {
                this.count+=count;
                this.complianceLevel = 'C';
                this.comment = chrome.i18n.getMessage("rule_AbbreviatedCSS_Comment", String(this.count));
                this.detailComment += (`URL ${resourceContent.url} has  non abbreviated CSS <br>`);
            }
        }
    }
}, "resourceContentReceived");

function getAbbreviatedCSSNumber(CSSResponses)
{
    let count = 0;
    let responses=CSSResponses;
    let result=responses;
    if(result.match(/\{[0-9 a-z A-Z :\.,\-\#\%\!\/();\*\[\] ]*(margin)+[[0-9 a-z A-Z :\.,\-\#\%\!\/();\*\[\] ]*(margin)+[[0-9 a-z A-Z :\.,\-\#\%\!\/();\*\[\] ]*\}/g) || result.match(/\{[0-9 a-z A-Z :\.,\-\#\%\!\/();\*\[\] ]*(padding)+[[0-9 a-z A-Z :\.,\-\#\%\!\/();\*\[\] ]*(padding)+[[0-9 a-z A-Z :\.,\-\#\%\!\/();\*\[\] ]*\}/g) || result.match(/\{[0-9 a-z A-Z :\.,\-\#\%\!\/();\*\[\] ]*(font)+[[0-9 a-z A-Z :\.,\-\#\%\!\/();\*\[\] ]*(font)+[[0-9 a-z A-Z :\.,\-\#\%\!\/();\*\[\] ]*\}/g) || result.match(/\{[0-9 a-z A-Z :\.,\-\#\%\!\/();\*\[\] ]*(border)+[[0-9 a-z A-Z :\.,\-\#\%\!\/();\*\[\] ]*(border)+[[0-9 a-z A-Z :\.,\-\#\%\!\/();\*\[\] ]*\}/g) || result.match(/\{[0-9 a-z A-Z :\.,\-\#\%\!\/();\*\[\] ]*(background)+[[0-9 a-z A-Z :\.,\-\#\%\!\/();\*\[\] ]*(background)+[[0-9 a-z A-Z :\.,\-\#\%\!\/();\*\[\] ]*\}/g))
    {
        ++count;

    }
    return count;
}