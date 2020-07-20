describe("Rules => DontResizeImageInBrowser.js", function () {

    let rule;
    beforeEach(function () {
        rule = createDontResizeImageInBrowserRule();
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

    it(" 1 image not resized, it should return A", function () {
        const measures = {
            imagesResizedInBrowser:
                [
                    { src:"test.jpg", naturalWidth :120,naturalHeight:200,clientWidth:120,clientHeight:200}
                ]
        };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('A');
    });


    it(" 1 image svg (test.svg) resized, it should return A", function () {
        const measures = {
            imagesResizedInBrowser:
                [
                    { src:"test.svg", naturalWidth :120,naturalHeight:200,clientWidth:1000,clientHeight:2000}
                ]
        };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('A');
    });

    it(" 1 image svg (test.svg?params=test) resized, it should return A", function () {
        const measures = {
            imagesResizedInBrowser:
                [
                    { src:"test.svg?params=test", naturalWidth :120,naturalHeight:200,clientWidth:1000,clientHeight:2000}
                ]
        };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('A');
    });

    it(" 1 image resized with one pixel less, it should return A", function () {
        const measures = {
            imagesResizedInBrowser:
                [
                    { src:"test.jpg", naturalWidth :120,naturalHeight:200,clientWidth:119,clientHeight:200}
                ]
        };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('A');
    });

    it(" image not visible (Width=0 and height=0), it should return A", function () {
        const measures = {
            imagesResizedInBrowser:
                [
                    { src:"test.jpg", naturalWidth :10,naturalHeight:20,clientWidth:0,clientHeight:0}
                ]
        };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('A');
    });

    it(" 1 image resized , it should return C", function () {
        const measures = {
            imagesResizedInBrowser:
                [
                    { src:"test.jpg", naturalWidth :10,naturalHeight:20,clientWidth:5,clientHeight:10}
                ]
        };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('C');
    });

    it(" 1 image resized and one not resized, it should return C", function () {
        const measures = {
            imagesResizedInBrowser:
                [
                    { src:"test.jpg", naturalWidth :10,naturalHeight:20,clientWidth:5,clientHeight:10},
                    { src:"test2.jpg", naturalWidth :10,naturalHeight:20,clientWidth:10,clientHeight:20}
                ]
        };
        rule.check(measures);
        expect(rule.complianceLevel).toEqual('C');
    });

    afterEach(function () {
    });
});



