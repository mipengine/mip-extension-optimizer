/**
 * @file 解析扩展组件的 README.md 文件
 * @author errorrik(errorrik@gmail.com)
 */


var util = require('./util');


/**
 * 主题解析器列表
 *
 * @inner
 * @type {Array}
 */
var parsers = [
    {
        name: 'props',

        condition: function (title) {
            return /doc/i.test(title)
                || title.indexOf('文档') >= 0
                || title.indexOf('属性') >= 0;
        },

        parse: function (text) {
            var lines = text.split(/\r?\n/);
            var infoTitleKey = {
                '说明': 'description'
            };

            var content = [];
            var current;

            lines.forEach(function (line) {
                var titleMatch = /^###\s+([\S\s]+)$/.exec(line);
                if (titleMatch) {
                    if (current) {
                        content.push(current);
                    }

                    current = {
                        title: util.trim(titleMatch[1]),
                        infos: []
                    };
                }
                else if (current && line) {
                    var infoMatch = /^([^:：]+)[:：]\s*([\S\s]+)$/.exec(line);

                    if (infoMatch) {
                        var infoTitle = util.trim(infoMatch[1]);

                        if (infoTitleKey[infoTitle]) {
                            current[infoTitleKey[infoTitle]] = util.trim(infoMatch[2]);
                        }
                        else {
                            current.infos.push({
                                title: infoTitle,
                                info: util.trim(infoMatch[2])
                            });
                        }
                    }
                }
            });

            if (current) {
                content.push(current);
            }

            return content;
        }
    },

    {
        name: 'examples',

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
            var state = 1;

            var currentCode = [];
            var currentTitle = '';
            var currentDesc = [];

            function addExampleItem() {
                if (currentCode.length > 0) {
                    content.push({
                        title: util.trim(currentTitle),
                        code: currentCode.join('\n'),
                        description: currentDesc.join('\n')
                    });

                    currentCode = [];
                    currentTitle = null;
                    currentDesc = [];
                }
            }

            function readTitle(line) {
                var titleMatch = /^###\s+([\S\s]+)$/.exec(line);
                if (titleMatch) {
                    addExampleItem();
                    currentTitle = titleMatch[1];
                    state = 1;

                    return true;
                }

                return false;
            }

            lines.forEach(function (line) {
                // 0: example item start
                // 1: example item title readed
                // 2: example item code start
                switch (state) {
                    case 0:
                        readTitle(line);
                        break;

                    case 1:
                        if (/^\s*```\s*[a-z]*\s*$/i.test(line)) {
                            state = 2;
                        }
                        else if (!readTitle(line)) {
                            currentDesc.push(line);
                        }
                        break;

                    case 2:
                        if (/^\s*```\s*$/.test(line)) {
                            state = 0;
                        }
                        else {
                            currentCode.push(line);
                        }
                        break;

                    case 2:
                }
            });

            addExampleItem();

            return content;
        }
    }
];

/**
 * 文档预处理
 *
 * @inner
 * @type {Array}
 */
var preProcess = [
    {
        name: 'deps',
        parse: function (source) {
            var matched = (source.match(/所需脚本\s*\|\s*(.+?)[\r\n]/) || [])[1];
            var deps = [];

            matched.split(/\s*(?:,|<br\/?>)\s*/).forEach(function (url) {
                deps.push(url);
            });

            return deps;
        }
    }
];


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

    var info = {};

    // 优先进行预处理
    preProcess.forEach(function (process) {
        var result = process.parse(source);
        if (result) {
            info[process.name] = result;
        }
    });


    // 把按第二级标题分片后的内容逐个交给适合的 parser 解析
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
