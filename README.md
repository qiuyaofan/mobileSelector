# mobile selector
手机端模拟iphone select选择组件，最多可渲染三级及以上数据

##在线例子demo
<a href="http://codepen.io/qiuyaofan/pen/VmKdPO">http://codepen.io/qiuyaofan/pen/VmKdPO</a>

##参数列表

手机端模拟选择－2级

```php
@param
level [级别：1，2，3]
line [显示行数：默认为3]
height [行高：默认40]
idDefault [是否填充默认值：默认false]
splitStr [分割符号：默认’ ‘(例如：’/’,’-‘,’#’)]
Linkpage [是否联动：默认false]
dataLink [有联动时的数据（有格式）]
data1 [一级数据（Linkpage:false时才有用）]
data2 [二级数据（Linkpage:false时才有用）]
header [头部代码]
afterOne:function(){} [选择一级后回调函数]
afterTwo:function(){} [选择二级后回调函数]
confirm:function(){} [确定回调]
cancel:function(){} [取消回调]
@return deffered{‘show’:fn,’hide’:fn,’updateData’:fn}
```
##组件特色

1.除了组件自带需要的样式，需要用户额外编写的css基本没有，除了想修改选择插件每个li的高度。

2.json格式默认为：

```js
var method4=$('.select-value4').selectList({
    level:2,
    data1:level1,
    data2:level2,
    line:5,
    Linkpage:false,
    idDefault:true,
    afterOne:function(result){
        // console.info(result.target.html())
    },
    afterTwo:function(result){
        //console.info(result.target.html())
    },
    confirm:function(){
        method4.updateData([level2,level1]);
        //console.info($('.select-value').data('id1')+'-'+$('.select-value').data('id2')+'-'+$('.select-value').data('id3'));
    }
})
```
##QA:为什么要用这个组件

1.除了组件自带需要的样式，需要用户额外编写的css基本没有，除了想修改选择插件每个li的高度。

2.json格式默认为：

```js
level3=[
    {
        "name": '111',
        "value": '1',
        "child": [
            {
                "name": '222',
                "value": '3',
                "child": [
                    {
                        "name": 'fff',
                        "value": '3'
                    },
                    {
                        "name": 'ggg',
                        "value": '4'
                    },
                    {
                        "name": 'hhh',
                        "value": '5'
                    },
                    {
                        "name": 'yyy',
                        "value": '6'
                    }
                ]
            },
            {
                "name": '555',
                "value": '6',
                "child": [
                    {
                        "name": 'fff',
                        "value": '3'
                    },
                    {
                        "name": 'ggg',
                        "value": '4'
                    },
                    {
                        "name": 'hhh',
                        "value": '5'
                    },
                    {
                        "name": 'yyy',
                        "value": '6'
                    }
                ]
            }
        ]
    },
    {
        "name": 'ddd',
        "value": '2',
        "child": [
            {
                "name": 'fff',
                "value": '3'
            },
            {
                "name": 'ggg',
                "value": '4'
            },
            {
                "name": 'hhh',
                "value": '5'
            },
            {
                "name": 'yyy',
                "value": '6'
            }
        ]
    }
];
```
3.可修改selector头部代码，增加组件样式灵活性

4.调用组件的元素可以和填充的表单元素不是同一个，如果没设置则默认相同

5.自动填充默认值

6.新增了更新数据的功能，支持动态更新

更多详情请看selector-api.html

##版本更新：

2016.11.16 重构代码，增加pc端鼠标事件选择

2017.11.06 优化代码，添加三级及以上数据渲染功能
