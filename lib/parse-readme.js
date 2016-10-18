/**
 * @file 解析扩展组件的 README.md 文件
 * @author errorrik(errorrik@gmail.com)
 */


/**
 * 主题解析器列表
 *
 * @inner
 * @type {Array}
 */
var parsers = [
    {
        name: 'doc',

        condition: function (title) {
            return /doc/i.test(title) || title.indexOf('文档') >= 0;
        },

        parse: function (text) {
            return text;
        }
    },

    {
        name: 'usage',

        condition: function (title) {
            return /usage/i.test(title)
                || /example/i.test(title)
                || /demo/i.test(title)
                || title.indexOf('示例') >= 0
                || title.indexOf('用法') >= 0
                || title.indexOf('使用') >= 0;
        },

        parse: function (text) {
            var lines = text.split(/\r?\n/);
            var content = [];
            var state = 0;

            lines.forEach(function (line) {
                switch (state) {
                    case 0:
                        if (/^\s*```\s*[a-z]*\s*$/i.test(line)) {
                            state = 1;
                        }
                        break;

                    case 1:
                        if (/^\s*```\s*$/.test(line)) {
                            state = 2;
                        }
                        else {
                            content.push(line);
                        }
                        break;
                }
            });

            return content.join('\n');
        }
    }
];

var util = require('./util');

/**
 * 解析 README.md 文件内容
 *
 * @return {Object}
 */
function parse(source) {
    var lines = source.split(/\r?\n/);
    var len = lines.length;

    var parts = [];
    var currentPart = {content: ''};

    for (var i = 0; i < len; i++) {
        var currentLine = lines[i];
        var nextLine = lines[i + 1];
        var titleLevel = 0;
        var title = null;

        var titleMatch = /^(#+)([\s\S]+)$/.exec(currentLine);

        if (titleMatch) {
            titleLevel = titleMatch[1].length;
            title = util.trim(titleMatch[2]);
        }
        else if (/^={3,}\s*$/.test(nextLine)) {
            titleLevel = 1;
            title = util.trim(currentLine);
            i++;
        }
        else if (/^-{3,}\s*$/.test(nextLine)) {
            titleLevel = 2;
            title = util.trim(currentLine);
            i++;
        }

        // 一级标题我们不管
        // 按第二级标题把 README.md 的内容分片
        if (titleLevel && titleLevel <= 2) {
            if (titleLevel === 2) {
                currentPart = {
                    title: title,
                    content: ''
                };
                parts.push(currentPart);
            }
            continue;
        }

        currentPart.content += currentLine + '\n';
    }

    // 把按第二级标题分片后的内容逐个交给适合的 parser 解析
    var info = {};
    parts.forEach(function (part) {
        for (var i = 0; i < parsers.length; i++) {
            var parser = parsers[i];
            if (parser.condition(part.title)) {
                info[parser.name] = parser.parse(part.content);
                break;
            }
        }
    });

    return info;
}

module.exports = exports = parse;
