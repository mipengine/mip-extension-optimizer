var Extension = require('../index').Extension;
var path = require('path');
var fs = require('fs');

var util = require('./util');
var genDefinePattern = util.genDefinePattern;
var fileExists = util.fileExists;
var rmdir = util.rmdir;

describe("Build", function () {

    it("extension, which main module and main css use same name as extension name", function (done) {
        var extension = new Extension(path.resolve(__dirname, 'target', 'mip-test1'));
        var outputDir = path.resolve(__dirname, 'dist');

        extension.build(outputDir)
            .then(function () {
                var mainModule = path.resolve(outputDir, 'mip-test1', '1.0.0', 'mip-test1.js');
                var utilModule = path.resolve(outputDir, 'mip-test1', '1.0.0', 'util.js');
                var mainCSS = path.resolve(outputDir, 'mip-test1', '1.0.0', 'mip-test1.css');

                expect(fileExists(mainModule)).toBeTruthy();
                expect(fileExists(utilModule)).toBeTruthy();
                expect(fileExists(mainCSS)).toBeTruthy();

                var mainModuleContent = fs.readFileSync(mainModule, 'UTF-8');
                var utilModuleContent = fs.readFileSync(utilModule, 'UTF-8');
                var mainCSSContent = fs.readFileSync(mainCSS, 'UTF-8');

                expect(mainModuleContent).toMatch(genDefinePattern('mip-test1', ['mip-test1/mip-test1']));
                expect(mainModuleContent).toMatch(genDefinePattern('mip-test1/mip-test1', ['require', './util']));
                expect(mainModuleContent).toMatch(genDefinePattern('mip-test1/util', []));

                expect(utilModuleContent).toMatch(genDefinePattern('mip-test1/util', []));
                expect(mainCSSContent).toMatch(/^mip-test1\{background:red/);

                rmdir(outputDir)
                done();
            });

    });

    it("extension, which main module and main css use 'main'", function (done) {
        var extension = new Extension(path.resolve(__dirname, 'target', 'mip-test2'));
        var outputDir = path.resolve(__dirname, 'dist');

        extension.build(outputDir)
            .then(function () {
                var mainModule = path.resolve(outputDir, 'mip-test2', '1.1.0', 'main.js');
                var extModule = path.resolve(outputDir, 'mip-test2', '1.1.0', 'ext.js');
                var mainCSS = path.resolve(outputDir, 'mip-test2', '1.1.0', 'main.css');

                var mainModuleContent = fs.readFileSync(mainModule, 'UTF-8');
                var extModuleContent = fs.readFileSync(extModule, 'UTF-8');
                var mainCSSContent = fs.readFileSync(mainCSS, 'UTF-8');


                expect(mainModuleContent).toMatch(genDefinePattern('mip-test2', ['mip-test2/main']));
                expect(mainModuleContent).toMatch(genDefinePattern('mip-test2/main', ['require']));


                expect(mainModuleContent).not.toMatch(genDefinePattern('mip-test2/ext', []));
                expect(extModuleContent).toMatch(genDefinePattern('mip-test2/ext', []));
                expect(mainCSSContent).toMatch(/^mip-test2\{background:blue/);

                rmdir(outputDir)
                done();
            });

    });

});
