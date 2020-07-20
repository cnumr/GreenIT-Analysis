describe("Rules => ImageDownloadedNotDisplayed.js", function () {

    let rule;
    beforeEach(function () {
        rule = createImageDownloadedNotDisplayedRule();
    });

    it(" no image , it should return A", function () {
        const measures = {
            imagesResizedInBrowser:
                [
                ]
        };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('A');
    });

    it(" 1 image 120x200 displayed , it should return A", function () {
        const measures = {
            imagesResizedInBrowser:
                [
                    { src:"test.jpg", naturalWidth :120,naturalHeight:200,clientWidth:120,clientHeight:200}
                ]
        };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('A');
    });

    it(" 1 image 50x100 not displayed, it should return A as it is a too small image ", function () {
        const measures = {
            imagesResizedInBrowser:
                [
                    { src:"test.jpg", naturalWidth :50,naturalHeight:100,clientWidth:20,clientHeight:40}
                ]
        };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('A');
    });

    it(" 1 image 120x200 not displayed (with 0x0 size), it should return C", function () {
        const measures = {
            imagesResizedInBrowser:
                [
                    { src:"test.jpg", naturalWidth :120,naturalHeight:200,clientWidth:0,clientHeight:0}
                ]
        };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('C');
    });

    it(" 1 image not displayed and one displayed, it should return C", function () {
        const measures = {
            imagesResizedInBrowser:
                [
                    { src:"test.jpg", naturalWidth :120,naturalHeight:200,clientWidth:0,clientHeight:0},
                    { src:"test2.jpg", naturalWidth :120,naturalHeight:200,clientWidth:10,clientHeight:10}
                ]
        };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('C');
    });

    afterEach(function () {
    });
});



