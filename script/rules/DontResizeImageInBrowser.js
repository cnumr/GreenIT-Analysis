rulesManager.registerRule({
    complianceLevel: 'A',
    id: "DontResizeImageInBrowser",
    comment: "",
    detailComment: "",
    imagesResizedInBrowserNumber: 0,
    imgAnalysed: new Map(),

    // need to get a new map , otherwise it's share between instance 
    initialize: function () {
        this.imgAnalysed = new Map();
    },

    isRevelant: function (entry) {
        // exclude svg
        if (isSvgUrl(entry.src)) return false;

        // difference of 1 pixel is not relevant 
        if (entry.naturalWidth - entry.clientWidth < 2) return false;
        if (entry.naturalHeight - entry.clientHeight < 2) return false;

        // If picture is 0x0 it meens it's not visible on the ui , see imageDownloadedNotDisplayed
        if (entry.clientWidth === 0) return false;

        return true;
    },

    check: function (measures) {
        measures.imagesResizedInBrowser.forEach(entry => {
            if (!this.imgAnalysed.has(entry.src) && this.isRevelant(entry)) { // Do not count two times the same picture
                this.detailComment += chrome.i18n.getMessage("rule_DontResizeImageInBrowser_DetailComment",[entry.src,`${entry.naturalWidth}x${entry.naturalHeight}`,`${entry.clientWidth}x${entry.clientHeight}`]) + '<br>';
                this.imgAnalysed.set(entry.src);
                this.imagesResizedInBrowserNumber += 1;
            }
        });
        if (this.imagesResizedInBrowserNumber > 0) this.complianceLevel = 'C';
        this.comment = chrome.i18n.getMessage("rule_DontResizeImageInBrowser_Comment", String(this.imagesResizedInBrowserNumber));
    }
}, "frameMeasuresReceived");