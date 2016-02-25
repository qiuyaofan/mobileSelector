/**
 * 动画结束事件兼容
 */
function __dealCssEvent(eventNameArr, callback) {
    var events = eventNameArr,
        i, dom = this;// jshint ignore:line

    function fireCallBack(e) {
        /*jshint validthis:true */
        if (e.target !== this) return;
        callback.call(this, e);
        for (i = 0; i < events.length; i++) {
            dom.off(events[i], fireCallBack);
        }
    }
    if (callback) {
        for (i = 0; i < events.length; i++) {
            dom.on(events[i], fireCallBack);
        }
    }
}

//动画结束事件兼容
$.fn.animationEnd = function(callback) {
    __dealCssEvent.call(this, ['webkitAnimationEnd', 'animationend'], callback);
    return this;
};
$.fn.transitionEnd = function(callback) {
    __dealCssEvent.call(this, ['webkitTransitionEnd', 'transitionend'], callback);
    return this;
};
/**
 * 手机端模拟选择－2级
 * @param
 * level                 [级别：1，2，3]
 * line                  [显示行数：默认为3]
 * height                [行高：默认40]
 * idDefault             [是否有默认值：默认false]
 * splitStr              [分割符号：' '(例如：'/','-','#')]
 * Linkpage              [是否联动：false]
 * dataLink              [有联动时的数据（有格式）]
 * data1                 [一级数据（Linkpage:false时才有用）]
 * data2                 [二级数据（Linkpage:false时才有用）]
 * header                [头部代码]
 * afterTwo:function(){} [选择二级后回调函数]
 * confirm:function(){}  [确定回调]
 * cancel:function(){}   [取消回调]
 * @return deffered{'show':fn,'hide':fn}
 */
$(function($) {
    var methods = {

        init: function(options) {
            var defaults = {
                level: 1,
                line:3,
                Linkpage:false,
                dataLink:'',
                data1:'',
                data2:'',
                height:40,
                idDefault:false,
                splitStr:' ',
                header:'<div class="selector-header"><a href="javascript:;" class="selector-cancel">取消</a><a href="javascript:;" class="selector-confirm">确定</a></div>',
                afterOne:function(){},
                afterTwo:function(){},
                confirm:function(){},
                cancel:function(){}
            };
            var config = $.extend({}, defaults, options);

            var $body=$('body');
            var $input=$(this);

            var selector=this;

			var deffered;
			var timeTouchend;
			var _lock;
			//函数名
			var fnName=[config['afterOne'],config['afterTwo']];
			//宽度
			var ulWidth=['100%','50%'];
			//遮罩
            var $mask='<div class="selector-mask hide"></div>';
            //线条
            var $line=$('<div class="selector-line"></div>');

			config.header?false:config.header='<div class="selector-header"><a href="javascript:;" class="selector-cancel">取消</a><a href="javascript:;" class="selector-confirm">确定</a></div>';


			//阻止默认滚动
			document.body.addEventListener('touchmove', function(event) {
			    if (_lock) {
			        event.preventDefault();
			        event.stopPropagation();
			    }
			}, false);

            //初始化
            var create={
                init:function(){
                    selector.topLine=parseInt(config.line/2.5);
                    var str;
                    var dataStr=[];

                    //联动
                    if(config.Linkpage){
                        if(config.level===2){
                            dataStr=[config.dataLink,config['dataLink'][0]['child']];
                        }
                        str=create.html(dataStr);
                    }else{
                        for (var i = 1; i <= config.level; i++) {
                            dataStr.push(config['data'+[i]]);
                        };
                        str=create.html(dataStr);
                    }

                    var mainStr='<div class="selector-main down">'+config.header+'<div class="selector-list">'+str+'</div></div>';

                    $body.append(mainStr);

                    //设置变量
                    create.setParams();

                    //添加遮罩

                    create.mask();

                    //添加线
                    create.line();

                    //设置高度
                    selector.list.height(config.height*config.line);
                },
                //设置变量
                setParams:function(){
                    selector.main=$body.find('.selector-main');
                    selector.list=selector.main.find('.selector-list');
                    // selector.inputBox=$input.data('input')?$($input.data('input')):$input;
                    selector.confirm=selector.main.find('.selector-confirm');
                    selector.cancel=selector.main.find('.selector-cancel');
                    selector.inputBox=$input.data('input')?$($input.data('input')):$input;

                    selector.listUl=selector.list.find('.selector-list-ul');
                    selector.listUl.width(ulWidth[config['level']-1]);
                    //
                    selector.level1=selector.listUl.eq(0);
                    if(config.level===2){
                         selector.level2=selector.listUl.eq(1);
                    }

                },
                //设置线的位置
                line:function(){
                    if(selector.list.find('.selector-line').length===0){
                        selector.list.append($line);
                    }
                    $line=selector.list.find('.selector-line');
                    $line.height(config.height);

                    //line位置设置
                    var lineMarginTop=config.line%2===0?-config.height+'px':-config.height*0.5+'px';

                    $line.css({
                        'margin-top':lineMarginTop
                    })
                },
                //创建遮罩
                mask:function(){
                    if($('.selector-mask').length===0){
                        $body.append($mask);
                    }
                    selector.mask=$('.selector-mask');

                },
                //拼接html
                html:function(data){
                    var str='';
                    for (var i = 0; i < data.length; i++) {
                        var html='';
                        $.each(data[i],function(index,val){
                            html+='<li data-value="'+val.value+'" data-id="'+index+'">'+val.name+'</li>';
                        });
                        str+='<ul class="selector-list-ul">'+html+'</ul>';
                    };
                    return str;
                },
                //li拼接
                htmlLi:function(data){
                    var str='';
                    $.each(data,function(index,val){
                        str+='<li data-value="'+val.value+'" data-id="'+index+'">'+val.name+'</li>';
                    });
                    return str;
                }

            }

            //选择操作
            var linkMethods={
                //操作一级
                chooseOne:function(id){
                    linkMethods.level2(id);
                },
                //获得2级html
                level2:function(index){
                    //兼容不存在child
                    var data=childData(config['dataLink'][index]);

                    if(config.level===2){
                        var str=create.htmlLi(data);
                        selector.level2.html(str);
                        set(selector.level2,0);
                    }

                },
                //设置位置
                init:function(id){
                    var id1=id2;
                    var id1=id[0]?id[0]:0;
                    var id2=id[1]?id[1]:0;
                    set(selector.level1,id1);
                    if(config.level===2){
                        set(selector.level2,id2);
                    }
                },
                //联动－设置位置
                initLink:function(id){
                    var id1=id2;
                    var id1=id[0]?id[0]:0;
                    var id2=id[1]?id[1]:0;
                    linkMethods.chooseOne(id1);
                    set(selector.level1,id1);
                    if(config.level===2){
                        set(selector.level2,id2);
                    }

                }
            };


             //点击打开选择
            $input.on('click',function(e){
                e.preventDefault();
                e.stopPropagation();
                //初始化
                create.init();

                selector.inputBox.focus();
                selector.inputBox.blur();

                selector.main.removeClass('down');
                selector.mask.removeClass('hide');

                //点击确定
                selector.confirm.on('touchstart click',function(e){
                    e.preventDefault();
                    var str='';
                    selector.noFirst=true;
                    $.each(selector.listUl,function(index,ele){
                        var $active=$(ele).find('.active');
                        var splitStr=index===0?'':config.splitStr;
                        if($active.length>0){
                            index=index+1;
                            selector.inputBox.data('value'+index,$active.data('value'));
                            selector.inputBox.data('id'+index,$active.data('id'));
                            str+=splitStr+$active.text();
                        }
                    });
                    selector.inputBox.val(str);
                    deffered.hide();
                    config.confirm();
                })

                //点击取消
                selector.cancel.on('touchstart click',function(e){
                     e.preventDefault();
                    deffered.hide();
                    config.cancel();
                });
                //点击遮罩取消

                selector.mask.on('touchstart click',function(e){
                     e.preventDefault();
                    deffered.hide();
                    config.cancel();
                });



                //显示默认值(点击确定选择后不再获取默认值)
                if(!selector.noFirst&&config.idDefault){
                    var inputVal=selector.inputBox.val().split(config.splitStr);

                    var defaultId=[];
                    var defaultValue=[];
                    if(typeof(inputVal)!=='object'||!inputVal.length||!selector.main){
                        return;
                    }
                    //将name值默认匹配成id，一旦匹配就跳出循环，多个匹配取第一个
                    if(config.Linkpage){
                        //匹配一级
                        nameEach(config['dataLink'],0);

                        //匹配二级
                        if(config.level===2&&defaultId[0]&&inputVal.length>1){
                            var data2=childData(config['dataLink'][defaultId[0]]);
                            nameEach(data2,1);
                        }

                        //设置data-value,data-id
                        for (var i = 0; i < defaultId.length; i++) {
                            selector.inputBox.data('value'+(i+1),defaultValue[i]);
                            selector.inputBox.data('id'+(i+1),defaultId[i]);
                        };
                    }else{
                        for (var i = 0; i < inputVal.length; i++) {
                            var data=(config['data'+(i+1)]);
                            nameEach(data,i);
                        };
                        for (var i = 0; i < defaultId.length; i++) {
                            selector.inputBox.data('value'+(i+1),defaultValue[i]);
                            selector.inputBox.data('id'+(i+1),defaultId[i]);
                        };
                    }
                    //遍历获取id
                    function nameEach(data,index){
                        $.each(data,function(key,val){
                            if(val['name']==inputVal[index]){
                                defaultId[index]=key;
                                defaultValue[index]=val['value'];
                                return false;
                            }
                        });
                    }

                }

                var id=[];
                 //遍历下拉列表
                selector.listUl.each(function(index,ele){
                    //获取高度，滑动范围
                    var pindex=index;
                    var $this=$(ele);
                    var $li=$this.find('li');
                    var oneLiH=config.height;
                    var liH=oneLiH*config.line;
                    var minY=selector.topLine*oneLiH;
                    var ulH;
                    var maxY;

                    //初始化

                    _translateY($this,0);
                    dataVal=selector.inputBox.data('id'+(pindex+1))?selector.inputBox.data('id'+(pindex+1)):0;
                    id.push(dataVal);

                    var _startY;
                    var _curY;
                    var _moveY;
                    var dataVal;

                    $this.on({
                        touchstart: function(event) {
                            event.preventDefault();
                            fnTouches(event);
                            changeTime(0,$this);

                            ulH=$this.height();
                            maxY=liH-ulH-parseInt(config.line/2)*oneLiH;
                            var tranY=getTranslateY($this);

                           _startY = event.touches[0].pageY-tranY;

                           // _lock=1;
                        },
                        touchmove:function(event){
                            event.preventDefault();
                            fnTouches(event);

                            var _translate;

                            _curY = event.touches[0].pageY;

                            _moveY=_curY-_startY;

                            _translate=Math.round(_moveY);
                            //过了
                            _translate=_translate>minY?minY:_translate;
                            _translate=_translate<maxY?maxY:_translate;
                            _translateY($this,_translate);
                            //兼容部分手机有时候没有触发touchend
                            clearTimeout(timeTouchend);
                            timeTouchend=setTimeout(function(){
                                end();
                            },100);
                        },
                        touchend:function(event){
                            event.preventDefault();
                            end();
                        }
                    });

                    function end(){
                        clearTimeout(timeTouchend);
                        var result=set($this);

                        var resultId=result.target.data('id');
                        // _lock=0;
                        //点第一个联动
                        if(config.Linkpage&&pindex===0){
                            linkMethods.chooseOne(resultId);
                        }
                        //回调函数
                        fnName[pindex].call($this,result);

                        changeTime(200,$this);
                    }
                });

                //获得选中的元素
                if(config.Linkpage){
                    linkMethods.initLink(id);
                }else{
                    linkMethods.init(id);
                }
            })


            //禁止滚动－－防止滚动选择时页面滚动
            $body.on({
                touchstart:function(event){
                    event.preventDefault();
                     _lock=1;
                },
                touchmove:function(event){
                    event.preventDefault();
                    //兼容部分手机有时候没有触发touchend
                    clearTimeout(timeTouchend);
                    timeTouchend=setTimeout(function(){
                        _lock=0;
                    },100);
                },
                touchend:function(event){
                    event.preventDefault();
                     _lock=0;
                }
            },'.selector-main');


            //滑动结束，设置transtion
            function set(obj,val){
                var result;
                var y=Math.round((getTranslateY(obj)/config.height));
                //得到选中的index
                var index=typeof(val)==='number'?obj.find('li').index(obj.find('li[data-id="'+val+'"]')):selector.topLine-y;

                var y2=-config.height*(index-selector.topLine);

                _translateY(obj,y2);
                //添加选中样式
                obj.find('li').eq(index).addClass('active').siblings('li').removeClass('active');

                result={
                    target:obj.find('li').eq(index),
                    index:index
                }
                return result;
            }
            //取消
            // function cancel(e){
            //     e.preventDefault();
            //     deffered.hide();
            //     config.cancel();
            // }


            //兼容不存在child
            function childData(data){
                var result=[];
                if(!data){
                    return;
                }
                $.each(data,function(key,val){
                    if(key=='child'){
                        result=data.child;
                    }
                })

                return result;
            }

            //改变时间
            function changeTime(times,obj){
                obj.css({
                    '-webkit-transition-duration': times+'ms',
                    'transition-duration': times+'ms'
                });
            };

            // touches兼容
            function fnTouches(e){
                if(!e.touches){
                    e.touches = e.originalEvent.touches;
                }
            };

            //设置translate
            function _translateY(obj,y){
                obj.css({
                    "-webkit-transform":'translateY('+ y+'px)',
                    transform:'translateY('+ y+'px)'
                });
            };

            //获取translate
            function getTranslateY(obj){
                var transZRegex = /\.*translateY\((.*)px\)/i;
                var result;
                if(obj[0].style.WebkitTransform){
                    result=parseInt(transZRegex.exec(obj[0].style.WebkitTransform)[1]);
                }else if(obj[0].style.transform){
                    result=parseInt(transZRegex.exec(obj[0].style.transforms)[1]);
                }
                return result;
            };

            deffered={
                show:function(){
                    $input.trigger('touchstart');
                },
                hide:function(){
                    selector.mask.addClass('hide');
                    selector.main.addClass('down selector-hide').transitionEnd(function (e) {
                        selector.main.remove();
                        selector.mask.remove();
                    });
                },
                updateData:function(data){
                    if(!data.length){
                        return;
                    }
                    selector.noFirst=false;
                    for (var i = 0; i < config.level; i++) {
                        selector.inputBox.data('id'+(i+1),0);
                        selector.inputBox.data('value'+(i+1),'');
                    };

                    if(config.Linkpage){
                        config.dataLink=data;
                        return;
                    }
                    for (var i = 1; i <= data.length; i++) {
                        if(i>config.level){
                            return;
                        }
                        config['data'+i]=data[i-1];
                    };
                }
            }

            return deffered;
        }
    }
    $.fn.selectList = function() {
        var method = arguments[0];
        if (methods[method]) {
            method = methods[method];
            // 将arguments转成数组
            arguments = Array.prototype.slice.call(arguments, 1);
        } else if (typeof(method) == 'object' || !method) {
            method = methods.init;
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.layer Plugin');
            return this;
        }
        return method.apply(this, arguments);
    }
}(jQuery));