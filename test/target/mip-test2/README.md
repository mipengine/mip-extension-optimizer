# mip-test2

Description for mip-test2

可用性|稳定
支持布局|不使用布局
所需脚本|https://where.com/mip-test2.js

## 示例

可支持多张卡牌，最后一张为不可翻卡牌。

```html
<mip-test2 duration="1000">
    <div class="mip-test2-list">第一张</div>
    <div class="mip-test2-list">第二张</div>
    <div class="mip-test2-list">第三张</div>
    <div class="mip-test2-list">第四张</div>
    <div class="mip-test2-list">第五张</div>
    <div class="mip-test2-list">第六张</div>
    <div class="mip-test2-list">第七张</div>
    <div class="mip-test2-list">第八张</div>
    <div class="mip-test2-list">第九张</div>
    <div class="mip-test2-list mip-test2-list-last">最后一张</div>
</mip-test2>
```

## 属性

### delay

说明：延迟翻转  
必选项：否  
类型：数字  
取值范围：>0  
单位：毫秒(ms)  
默认值：0

### duration

说明：动画持续时间  
必选项：否  
类型：数字  
取值范围：>0  
单位：毫秒(ms)  
默认值：400 


