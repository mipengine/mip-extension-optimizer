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


/**
 * 单一组件构建器
 *
 * @class
 */
function ExtensionItem(dir) {
    this.dir = dir;
    this.info = {};
    this.readPackageJSON();
    this.findMain();
    this.readReadmeMD();
}

/**
 * 读取组件 package.json 信息
 */
ExtensionItem.prototype.readPackageJSON = function () {
    var file = path.resolve(this.dir, 'package.json');
    if (fileExists(file)) {
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
    if (fileExists(file)) {
        objectAssign(this.info, parseReadme(fs.readFileSync(file, 'UTF-8')));
    }
};

/**
 * 查找组件模块和组件样式的主文件
 */
ExtensionItem.prototype.findMain = function () {
    var extName = this.info.name;

    this.mainModule = ['main', extName].find(
        function (name) {
            return fileExists(path.resolve(this.dir, name + '.js'));
        },
        this
    );

    this.mainStyleFile = [
        extName + '.less',
        extName + '.css',
        'main.less',
        'main.css'
    ].find(
        function (name) {
            return fileExists(path.resolve(this.dir, name));
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

    // init require config for amd build
    var requireConfig = {
        baseUrl: path.resolve(this.dir, '..', 'null'),
        packages: [
            {
                name: name,
                main: this.mainModule,
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
            files: [this.mainStyleFile]
        }),

        new JSCompressor(),

        {
            name: 'VersionPathMapper',
            files: ['**/*'],
            processFile: function (file) {
                var fileSegs = file.outputPath.split(path.sep);
                fileSegs.splice(1, 0, version);
                file.outputPath = fileSegs.join(path.sep);
            }
        }
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
            this.info.name + '/**/*',
            '!package.json',
            '!README.md',
            '!dist/**/*'
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

/**
 * 判断文件是否存在
 *
 * @inner
 * @param {string} file 文件路径
 * @return {boolean}
 */
function fileExists(file) {
    try {
        return fs.statSync(file).isFile();
    }
    catch (e) {
        if (e.code != 'ENOENT')
          throw e;

        return false;
    }
}
