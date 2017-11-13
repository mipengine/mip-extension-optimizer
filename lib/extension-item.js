/**
 * @file 单一组件构建器
 * @author errorrik(errorrik@gmail.com)
 */


var fs = require('fs');
var path = require('path');
var objectAssign = require('object-assign');

var Builder = require('mip-builder');
var amdProcessor = require('mip-processor-amd');
var AMDCompiler = amdProcessor.Compiler;
var AMDPacker = amdProcessor.Packer;
var LessProcessor = require('mip-processor-less');
var JSCompressor = require('mip-processor-jscompress');


var parseReadme = require('./parse-readme');
var util = require('./util');


/**
 * 单一组件构建器
 *
 * @class
 */
function ExtensionItem(dir) {
    this.dir = dir;
    this.info = {};
    this.setting = {};

    this.readPackageJSON();
    this.findMain();
    this.readReadmeMD();
    this.readSetting();
}

/**
 * 读取组件 package.json 信息
 */
ExtensionItem.prototype.readPackageJSON = function () {
    var file = path.resolve(this.dir, 'package.json');
    if (util.fileExists(file)) {
        objectAssign(this.info, JSON.parse(fs.readFileSync(file, 'UTF-8')));
        return;
    }

    throw new Error('package.json not found: ' + file);
};

/**
 * 读取组件 README.md 信息
 */
ExtensionItem.prototype.readReadmeMD = function () {
    var file = path.resolve(this.dir, 'README.md');
    if (util.fileExists(file)) {
        objectAssign(this.info, parseReadme(fs.readFileSync(file, 'UTF-8')));
    }
};

/**
 * 读取组件 setting 信息
 */
ExtensionItem.prototype.readSetting = function () {
    var dir = path.resolve(this.dir, 'setting');

    if (!util.isDirectory(dir)) {
        return;
    }

    fs.readdirSync(dir).forEach(function (file) {
        var text = fs.readFileSync(path.resolve(dir, file), 'UTF-8');
        this.setting[file] = text;
    }, this);
};

/**
 * 查找组件模块和组件样式的主文件
 */
ExtensionItem.prototype.findMain = function () {
    var extName = this.info.name;

    this.mainModule = ['main', extName].find(
        function (name) {
            return util.fileExists(path.resolve(this.dir, name + '.js'));
        },
        this
    );

    if (!this.mainModule) {
        throw new Error(extName + ' invalid: main module not found!');
    }

    this.mainStyleFile = [
        extName + '.less',
        extName + '.css',
        'main.less',
        'main.css'
    ].find(
        function (name) {
            return util.fileExists(path.resolve(this.dir, name));
        },
        this
    );
};

/**
 * 获取默认的构建处理器列表
 *
 * @return {Array.<Processor>}
 */
ExtensionItem.prototype.getDefaultBuildProcessors = function () {
    var name = this.info.name;

    var version = this.info.version;
    var mainModule = this.mainModule;
    var mainStyleFile = this.mainStyleFile;

    // init require config for amd build
    var requireConfig = {
        baseUrl: path.resolve(this.dir, '..', 'null'),
        packages: [
            {
                name: name,
                main: mainModule,
                location: '../' + name
            }
        ]
    };

    return [
        new AMDCompiler({
            config: requireConfig
        }),

        new AMDPacker({
            config: requireConfig,
            modules: [this.mainModule]
        }),

        new LessProcessor({
            files: [this.mainStyleFile || 'not-exists-fire__']
        }),

        {
            name: 'AddBootstrap',
            files: ['**/*'],
            process: function (builder) {
                this.notifyStart(builder);

                var mainFile = builder.getFile(name + '/' + mainModule + '.js');

                if (mainFile) {
                    var styleContent = '';
                    if (mainStyleFile) {
                        var styleFile = builder.getFile(name + '/' + mainStyleFile);
                        styleContent = ', ' + util.stringLiteralize(styleFile.getData());
                    }

                    var content = [
                        '\n',
                        '// =============',
                        '// bootstrap',
                        '// =============',
                        '(function () {',
                        '    function registerComponent(mip, component) {',
                        '        mip.registerMipElement("' + name + '", component' + styleContent + ');',
                        '    }',
                        '    if (window.MIP) {',
                        '        require(["' + name + '"], function (component) {',
                        '            registerComponent(window.MIP, component);',
                        '        });',
                        '    }',
                        '    else {',
                        '        require(["mip", "' + name + '"], registerComponent);',
                        '    }',
                        '})();'
                    ].join('\n');

                    mainFile.setData(
                        '(window.MIP = window.MIP || []).push({'
                            + 'name:"' + name + '",'
                            + 'func: function () {'
                                + mainFile.getData() + content + '\n\n'
                            + '}'
                        + '});'
                    );
                }

                this.notifyEnd(builder);
                return Promise.resolve();
            }
        },

        {
            name: 'VersionPathMapper',
            files: ['**/*'],
            processFile: function (file) {
                var fileSegs = file.outputPath.split('/'); // Compatible for path
                fileSegs.splice(1, 0, version);
                file.outputPath = fileSegs.join(path.sep);
            }
        },

        new JSCompressor()
    ];
};

/**
 * 构建构建器
 *
 * @param {string=} options.outputDir 构建输出目录
 * @param {Array=} options.processors 构建处理器
 * @return {Builder}
 */
ExtensionItem.prototype.createBuilder = function (options) {
    return new Builder({
        dir: path.resolve(this.dir, '..'),
        processors: options.processors || this.getDefaultBuildProcessors(),

        files: [
            '!**/*',
            this.info.name + '/**/*',
            '!package.json',
            '!README.md',
            '!*/dist/**/*',
            '!*/setting/**/*'
        ],

        outputDir: options.outputDir
    });
};

/**
 * 构建扩展组件
 */
ExtensionItem.prototype.build = function (outputDir, reporter) {
    // init builder
    var builder = this.createBuilder({outputDir: outputDir});
    builder.setReporter(reporter);

    // do build
    return builder.build();
};

module.exports = exports = ExtensionItem;


