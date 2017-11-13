# mobile selector
手机端模拟iphone select选择组件，最多可渲染三级及以上数据

 [在线例子](http://qiuyaofan.github.io/mobileSelector/)
  
 [codepen在线例子](http://codepen.io/qiuyaofan/pen/VmKdPO">http://codepen.io/qiuyaofan/pen/VmKdPO) 

## 参数列表

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

## 组件特色

1.除了组件自带需要的样式，需要用户额外编写的css基本没有，除了想修改选择插件每个li的高度。

2.怎么拿到选中值？

```js
1. 如果就是看到的中文，直接$('.select-value').val()
2. 如果你的json的key里面有value值，可以
$('.select-value').data('value1')+'-'+$('.select-value').data('value2')取值，如果可以看例子里的二级里面的调用有.
3.如果不带value,可以id1=$('.select-value').data('id1');拿到序号值，然后用json[id1].cname这种格式拿每一级的值，二级id2=$('.select-value').data('id2')，json[id1]child[id2].cname去拿

```

3.调用代码：

```js
/**
 * 联动的picker
 * 三级
 */
$('.select-value').mPicker({
    level:3,
    dataJson: city3,
    Linkage:true,
    rows:6,
    idDefault:true,
    splitStr:'-',
    header:'<div class="mPicker-header">三级联动选择插件</div>',
    confirm:function(){
        console.info('【json里有不带value时】');
        console.info('选中的id序号为：',$('.select-value').data('id1')+'-'+$('.select-value').data('id2')+'-'+$('.select-value').data('id3'));
        var id1= $('.select-value').data('id1');
        var id2 = $('.select-value').data('id2');
        var id3 = $('.select-value').data('id3');
        console.info('第一列json：',city3[id1]);
        console.info('第二列json：', city3[id1].child[id2]);
        console.info('第三列json：', city3[id1].child[id2].child[id3]);
    },
    cancel:function(){
        console.info('返回之前的id序号：',$('.select-value').data('id1')+'-'+$('.select-value').data('id2')+'-'+$('.select-value').data('id3'));
    }
})
//获取mpicker实例
var method= $('.select-value').data('mPicker');
console.info('第一个mpicker的实例为：',method);
//mpicker方法
// method.showPicker();
// method.hide(function(){
//     console.info(this)
// });

/**
 * 联动的picker
 * 两级
 */
$('.select-value1').mPicker({
    level: 2,
    dataJson: dataJson,
    Linkage: true,
    rows: 6,
    idDefault: true,
    splitStr: '-',
    header: '<div class="mPicker-header">两级联动选择插件</div>',
    confirm: function () {
        var _this= this;
        var json=getVal();
        var valArr=json.value;
        console.info('【json里有带value的情况】');
        console.info('更新前的value：', valArr[0] , valArr[1]);
        console.info('更新前的value拼接值：', json.result);
        //更新json
        console.info('3s后更新json...');
        setTimeout(function(){
            _this.container.data('mPicker').updateData(level3);
            json = getVal();
            valArr = json.value;
            console.info('更新成功!!');
            console.info('更新后的value为空', valArr[0], valArr[1]);
            console.info('更新后的value拼接值为空', json.result);
        },3000);
        
    },
    cancel: function () {
    }
})
//获取value
function getVal(){
    var value1 = $('.select-value1').data('value1');
    var value2 = $('.select-value1').data('value2');
    var result='';
    value1 = value1 || '';
    value2 = value2 || '';
    if(value1){
        result= value1;
    }
    if(value2){
        result = result+'-'+ value2;
    }
    return {
        value:[value1, value2],
        result: result
    };
}

/**
 * 不联动的picker
 * 两级
 */
var method2=$('.select-value2').mPicker({
    level:2,
    dataJson:level3,
    rows:5,
    Linkage:false,
    header:'<div class="mPicker-header">非联动选择插件</div>',
    idDefault:true,
    confirm:function(){
        console.info('选中的value为',$('.select-value2').data('value1')+'-'+$('.select-value2').data('value2'));
    }
})
```
## QA:为什么要用这个组件

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

## 版本更新：

2016.11.16 重构代码，增加pc端鼠标事件选择

2017.11.06 优化代码，添加三级及以上数据渲染功能

