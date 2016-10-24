# mip-test1

Description for mip-test1

可用性|稳定
支持布局|不使用布局
所需脚本|https://where.com/mip-test1.js

## 示例

### 单卡牌式
```html
<mip-test1 delay="100" duration="1000">
    <div class="mip-test1-front">正面内容</div>
    <div class="mip-test1-back">反面内容</div>
</mip-test1>
```

### 多卡牌式

可支持多张卡牌，最后一张为不可翻卡牌。

```html
<mip-test1 duration="1000">
    <div class="mip-test1-list">第一张</div>
    <div class="mip-test1-list">第二张</div>
    <div class="mip-test1-list">第三张</div>
    <div class="mip-test1-list">第四张</div>
    <div class="mip-test1-list">第五张</div>
    <div class="mip-test1-list">第六张</div>
    <div class="mip-test1-list">第七张</div>
    <div class="mip-test1-list">第八张</div>
    <div class="mip-test1-list">第九张</div>
    <div class="mip-test1-list mip-test1-list-last">最后一张</div>
</mip-test1>
```

## 属性

### delay 

说明：延迟翻转  
必选项：否  
类型：数字  
单位：毫秒(ms)  
默认值：0

### duration 

说明：动画持续时间  
必选项：否  
类型：数字  
取值范围：>0  
单位：毫秒(ms)  
默认值：400 


