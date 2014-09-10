define(function(require, exports, module) {
    var $ = require('jquery');
    var Raphael = require('raphael-debug');
    /***API
     drwaA.resetData(configJson);//初始化配置文件..必须。。
     drwaA.sbPos(sbJson,{src:'images/t3.png',w:30,h:30});//设备坐标或商家的位置 【可多次调用】.所需数据在configJson.uuidArr中
     drwaA.formatData(shopP);//人。。【可多次调用】
     **/

    /***API..不使用了。
     drwaA.createGird(configJson,20,20);//生成网格。。行18 列20
     drwaA.ajaxSubmit({url:'/saveGraphMatrix',graphName:'firstTestGraph'},fn);//路径ajax提交的url和succ后执行的函数
     ajax 获取的二维数组（障碍点数组）：障碍点数组长短与网格完全一样。
     drwaA.barriers(障碍点数组);//条件：需要先生成网格，然后这里讲障碍点数组在网格上体现。
     **/


    $(function(){
        var raphaelTP = $('#raphaelTP');
        /*** 实际尺寸：2450 mm		图上像素：233.275 px   图上毫米：82.294 mm		图上厘米：8.2294 cm **/
        //get
        var configJson={
            canvas:{w:1240,h:1000},
            bj_draw:{w:1240,h:1000,src:'2.jpg',zoom:0.4},//缩放0.4
            scale:1,//2450/233.275,  //比例尺eg：1/5000。。 //3100*2500    w:1240,h:1000 ..1px等于多少mm
            girdSize:'124,100'//格子数量 eg：默认20*20
        };
        var shopP = [
            {"deviceSerial":"F2LJMKYDDTWD","deviceName":"Ning’s iPhone","timePoint": "2014-9-23 00:00:00:0885","location":[{"x":429.36,"y":412.02}]},
            {"deviceSerial": 'dSl',"deviceName":"Ning’s iPhone","timePoint": "2014-9-23 00:00:00:0885","location": [{"x": "539", "y": "439"}]}
        ];//后台返回的数据格式. /**最新：（代替shopP）{"deviceSerial":"F2LJMKYDDTWD","deviceName":"Ning’s iPhone","location":[{"x":29.36,"y":12.02}]}**/


        function targetSb(){//config.js
            var frontStr='E2C56DB5-DFFB-48D2-B060-D0F5A71096E0';
            var points=[];
            points[frontStr + "_0_1"+frontStr + "_0_5"]={x:340.00,y:1977.00};
            points[frontStr + "_0_5"+frontStr + "_0_4"]={x:340.00,y:2022.00};
            points[frontStr + "_0_3"+frontStr + "_0_6"]={x:450.00,y:2225.00};
            points[frontStr + "_0_6"+frontStr + "_0_2"]={x:900.00,y:2225.00};
            points[frontStr + "_0_2"+frontStr + "_0_9"]={x:1350.00,y:2225.00};
            points[frontStr + "_0_9"+frontStr + "_0_8"]={x:1725.00,y:2225.00};
            points[frontStr + "_0_7"+frontStr + "_0_8"]={x:2725.00,y:2150.00};
            return points;
        }
        /***
        var sbJson={
            'E2C56_0_62': {x:430.00, y:2320.00},
            'E2C56DB_0_12': {x: 900.00, y:2320.00},
            'E2C56DB_0_14': {x: 1360.00, y:2320.00}
        }// x、y 单位为svg图的px   .E2C56DB5-DFFB-48D2-B060-D0F5A71096E0_0_1为设备名称
        **/
        var sbJson=targetSb();
        var drwaA = require('locationCanvas.js').DrawPointer;
        drwaA.resetData(configJson);//初始化配置文件   x、y 单位为svg图的px

        drwaA.sbPos(sbJson,{src:'images/t3.png',w:30,h:30});//换一个图片，代表不同的用途
        drwaA.formatData(shopP);//人。。【可多次调用】

        //drwaA.posWay('M 150 150 L 200 250 L 130 0 L 400 350 L 200 300');


        $('#submitBZ').unbind('click').click(function () {//提交“标注”
            function opt(pX,pY,configJson){//接收当前坐标，并计算alert
                //ajax请求。。具体请求根据接口。。
                alert('sumitServer:' + pX * configJson.resolution / configJson.zoomImg + 'px*' + pY *configJson.resolution/ configJson.zoomImg + 'px 当前坐标系上的坐标' + pX + '*' + pY)
            };
            drwaA.sumA(opt);
        })//提交“标注”

        $('#pointOrGrid').unbind('click').data('gird','false').click(function(){// 切换 网格 or 坐标系 初始化为‘坐标系’，无“寻径”功能
            var gird=$(this).data('gird');
            if(gird=='false'){//开启路径功能
                $('.setPoints').show();
                $('#maptt').show().css({'zIndex':10,opacity:'0.2'});
                $(this).data('gird','true').val('关闭“寻径”功能');//启动“寻径”功能

                var gridStr=$('#gridStr');
                if(gridStr.val().length<1){alert('请选择网格数量');return false;}
                gridStr.val(configJson.girdSize||'20,20');//gridStr blur 会修改configJson.girdSize值
                var change=gridStr.val().split(',');//存放格子的数量
                drwaA.createGird(change[0],change[1]);//生成网格。。eg：行18 列20
                $('#getZ9').click();//获取障碍点
            }
            else{
                $('.setPoints').hide();
                $('#maptt').html('').css({'zIndex':-10,opacity:'0'});
                $(this).data('gird','false').val('启动“寻径”功能');
            }
            return false;
        });// 切换 网格 or 坐标系 初始化为‘坐标系’，无“寻径”功能


    })//jq end
});