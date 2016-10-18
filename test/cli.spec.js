var path = require('path');
var fs = require('fs')

var util = require('./util');
var genDefinePattern = util.genDefinePattern;
var fileExists = util.fileExists;
var rmdir = util.rmdir;



describe("CLI", function () {

    it("run bin/main extension-dir, gen dist files", function (done) {
        var spawn = require('child_process').spawn;
        var exec = spawn('node', [
            path.resolve(__dirname, '..', 'bin', 'main'),
            path.resolve(__dirname, 'target'),
        ]);

        exec.on('close', function (code) {
            var mainModule = path.resolve(__dirname, 'target', 'dist', 'mip-test1', '1.0.0', 'mip-test1.js');
            var utilModule = path.resolve(__dirname, 'target', 'dist', 'mip-test1', '1.0.0', 'util.js');
            var mainCSS = path.resolve(__dirname, 'target', 'dist', 'mip-test1', '1.0.0', 'mip-test1.css');

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


            mainModule = path.resolve(__dirname, 'target', 'dist', 'mip-test2', '1.1.0', 'main.js');
            var extModule = path.resolve(__dirname, 'target', 'dist', 'mip-test2', '1.1.0', 'ext.js');
            mainCSS = path.resolve(__dirname, 'target', 'dist', 'mip-test2', '1.1.0', 'main.css');

            var mainModuleContent = fs.readFileSync(mainModule, 'UTF-8');
            var extModuleContent = fs.readFileSync(extModule, 'UTF-8');
            var mainCSSContent = fs.readFileSync(mainCSS, 'UTF-8');


            expect(mainModuleContent).toMatch(genDefinePattern('mip-test2', ['mip-test2/main']));
            expect(mainModuleContent).toMatch(genDefinePattern('mip-test2/main', ['require']));


            expect(mainModuleContent).not.toMatch(genDefinePattern('mip-test2/ext', []));
            expect(extModuleContent).toMatch(genDefinePattern('mip-test2/ext', []));
            expect(mainCSSContent).toMatch(/^mip-test2\{background:blue/);

            rmdir(path.resolve(__dirname, 'target', 'dist'));
            done();
        });
    });

    it("run bin/main extension-dir, spec output, gen dist files", function (done) {
        var spawn = require('child_process').spawn;
        var exec = spawn('node', [
            path.resolve(__dirname, '..', 'bin', 'main'),
            path.resolve(__dirname, 'target'),
            '-o',
            path.resolve(__dirname, 'target-dist'),
        ]);

        exec.on('close', function (code) {
            var mainModule = path.resolve(__dirname, 'target-dist', 'mip-test1', '1.0.0', 'mip-test1.js');
            var utilModule = path.resolve(__dirname, 'target-dist', 'mip-test1', '1.0.0', 'util.js');
            var mainCSS = path.resolve(__dirname, 'target-dist', 'mip-test1', '1.0.0', 'mip-test1.css');

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


            mainModule = path.resolve(__dirname, 'target-dist', 'mip-test2', '1.1.0', 'main.js');
            var extModule = path.resolve(__dirname, 'target-dist', 'mip-test2', '1.1.0', 'ext.js');
            mainCSS = path.resolve(__dirname, 'target-dist', 'mip-test2', '1.1.0', 'main.css');

            var mainModuleContent = fs.readFileSync(mainModule, 'UTF-8');
            var extModuleContent = fs.readFileSync(extModule, 'UTF-8');
            var mainCSSContent = fs.readFileSync(mainCSS, 'UTF-8');


            expect(mainModuleContent).toMatch(genDefinePattern('mip-test2', ['mip-test2/main']));
            expect(mainModuleContent).toMatch(genDefinePattern('mip-test2/main', ['require']));


            expect(mainModuleContent).not.toMatch(genDefinePattern('mip-test2/ext', []));
            expect(extModuleContent).toMatch(genDefinePattern('mip-test2/ext', []));
            expect(mainCSSContent).toMatch(/^mip-test2\{background:blue/);

            rmdir(path.resolve(__dirname, 'target-dist'));
            done();
        });
    });

});
