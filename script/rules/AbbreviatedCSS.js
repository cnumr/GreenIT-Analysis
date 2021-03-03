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
    // let result=CSSResponses;
    let result=CSSResponses.replace(/(\/\*[\w\'\s\r\n\*]*\*\/)|(\/\/[\w\s\']*)|(\<![\-\-\s\w\>\/]*\>)/g,"");
    let mat1=result.match(/\{[0-9 a-z A-Z :\.,\-\#\%\!\/();\*\[\] ]*(margin)+[[0-9 a-z A-Z :\.,\-\#\%\!\/();\*\[\] ]*(margin)+[[0-9 a-z A-Z :\.,\-\#\%\!\/();\*\[\] ]*\}/g);
    mat1=mat1?mat1:[];
    let mat2=result.match(/\{[0-9 a-z A-Z :\.,\-\#\%\!\/();\*\[\] ]*(padding)+[[0-9 a-z A-Z :\.,\-\#\%\!\/();\*\[\] ]*(padding)+[[0-9 a-z A-Z :\.,\-\#\%\!\/();\*\[\] ]*\}/g);
    mat2=mat2?mat2:[];
    let mat3=result.match(/\{[0-9 a-z A-Z :\.,\-\#\%\!\/();\*\[\] ]*(font)+[[0-9 a-z A-Z :\.,\-\#\%\!\/();\*\[\] ]*(font)+[[0-9 a-z A-Z :\.,\-\#\%\!\/();\*\[\] ]*\}/g);
    mat3=mat3?mat3:[];
    let mat4=result.match(/\{[0-9 a-z A-Z :\.,\-\#\%\!\/();\*\[\] ]*(border)+[[0-9 a-z A-Z :\.,\-\#\%\!\/();\*\[\] ]*(border)+[[0-9 a-z A-Z :\.,\-\#\%\!\/();\*\[\] ]*\}/g);
    mat4=mat4?mat4:[];
    let mat5=result.match(/\{[0-9 a-z A-Z :\.,\-\#\%\!\/();\*\[\] ]*(background)+[[0-9 a-z A-Z :\.,\-\#\%\!\/();\*\[\] ]*(background)+[[0-9 a-z A-Z :\.,\-\#\%\!\/();\*\[\] ]*\}/g);
    mat5=mat5?mat5:[];
    let mat6=result.match(/\{[0-9 a-z A-Z :\.,\-\#\%\!\/();\*\[\] ]*(outline)+[[0-9 a-z A-Z :\.,\-\#\%\!\/();\*\[\] ]*(outline)+[[0-9 a-z A-Z :\.,\-\#\%\!\/();\*\[\] ]*\}/g);
    mat6=mat6?mat6:[];
    let mat7=result.match(/\{[0-9 a-z A-Z :\.,\-\#\%\!\/();\*\[\] ]*(list-style)+[[0-9 a-z A-Z :\.,\-\#\%\!\/();\*\[\] ]*(list-style)+[[0-9 a-z A-Z :\.,\-\#\%\!\/();\*\[\] ]*\}/g);
    mat7=mat7?mat7:[];
    if(mat1|| mat2 || mat3 || mat4 || mat5)
    {
        count=mat1.length+mat2.length+mat3.length+mat4.length+mat5.length;

    }
    return count;
}
