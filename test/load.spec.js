var load = require('../index').load;
var path = require('path');

describe("Load", function () {

    it("from directory, each sub directory which has mip- prefix is a extension", function (done) {
        load(path.resolve(__dirname, 'target')).then(function (extensions) {
            extensions.forEach(function (extension) {
                var name = extension.info.name;
                expect(name.indexOf('mip-test')).toBe(0);
                if (name === 'mip-test1') {
                    expect(extension.info.version).toBe('1.0.0');
                }
                else if (name === 'mip-test2'){
                    expect(extension.info.version).toBe('1.1.0');
                }
            });

            done();
        });

    });

});
