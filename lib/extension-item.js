/**
 * @file 单一组件构建器
 * @author errorrik(errorrik@gmail.com)
 */

var fs = require('fs');
var path = require('path');
var objectAssign = require('object-assign');
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
    this.readReadmeMD();
}

/**
 * 读取组件 package.json 信息
 */
ExtensionItem.prototype.readPackageJSON = function () {
    var file = path.resolve(this.dir, 'package.json');
    if (fs.statSync(file).isFile()) {
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
    if (fs.statSync(file).isFile()) {
        objectAssign(this.info, parseReadme(fs.readFileSync(file, 'UTF-8')));
    }
};

/**
 * 构建扩展组件
 */
ExtensionItem.prototype.build = function () {
    // TODO: implement, require mip-build package, and call
};

module.exports = exports = ExtensionItem;
