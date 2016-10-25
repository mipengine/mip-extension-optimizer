var Extension = require('../index').Extension;
var path = require('path');
var fs = require('fs');

describe("Extension Setting", function () {

    it("file can read", function () {
        var extension = new Extension(path.resolve(__dirname, 'target', 'mip-test1'));

        var examplePreset = extension.setting['example.preset'];

        expect(examplePreset.indexOf('20px') > 0).toBeTruthy();
    });
});
