var Extension = require('../index').Extension;
var path = require('path');
var fs = require('fs');

describe("Extension Info", function () {

    it("name", function () {
        var extension = new Extension(path.resolve(__dirname, 'target', 'mip-test2'));

        expect(extension.info.name).toBe('mip-test2');
    });

    it("version", function () {
        var extension = new Extension(path.resolve(__dirname, 'target', 'mip-test2'));

        expect(extension.info.version).toBe('1.1.0');
    });

    it("single examples", function () {
        var extension = new Extension(path.resolve(__dirname, 'target', 'mip-test2'));
        var examples = extension.info.examples;

        expect(examples.length).toBe(1);
        expect(examples[0].title).toBe('');
        expect(examples[0].description.indexOf('可支持多张卡牌，最后一张为不可翻卡牌。') >= 0).toBeTruthy();

        expect(examples[0].code.indexOf('<mip-test2') >= 0).toBeTruthy();
        expect(examples[0].code.indexOf('</mip-test2') > 0).toBeTruthy();
    });

    it("multi examples", function () {
        var extension = new Extension(path.resolve(__dirname, 'target', 'mip-test1'));
        var examples = extension.info.examples;

        expect(examples.length).toBe(2);
        expect(examples[0].title).toBe('单卡牌式');
        expect(examples[1].title).toBe('多卡牌式');
        expect(examples[0].description).toBe('');
        expect(examples[1].description.indexOf('可支持多张卡牌，最后一张为不可翻卡牌。') > 0).toBeTruthy();

        expect(examples[0].code.indexOf('<mip-test1') >= 0).toBeTruthy();
        expect(examples[0].code.indexOf('</mip-test1') > 0).toBeTruthy();
        expect(examples[1].code.indexOf('<mip-test1') >= 0).toBeTruthy();
        expect(examples[1].code.indexOf('</mip-test1') > 0).toBeTruthy();
    });

    it("props", function () {
        var extension = new Extension(path.resolve(__dirname, 'target', 'mip-test1'));
        var props = extension.info.props;

        expect(props.length).toBe(2);
        expect(props[0].title).toBe('delay');
        expect(props[1].title).toBe('duration');
        expect(props[0].description).toBe('延迟翻转');
        expect(props[1].description).toBe('动画持续时间');
        expect(props[0].infos.length).toBe(4);
        expect(props[1].infos.length).toBe(5);

        expect(props[0].infos[0].title).toBe('必选项');
        expect(props[0].infos[0].info).toBe('否');
        expect(props[0].infos[1].title).toBe('类型');
        expect(props[0].infos[1].info).toBe('数字');
        expect(props[0].infos[2].title).toBe('单位');
        expect(props[0].infos[2].info).toBe('毫秒(ms)');
        expect(props[0].infos[3].title).toBe('默认值');
        expect(props[0].infos[3].info).toBe('0');

        expect(props[1].infos[0].title).toBe('必选项');
        expect(props[1].infos[0].info).toBe('否');
        expect(props[1].infos[1].title).toBe('类型');
        expect(props[1].infos[1].info).toBe('数字');
        expect(props[1].infos[2].title).toBe('取值范围');
        expect(props[1].infos[2].info).toBe('>0');
        expect(props[1].infos[3].title).toBe('单位');
        expect(props[1].infos[3].info).toBe('毫秒(ms)');
        expect(props[1].infos[4].title).toBe('默认值');
        expect(props[1].infos[4].info).toBe('400');
    });

});
