/**
 * @file 一些工具方法
 * @author errorrik(errorrik@gmail.com)
 */

var fs = require('fs');

/**
 * 字符串字面化
 *
 * @inner
 * @param {string} source 需要字面化的字符串
 * @return {string} 字符串字面化结果
 */
exports.stringLiteralize = function (source) {
    return '"'
        + source
            .replace(/\x5C/g, '\\\\')
            .replace(/"/g, '\\"')
            .replace(/\x0A/g, '\\n')
            .replace(/\x09/g, '\\t')
            .replace(/\x0D/g, '\\r')
        + '"';
};

/**
 * 判断文件是否存在
 *
 * @inner
 * @param {string} file 文件路径
 * @return {boolean}
 */
exports.fileExists = function (file) {
    try {
        return fs.statSync(file).isFile();
    }
    catch (e) {
        if (e.code != 'ENOENT')
          throw e;

        return false;
    }
};

/**
 * 判断文件是否目录
 *
 * @inner
 * @param {string} file 文件路径
 * @return {boolean}
 */
exports.isDirectory = function (file) {
    try {
        return fs.statSync(file).isDirectory();
    }
    catch (e) {
        if (e.code != 'ENOENT')
          throw e;

        return false;
    }
};

/**
 * 去除文本头尾的空白
 *
 * @inner
 * @param {string} source 要处理的文本
 * @return {string}
 */
exports.trim = function (source) {
    return source.replace(/(^\s+|\s+$)/g, '');
};
