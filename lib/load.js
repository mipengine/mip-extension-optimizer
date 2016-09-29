/**
 * @file 加载扩展组件
 * @author errorrik(errorrik@gmail.com)
 */

'use strict';

var fs = require('fs');
var path = require('path');
var ExtensionItem = require('./extension-item');

/**
 * 加载扩展组件
 *
 * @param {string} dir 扩展组件根目录
 * @return
 */
function load(dir) {
    return new Promise(function (resolve, reject) {
        if (!fs.statSync(dir).isDirectory()) {
            reject(dir + ' is not a directory!');
            return;
        }

        // traverse extensionsRoot dir
        fs.readdir(
            dir,
            function (error, files) {
                var extensions = [];

                files.forEach(function (file) {
                    if (file.indexOf('.') === 0) {
                        return;
                    }

                    var fileFullPath = path.resolve(dir, file);
                    if (fs.statSync(fileFullPath).isDirectory()) {
                        extensions.push(new ExtensionItem(fileFullPath));
                    }
                });

                resolve(extensions);
            }
        );
    });
}

module.exports = exports = load;
