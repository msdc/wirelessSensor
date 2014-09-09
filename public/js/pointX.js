define(function(require, exports, module) {
    var $ = require('jquery');
    var Raphael = require('raphael-debug');
    var interId,totalP=0;//人物定时器..totalP统计多少次没有人的的坐标
    /***API
     drwaA.resetData(configJson);//初始化配置文件..必须。。
     drwaA.sbPos(sbJson);//设备坐标或商家的位置 【可多次调用】.所需数据在configJson.uuidArr中
     drwaA.formatData(shopP);//人。。【可多次调用】
     **/

    /***API
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

        var sbJson={
            'E2C56_0_62': {x:400.00, y:2300.00},
            'E2C56DB_0_12': {x: 870.00, y:2300.00},
            'E2C56DB_0_14': {x: 1330.00, y:2300.00}
        }// x、y 单位为svg图的px   .E2C56DB5-DFFB-48D2-B060-D0F5A71096E0_0_1为设备名称

        var drwaA = require('locationCanvas.js').DrawPointer;
        drwaA.resetData(configJson);//初始化配置文件   x、y 单位为svg图的px

        drwaA.sbPos(sbJson,{src:'images/t3.png',w:50,h:50});//换一个图片，代表不同的用途
        drwaA.formatData(shopP);//人。。【可多次调用】

        //功能：获取“人”列表

        $("body").delegate("#presonList strong", "click", function(){
           var userId=$(this).attr('userId');
           //需要添加。。ajax...
           if(userId==1){
               drwaA.posWay('M 150 150 L 200 250 L 130 0 L 400 350 L 200 300');//路线..T
           }
           else{
               drwaA.posWay('M 350 150 L 500 250 L 230 200 L 300 250 L 500 300');//路线..T
           }
       })//获取某人走过的路线

        $('#submitBZ').unbind('click').click(function () {//提交“标注”
            function opt(pX,pY,configJson){//接收当前坐标，并计算alert
                //ajax请求。。具体请求根据接口。。
                alert('sumitServer:' + pX * configJson.resolution / configJson.zoomImg + 'px*' + pY *configJson.resolution/ configJson.zoomImg + 'px 当前坐标系上的坐标' + pX + '*' + pY)
            };
            drwaA.sumA(opt);
        })



        function pathFun(graphId,configJson){//路径功能
            if($('#gridStr').val().length<1){alert('请选择网格数量');return false;}

            $('#gridStr').val(configJson.girdSize||'20,20');
            var change=$('#gridStr').val().split(',');//存放格子的数量

            drwaA.createGird(change[0],change[1]);//生成网格。。eg：行18 列20

            drwaA.getBarriers(graphId,function(){
                drwaA.barriers();//将ajax获取的障碍点放到网格上
            });//获取障碍点。
        }
        $('#pointOrGrid').data('gird','false').click(function(){//暂时放到这里。。 切换 网格 or 坐标系 初始化为‘坐标系’，无“寻径”功能
            var gird=$(this).data('gird');
            if(gird=='false'){//change gird
                $('.setPoints').show();
                $('#maptt').show().css({'zIndex':10,opacity:'0.2'});
                $(this).data('gird','true').val('关闭“寻径”功能');//启动“寻径”功能

                pathFun($('#graphId').val(),configJson);//路径功能..
                //参数为ajax提交的参数.configJson为配置文件
            }
            else{
                $('.setPoints').hide();
                $('#maptt').html('').css({'zIndex':-10,opacity:'0'});
                $(this).data('gird','false').val('启动“寻径”功能');
            }
            return false;
        })

        $("body").delegate("#saveZ", "click", function(){
            //var girdArr=drwaA.girdArr;//需要判断是否已经生成网格。
            var gridStr = $('#gridStr').val().split(',')
            drwaA.tDim(gridStr[0], gridStr[1]);
            console.log('saveF:',drwaA.girdArr);
            var mSleep=$('#maptt td.mSleep');
            for(j=0;j<mSleep.length;j++){//mSleep障碍物的点一开始ajax获取到的。。
                var k=mSleep.eq(j).attr('serialnum').split(',');
                drwaA.girdArr[k[0]][k[1]]=0;
            }
            console.log('save:',drwaA.girdArr);

            $.ajax({
                type: "post",
                url: '/saveGraphMatrix',
                contentType:'application/text',
                data:JSON.stringify({"graphName":$('#graphId').val()||"graph","graphMatrix":drwaA.girdArr }),
                dataType:'json',
                success: function(data){
                    console.log('saveGraphMatrix:',data);
                    alert(data.result)
                }
            });
            return false;
        })//保存障碍点

        $("body").delegate("#getZ9", "click", function(){
            $.ajax({
                type: "get",
                url: '/getGraphMatrix/'+$('#graphId').val(),
                contentType:'application/text',
                dataType:'json',
                success: function(data){
                    console.log(data);
                    drwaA.girdArr=data;
                    drwaA.barriers();//将ajax获取的障碍点放到网格上
                }
            });
            return false;
        })//获取障碍点
        function psonFun(){
            $.ajax({
                type: "get",
                url: '/getPoints/true',
                dataType:'json',
                success: function(data){
                    var shopP=[];
                    if(data.result=='there is no data'){
                        $('.pMsg').html('no person pointXY:there is no data:'+(++totalP));
                        return false;
                    }
                    if(!(data instanceof Array)){shopP.push(data);}else{shopP= data;}
                    drwaA.formatData(shopP);//人。。【可多次调用】
                }
            });
        }
        $('#getCsP').data('close',1).click(function(){
            var clo=$(this).data('close');
            if(clo==1){
                interId=setInterval(function(){
                    psonFun();
                },200);
                $(this).data('close',0).val('关闭获取“人”坐标');
            }
            else {
                clearInterval(interId);
                $(this).data('close',1).val('获取场所“人”坐标');
                totalP=0;
            }
        })

    })//jq end
});