define(function (require, exports, module) {
    var $ = require('jquery');
    var raphaelTP = $('#raphaelTP');
    var bxPoint = $('#bxPoint');
    var imgA = $('#imgA10086'), maptt = $('#maptt');
    var canvasN, configJson, viewBOX_w = 3100, viewBOX_h = 2500,
        rectW = 5, rectH = 5, radius = 8, sbW = 16, sbH = 24;//坐标系矩形宽高、画圆的半径 设备大小
    var rapAll = [];//存放页面rect元素的“画”对象
    var taskJson={
        sRect:[],//起点，共2个数组元素
        eRect:[],//终点，共2个数组元素
        isRect:false,//是否画矩形
        isClsRect:false//是否清除矩形障碍物
    };
    var allRoute=[];//存放某个人的所有时间的走过的点。
    var interId,totalP= 0,totF=0;//人物定时器..totalP统计多少次没有人的的坐标.totF 获取所有人路线的统计
    var tipsHegith=100;//tips层的高度
    function ajaxT(obj){
        $.ajax({
            type: obj.type,url: obj.url,data:obj.data,contentType:'application/text',dataType:'json',
            success: function(daT2){
                obj.fn(daT2);
            }
        })
    }

    function pHTML(data){
        var shopP=[],strD='';
        console.log('获取某屏 停留时间:',data);
        if(data.result=='there is no data'){return false;}
        if(!(data instanceof Array)){shopP.push(data);}else{shopP= data;}

        for(var j=0;j<shopP.length;j++){
            var curr=shopP[j];
            strD+='screenName:'+(curr.screenName||'')+' deviceSerial:'+(curr.deviceSerial||'')+' 停留：'+(parseInt(curr.remainTime)/1000||0)+'分钟<br/>';
        }
        $('#screenList .cntUser').html(strD);
    }
    function clsImage(thatObj){//初始化，清掉已有的，画出设备的。
        $('circle,path,image').remove();//清除掉已有的路线和画的点。故设备坐标用图，则为image svg，而人则为时刻获取。
        thatObj.sbPos(window.targetSb,{src:'images/t3.png',w:30,h:30});//恢复设备的坐标
    }

    function unique(arr){//去重
        var result=[];
        var o=[];
        for(var i=0;i<arr.length;i++){
            var v=arr[i];
            if(!o[v]){
                o[v] = true;
                result.push(v);
            }
        }
        return result;
    }

    function DrawPointer() {
        this.girdArr = [];//存放生成的网格二维数组
        this.currFlag = 0;//存放当前‘起点、终点、障碍点’标志
    }
    DrawPointer.prototype = {
        resetData: function (configJson, cmd, drawId) {//初始化基本数据
            var that = this;
            console.log('configJson:', configJson);
            that.rapAll = [];
            configJson.girdSize = configJson.girdSize || '20,20';
            configJson.scale = configJson.scale || 5000;

            configJson.PPI = 96;
            configJson.inchesM = 0.0254;

            //configJson.zoomImg=1;
            configJson.zoomImg = configJson.bj_draw.zoom;
            console.log('configJson.zoomImg:', configJson.zoomImg);

            configJson.uuidArr = configJson.uuidArr;
            configJson.canvas.w = configJson.bj_draw.w;
            configJson.canvas.h = configJson.bj_draw.h;

            //configJson.resolution = configJson.scale * configJson.inchesM / configJson.PPI;//地图分辨率
            configJson.resolution=configJson.scale;//暂时写死..不使用地图分辨率

            that.configJson = configJson;
            console.log('222configJson:', configJson, configJson.resolution);

            canvasN = Raphael('bxPoint', configJson.canvas.w, configJson.canvas.h);
            imgA.find('img').attr({width: configJson.bj_draw.w, height: configJson.bj_draw.h, src: configJson.bj_draw.src});
            //imgA.find('svg').attr({width: configJson.bj_draw.w, height: configJson.bj_draw.h});

            $('#wrapRapGird,#raphaelTP,#maptt,#bxPoint,#imgA10086,#imgA10086 svg').css({width: configJson.canvas.w + 'px', height: configJson.canvas.h + 'px'});
            //#imgA10086 svg 无它设置则显示大小及位置出错。。如前面的：Raphael('bxPoint', configJson.canvas.w, configJson.canvas.h);

            var circle1 = canvasN.rect(0, 0, configJson.canvas.w, configJson.canvas.h);//
            circle1.attr({"fill": "#fff", "fill-opacity": 0.2,"stroke":"none"}); //填充色
            circle1.node.id = 'layZheZhao';
            var zhezhao = canvasN.rect(0, 0, configJson.canvas.w, configJson.canvas.h);//
            zhezhao.attr({"fill": "#fff", "fill-opacity": 0.2,"stroke":"none"}); //填充色
            zhezhao.node.id = 'zhezhao';//遮罩层，挡住标注开启、关闭

            if (cmd == 'edit') {//'编辑命令'..编辑时会传过来drawId。。
                /**eg:
                 drwaA.resetData(configJson,'edit',ID);//初始化配置文件..id以便删除，更新
                 drwaA.sbPos(sbJson);
                **/
                circle1.click(function (e) {
                    console.log('SS编辑', e.x, e.y, drawId);
                    $('#sb_' + drawId).remove();
                    var circle2 = canvasN.image('images/t2.png', e.x - raphaelTP.offset().left + $(document).scrollLeft(), e.y - $('#raphaelTP').offset().top + $(document).scrollTop(), 16, 24);//var circle1=canvasN.circle(cX,cY,radius);//圆
                    circle2.attr({"fill": "blue", "stroke": "none"});  //填充色\去掉边框
                    circle2.node.id = 'sb_bj';
                });//直接“标注”
            }
            else {// if (cmd == 'create') {//'创建'..为了‘标注’去掉‘编辑’功能
                circle1.click(function (e) {
                    console.log('SS创建', e.x, e.y);
                    $('#sb_bj').remove();
                    var circle2 = canvasN.image('images/t2.png', e.x - raphaelTP.offset().left + $(document).scrollLeft(), e.y - $('#raphaelTP').offset().top + $(document).scrollTop(), 16, 24);//var circle1=canvasN.circle(cX,cY,radius);//圆
                    circle2.attr({"fill": "blue", "stroke": "none"});  //填充色\去掉边框
                    circle2.node.id = 'sb_bj';
                });//直接“标注”
            }
            //'设备分布'无‘标注’功能
            that.evt();
        },
        sumA: function (callback) {//提交‘标注
            var configJson = this.configJson;
            if ($('#sb_bj').length < 1) {
                alert('请选择标注的位置');
                return false;
            }
            var pX = $('#sb_bj').attr('x'), pY = $('#sb_bj').attr('y');
            console.log('标注像素:', pX, pY);
            callback && callback(pX, pY, configJson);
            return false;
        },
        setRect:function(serialnum){//矩形
            var hasQ=taskJson.sRect;
            if(hasQ.length&&hasQ.length==2){//已有起点
                taskJson.eRect.push(parseInt(serialnum[0]),parseInt(serialnum[1]));//终点
                var sMin=Math.min(taskJson.sRect[0],taskJson.eRect[0]),sMax=Math.max(taskJson.sRect[0],taskJson.eRect[0]),
                    eMin=Math.min(taskJson.sRect[1],taskJson.eRect[1]),eMax=Math.max(taskJson.sRect[1],taskJson.eRect[1]);
                for(var m=sMin;m<=sMax;m++){
                    for(var n=eMin;n<=eMax;n++){
                        if(taskJson.isClsRect){
                            $('#F892975_'+m+'_'+n).removeClass();
                        }
                        else{
                           $('#F892975_'+m+'_'+n).addClass('mSleep');
                        }
                    }
                }
                taskJson.sRect=[];
                taskJson.eRect=[];
            }
            else{
                taskJson.sRect.push(parseInt(serialnum[0]),parseInt(serialnum[1]));//起点
            }
        },
        evt: function () {
            var that = this;
            var configJson = that.configJson;
            /********网格相关evt start*******/
            $('#bzStart').unbind('click').click(function(){//标注开启、关闭 （遮罩层，挡住标注开启、关闭）
                var start=$(this).attr('start');
                if(start==1){
                    $(this).attr('start',0).val('标注开启');
                    $('#zhezhao').show();
                }
                else{
                    $(this).attr('start',1).val('标注关闭');
                    $('#zhezhao').hide();
                }
            })//标注开启、关闭 （遮罩层，挡住标注开启、关闭）

            $('#gridStr').unbind('blur').blur(function () {//改变网格数量
                configJson.girdSize = $(this).val();
                var change = $(this).val().split(',');//输入框的值
                that.createGird(change[0], change[1]);//生成网格。。行18 列20
                console.log('改变后原先的障碍点需要重新设置。');
                return false;
            });//改变网格数量
            $('#maptt td').unbind('click').click(function () {
                var serialnum =[], allTd = $('#maptt td'), Oelem = $(this);
                if(!taskJson.isClsRect){//非清除矩形障碍点
                    if (Oelem.hasClass('mStart') || Oelem.hasClass('mEnd') || Oelem.hasClass('mSleep')) {//取消选择
                        Oelem.removeClass();
                        return false;
                    }
                }
                switch (that.currFlag) {
                    case 1:
                        allTd.removeClass('mStart');
                        Oelem.addClass('mStart').attr('serialnum').split(',');
                        break;
                    case 2:
                        allTd.removeClass('mEnd');
                        Oelem.addClass('mEnd').attr('serialnum').split(',');
                        break;
                    case 3:
                        serialnum = Oelem.addClass('mSleep').attr('serialnum').split(',');
                        //console.log('isRect:',taskJson.isRect)
                        if(taskJson.isRect){//矩形设置。
                           that.setRect(serialnum);//设置障碍点
                        }
                        break;
                }
                return false;
            });

            /******不合并start*******/
            $('.cS1').unbind('click').click(function () {//设置起点
                that.currFlag = 1;
                taskJson={isRect:false,sRect:[],eRect:[],isClsRect:false};
                return false;
            });
            $('.cS2').unbind('click').click(function () {//设置终点
                that.currFlag = 2;
                taskJson={isRect:false,sRect:[],eRect:[],isClsRect:false};
                return false;
            });
            $('.cS3').unbind('click').click(function () {//设置障碍物
                that.currFlag = 3;
                taskJson={isRect:false,sRect:[],eRect:[],isClsRect:false};
                return false;
            });
            $('.cS4').unbind('click').click(function () {//设置矩形障碍物
                that.currFlag = 3;
                taskJson={isRect:true,sRect:[],eRect:[],isClsRect:false};
                return false;
            });
            $('.cS5').unbind('click').click(function () {//清除矩形障碍物
                that.currFlag = 3;
                taskJson={isRect:true,sRect:[],eRect:[],isClsRect:true};
                return false;
            });
            /******不合并end*******/
            $('.cancelNet').unbind('click').click(function(){//'擦黑板'
                $('#pointOrGrid').attr('gird','false');
                $('.setPoints').hide();
                $('#maptt').html('').css({'zIndex':-10,opacity:'0'});
                $(this).attr('gird','false').val('擦黑板');
                $('#pointOrGrid').click();
            })//网格'擦黑板'功能

            $('#getZ9').unbind('click').click(function(){//获取障碍点
                that.getBarriers();
                return false;
            })//获取障碍点
            $('#saveZ').unbind('click').click(function(){//保存障碍点
                that.savaBarriers();
                return false;
            })//保存障碍点
            $('#searchLJ').unbind('click').click(function () {//开始查找。。。查找最近路径
                that.ajaxSubmit();
                return false;
            })//查找最近路径
            $('#getCsP').unbind('click').data('close',1).click(function(){//获取场所“人”坐标
                var clo=$(this).data('close');
                if(clo==1){
                    clsImage(that);
                    interId=setInterval(function(){
                        that.psonFun();//获取场所“人”坐标
                    },200);
                    $(this).data('close',0).val('关闭获取“人”坐标');
                }
                else {
                    clearInterval(interId);
                    $(this).data('close',1).val('获取场所“人”坐标');
                    totalP=0;
                }
            })//获取场所“人”坐标
            $("body").delegate("#getPInp", "click", function(){//获取所有人“人”列表
               that.getAllPerson();
            })//获取所有人“人”列表
            $("body").delegate("#screenList .routeSearch strong", "click", function(){//获取某人走过的路线
                var userId=$(this).attr('userId');
                clsImage(that);
                var obj={
                    type: "get",  url: '/getPoints/false',
                    data:{"deviceSerial":userId},
                    fn:function(data){
                        var shopP=[],routeArr=[],routeString='',singleTxtRoute='',selOptTxt='';
                        console.log('单个人:',data.result);
                        if(data.result=='there is no data'){return false;}
                        if(!(data instanceof Array)){
                            shopP.push(data);
                            var m=[data];
                            allRoute=data.concat();//方便某个人使用选择时间点
                        }else{
                            shopP= data;
                            allRoute=data.concat();//方便某个人使用选择时间点..复制。。防止因为shopP的修改而被修改。
                        }
                        //转为路径。
                        console.log('allRoute:',allRoute)
                        shopP.sort(function(a,b){
                            return -(a.timePoint-b.timePoint);
                        });
                        allRoute.sort(function(a,b){
                            return a.timePoint-b.timePoint;
                        });

                        for(var j=0;j<shopP.length;j++){
                            var curr=shopP[j].location[0];//[0]新加的;
                            if(shopP[j].location){
                                var cX = parseInt(parseFloat(curr.x) / configJson.resolution * configJson.zoomImg);//cX单位是px,resolution为1px等于多少mm
                                var cY = parseInt(parseFloat(curr.y) / configJson.resolution * configJson.zoomImg);
                                routeArr.push({x:cX,y:cY,timePoint:shopP[j].timePoint});
                                var nDate=new Date(shopP[j].timePoint);
                                var y=nDate.getFullYear(),m=nDate.getMonth()+ 1,d=nDate.getDate(),
                                    h=nDate.getHours(),m2=nDate.getMinutes(),s2=nDate.getSeconds();
                                singleTxtRoute+='<span msg="直接画线，数据已处理" deviceSerial="'+shopP[j].deviceSerial+'" pxy="'+cX+','+cY+'">'+y+'年'+m+'月'+d+'日'+h+'时'+m2+'分'+s2+'秒'+' 名称：'+shopP[j].deviceName+' 坐标:'+cX+','+cY+'</span><br/>';
                                selOptTxt+='<option timePoint="'+shopP[j].timePoint+'"pos="'+cX+','+cY+'">'+y+'年'+m+'月'+d+'日'+h+'时'+m2+'分'+s2+'秒'+'</option>';
                                if(routeArr.length==1){
                                    routeString='M '+cX+' '+cY;
                                }
                                else{
                                    routeString+=' L '+cX+' '+cY;
                                }
                            }
                        }

                        console.log('此人的路线：',routeArr);
                        if(routeString.length){
                            $('.singleTxtRoute').html(singleTxtRoute);
                            $('.timePath select').html(selOptTxt);
                            that.posWay(routeString);//路线..T
                            //画完下后再加 “圆点”，再次发请求时，需要清除。。。。？？？？？？？？？？？？？？？？？
                            for(var m=0;m<shopP.length;m++){
                                for(var n=0;n<shopP.length;n++){
                                    if(m==n){continue;}
                                    var sour=shopP[m].location[0].x+','+shopP[m].location[0].y;
                                    var curr=shopP[n].location[0].x+','+shopP[n].location[0].y;
                                    if(sour==curr){
                                        shopP.splice(m, 1);//删除数组内已存该位置。
                                        m--;
                                        n--;
                                        m = m < 0 ? 0 : m;
                                        n = n < 0 ? 0 : n;
                                    }
                                }
                            }
                            console.log('forD：',shopP);
                            that.formatData(shopP);
                            console.log('allRoute22:',allRoute,shopP)
                        }
                        else{
                            $('.singleTxtRoute').html('');
                        }
                    }
                }
                ajaxT(obj);
                return false;
            })//获取某人走过的路线

            $('#timeRoute').unbind('click').click(function(){
                var needLineRoute=[];
                var startT=$('.timePath select.selA option:selected');
                var endT=$('.timePath select.selB option:selected');
                console.log(startT,endT)
                var m1=startT.attr('timepoint'),m2=endT.attr('timepoint');
                var c2=Math.max(m1,m2),c1=Math.min(m1,m2);
                console.log('查询时间:',c1,c2,allRoute);

                for(var j=0;j<allRoute.length;j++){//找数据
                    if(allRoute[j].timePoint>=c1&&allRoute[j].timePoint<=c2){
                        needLineRoute.push(allRoute[j]);
                    }
                }
                console.log('所需画线的点：',needLineRoute);
                clsImage(that);
                that.formatData(needLineRoute);

                var singleTxtRoute='',selOptTxt='',routeArr=[];

                for(var j=0;j<needLineRoute.length;j++){//过会合并，拆出来。。
                    var curr=needLineRoute[j].location[0];//[0]新加的;
                    if(needLineRoute[j].location){
                        var cX = parseInt(parseFloat(curr.x) / configJson.resolution * configJson.zoomImg);//cX单位是px,resolution为1px等于多少mm
                        var cY = parseInt(parseFloat(curr.y) / configJson.resolution * configJson.zoomImg);
                        routeArr.push({x:cX,y:cY,timePoint:needLineRoute[j].timePoint});
                        var nDate=new Date(needLineRoute[j].timePoint);
                        var y=nDate.getFullYear(),m=nDate.getMonth()+ 1,d=nDate.getDate(),
                            h=nDate.getHours(),m2=nDate.getMinutes(),s2=nDate.getSeconds();
                        singleTxtRoute+='<span msg="直接画线，数据已处理" deviceSerial="'+needLineRoute[j].deviceSerial+'" pxy="'+cX+','+cY+'">'+y+'年'+m+'月'+d+'日'+h+'时'+m2+'分'+s2+'秒'+' 名称：'+needLineRoute[j].deviceName+' 坐标:'+cX+','+cY+'</span><br/>';
                        selOptTxt+='<option timePoint="'+needLineRoute[j].timePoint+'"pos="'+cX+','+cY+'">'+y+'年'+m+'月'+d+'日'+h+'时'+m2+'分'+s2+'秒'+'</option>';
                        if(routeArr.length==1){
                            routeString='M '+cX+' '+cY;
                        }
                        else{
                            routeString+=' L '+cX+' '+cY;
                        }
                    }
                }

                console.log('此人的路线：',routeArr);
                if(routeString.length){
                    $('.singleTxtRoute').html(singleTxtRoute);
                    that.posWay(routeString);//路线..T
                }
                else{
                    $('.singleTxtRoute').html('');
                }

                //去重//擦掉过去的 succ //画线 succ//画点 succ。
                return false;
            });

            $("body").delegate("#screenList .totalTime .titScreen strong", "click", function(){//获取某屏 停留时间
                var screen=$(this).attr('screen');
                $('#screenList .cntUser').html('');
                var obj={
                    type: "get",  url: '/getRemainTime',data:{"screenName":screen},
                    fn:function(data){
                        pHTML(data);
                    }
                }
                ajaxT(obj);
                return false;
            })//获取某屏 停留时间

            /********网格相关evt end*******/
        },
        sbPos: function (uuidArr, imgJson) {//设备坐标（更新一次）
            var that = this, imgJ;
            var configJson = that.configJson;
            console.log('imgJson:',uuidArr,imgJson);
            if (imgJson) {
                imgJ = {src: imgJson.src || 'images/t3.png', w: imgJson.w || sbW, h: imgJson.h || sbH}
            }
            else {
                imgJ = {src: 'images/t3.png', w: sbW, h: sbH}
            }

            for (var m in uuidArr) {
                var cX = parseFloat(uuidArr[m].x) / configJson.resolution * configJson.zoomImg;
                var cY = parseFloat(uuidArr[m].y) / configJson.resolution * configJson.zoomImg;
                var msg='';
                console.log('sbpos-XY:End-PX:', cX, cY, ' zoomImg:', configJson.zoomImg);
                if(isNaN(cX)||isNaN(cY)){//去掉计算错误的设备
                    continue;
                }
                var circle1 = canvasN.image(imgJ.src, cX, cY, imgJ.w, imgJ.h);//var circle1=canvasN.circle(cX,cY,radius);//圆
                circle1.attr({"fill": "blue"})  //填充色
                    .attr("stroke", "none")   //去掉边框
                    .data('dt', {x: cX, y: cY, 'deviceSerial': m})
                    .hover(function (e) {
                        msg = '设备名称:' + this.data('dt').deviceSerial + ' 坐标 X:' + this.data('dt').x + ' Y:' + this.data('dt').y;
                        var x=e.x - raphaelTP.offset().left + $(document).scrollLeft(),
                            y= e.y - $('#raphaelTP').offset().top + $(document).scrollTop();
                        if(x+parseInt($('#tips').width())>=configJson.canvas.w){//提示层显示到画布外
                            x-=parseInt($('#tips').width());
                        }
                        if(y+parseInt($('#tips').height())>=configJson.canvas.h){//提示层显示到画布外
                            y-=parseInt($('#tips').height());
                        }
                        $('#tips').html(msg).show().css({left:x+'px',top:y+'px'});
                    }, function () {
                        $('#tips').hide();
                    });
                var dt = circle1.data('dt');
                circle1.node.id = 'sb_' + dt.deviceSerial;
                circle1.node.setAttribute('msg', msg);
            }
        },
        formatData: function (postData) {//格式化成可用数据
            var that = this;
            var currData = that.source_Send = postData,
                fotData = [];
            console.log('need Format2:', currData)
            for (var i = 0; i < currData.length; i++) {
                if ((!!currData[i].deviceSerial) && (!!currData[i].location)) {//3个字段必须有
                    if ((currData[i].location.length > 0) && !!currData[i].location[0].x && (!!currData[i].location[0].y)) {
                        fotData.push(currData[i]);
                    }
                }
            }
            that.fotData = fotData;
            console.log('format：', fotData);
            that.delNode();//删除重复节点（即更新某人新位置）
        },
        delNode: function () {//删除页面已有的,更新新的。(原有的是该人的旧坐标，该人现更新为新坐标)
            var that = this;
            for (var k = 0; k < that.fotData.length; k++) {//新来的
                 for (var m = 0; m < that.rapAll.length; m++) {//已有的node
                    if (that.fotData[k].deviceSerial == that.rapAll[m].node.getAttribute('id')) {//删除某个节点。
                        that.rapAll[m].remove();//删除svg上的位置
                        that.rapAll.splice(m, 1);//删除数组内已存该节点
                        m--;
                        m = m < 0 ? 0 : m;
                        console.log('del:', that.rapAll);
                    }
                }
            }
            that.circleD();
        },
        circleD: function () {//添加新节点
            var that = this;
            var fotData = that.fotData;
            if (!fotData || fotData.length < 1) {
                console.log('no data');
                return;
            }
            for (var j = 0; j < fotData.length; j++) {
                that.posAB(j, fotData);
            }
        },
        posAB: function (j, fotData) {//人的坐标（更新N次）
            var that = this;
            var configJson = that.configJson;
            var curr = fotData[j];
            var cX = fotData[j].location[0].x,
                cY = fotData[j].location[0].y,
                msg='';

            console.log('XY:source-M:', cX, cY);
            cX = parseFloat(cX) / configJson.resolution * configJson.zoomImg;//cX单位是px,resolution为1px等于多少mm
            cY = parseFloat(cY) / configJson.resolution * configJson.zoomImg;
            console.log('XY:End-PX:', cX, cY, ' zoomImg:', configJson.zoomImg);
           // var circle1 = canvasN.circle(cX, cY, radius);//圆
            var circle1 = canvasN.image('images/ico_p.png', cX, cY, 20, 20);//var circle1=canvasN.circle(cX,cY,radius);//圆
                circle1.attr({"fill": "#f20bda"})  //填充色
                    .attr("stroke", "none")   //去掉边框
                    .data('dt', {x: cX, y: cY, timePoint: curr.timePoint, 'deviceSerial': curr.deviceSerial})
                    .hover(function (e) {
                        var dt = this.data('dt'),singleTxtRoute='';
                        var nDate=new Date(dt.timePoint);
                        var y=nDate.getFullYear(),m=nDate.getMonth()+ 1,d=nDate.getDate(),
                            h=nDate.getHours(),m2=nDate.getMinutes(),s2=nDate.getSeconds();
                        singleTxtRoute+=y+'年'+m+'月'+d+'日'+h+'时'+m2+'分'+s2+'秒';
                        msg =curr.deviceSerial + ' 坐标 X:' + dt.x + ' Y:' + dt.y + ' 时间:' + singleTxtRoute +' ' ;
                        var x=e.x - raphaelTP.offset().left + $(document).scrollLeft(),
                            y= e.y - $('#raphaelTP').offset().top + $(document).scrollTop();

                        if(x+parseInt($('#tips').width())>=configJson.canvas.w){//提示层显示到画布外
                            x-=parseInt($('#tips').width());
                        }
                        if(y+parseInt($('#tips').height())>=configJson.canvas.h){//提示层显示到画布外
                            y-=parseInt($('#tips').height());
                        }

                        $('#tips').html(msg).show().css({left:x+'px',top:y+'px'});
                        circle1.node.setAttribute('qq',22);
                    }, function () {
                        $('#tips').hide();
                    })
                    .click(function(e){
                        $('#screenList .cntUser').html('');
                        var obj={
                            type: "get",  url: '/getRemainTime',
                            data:{"deviceSerial":this.data('dt').deviceSerial},
                            fn:function(data){
                                pHTML(data);
                            }
                        }
                        ajaxT(obj);
                    });
            circle1.node.id = curr.deviceSerial;

            //var anim2 = Raphael.animation({"fill": "#000"}, Math.random() * 1500 + 300);
            //circle1.animate(anim2.repeat(Infinity));//动画效果
            that.rapAll.push(circle1);
        },
        posWay:function(dataLine){//人物路线。。
           $('#route').remove();//删除过去某个人的路线
            var tetronimo=canvasN.path(dataLine);
            tetronimo.attr({'stroke-width':3,'stroke':'#ff7300'});//测试画路线。。
            tetronimo.node.id = 'route';
        }
    }

    DrawPointer.prototype.tDim = function (m, g) {//生成2维数组
        var tArray = [];
        for (var k = 0; k <m; k++) {
            tArray[k] = [];
            for (var j = 0; j <g; j++) {
                tArray[k][j] = 1;//默认都是路1，障碍为0
            }
        }

        this.girdArr = tArray;//生成网格对应的二维数组并设置每一项为1（路1，障碍为0），动态的
        console.log('this.girdArr:', this.girdArr);
    };//生成2维数组

    DrawPointer.prototype.barriers = function () {//设置表格障碍点...
        var girdArr = this.girdArr;//新网格。。
        if (girdArr.length < 1) {
            alert('请生成网格!');
            return false;
        }
        console.log('设置表格障碍点', girdArr);
        //var girdArr=[[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1],[1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1],[1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,0,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];
        for (var k = 0, L = girdArr.length; k < L; k++) {
            var currArr = girdArr[k];
            if(currArr){
                for (var j = 0; j < currArr.length; j++) {
                    if (currArr[j] == "0") {//默认都是路1，障碍为0
                        $('#F892975_' + k + '_' + j).addClass('mSleep');
                    }
                }
            }
        }
        return false;
    };//设置表格障碍点...
    DrawPointer.prototype.getBarriers = function (callback) {//	获取障碍点
        var that = this;
        console.log('ajax获取障碍点 start');
        $('#maptt td').removeClass();
        var obj={
            type: "get",  url: '/getGraphMatrix/'+($('#graphId').val()||'graph'),
            fn:function(data){
                console.log('获取障碍点', data);
                if (data) {
                    that.girdArr=data;
                    that.barriers();//将ajax获取的障碍点放到网格上
                }
            }
        }
        ajaxT(obj);
        return false;
    };//获取障碍点
    DrawPointer.prototype.savaBarriers=function(callback){//保存障碍点
        var that = this;//var girdArr=drwaA.girdArr;//需要判断是否已经生成网格。
        var gridStr = $('#gridStr').val().split(',')
        that.tDim(gridStr[0], gridStr[1]);
        console.log('saveF:',that.girdArr);
        var mSleep=$('#maptt td.mSleep');
        for(j=0;j<mSleep.length;j++){//mSleep障碍物的点一开始ajax获取到的。。
            var k=mSleep.eq(j).attr('serialnum').split(',');
            that.girdArr[k[0]][k[1]]=0;
        }
        console.log('save:',that.girdArr);

        var obj={
            type: "post",  url: '/saveGraphMatrix',
            data:JSON.stringify({"graphName":$('#graphId').val()||"graph","graphMatrix":that.girdArr }),
            fn:function(data){
                console.log('saveGraphMatrix:',data);
                alert(data.result);
                callback&&callback();
            }
        }
        ajaxT(obj);
    }//保存障碍点

    DrawPointer.prototype.createGird = function (hL, zL) {//生成网格
        var that = this;
        var tdH = parseInt(imgA.css('height')) / zL-1;//hL横向个数 纵向个数 zL...1px:border
        var tdW = parseInt(imgA.css('width')) / hL-1;
        console.log('sdf:',imgA.css('width'), imgA.css('height'), tdW, tdH, hL, zL);//124 100
        $('#maptt').html('<table style="width:' + parseInt(imgA.css('width')) + 'px;height:' + parseInt(imgA.css('height')) + 'px;" cellspacing="0" cellpadding="0" border="0" id="tabBcoll"></table>');
        for (var i = 0, str = ''; i < zL; i++) {
            str += '<tr>';
            for (var j = 0; j < hL; j++) {
                str += ('<td title="'+j+","+i+'" id="F892975_' + j + '_' + i + '" style="height:' + tdH + 'px;width:' + tdW + 'px" serialNum="' + j + ',' + i + '"></td>');
            }
            str += '</tr>';
        }
        $('#maptt table').html(str);
        that.evt();//网格相关事件
        that.tDim(hL, zL);//生成2维数组
    };//生成网格
    DrawPointer.prototype.ajaxSubmit = function (callback) {//	网格..查找路径
        var that = this;
        that.girdArr = [];
        if ($('#gridStr').val().length) {
            var gridStr = $('#gridStr').val().split(',');
            that.tDim(gridStr[0], gridStr[1]);
        }
        else {
            alert('请输入网格数量'); return;
        }
        console.log('new arr:', that.girdArr);
        var mStart = $('#maptt td.mStart'), mEnd = $('#maptt td.mEnd'), mSleep = $('#maptt td.mSleep');
        if (mStart.length != 1 || mEnd.length != 1) {//是否已经有起点 终点
            alert('请选择起点、终点');
            return  false;
        }

        var start = mStart.attr('serialnum').split(',');
        var end = mEnd.attr('serialnum').split(',');

        for (j = 0; j < mSleep.length; j++) {//mSleep障碍物的点一开始ajax获取到的。。
            var k = mSleep.eq(j).attr('serialnum').split(',');
            that.girdArr[k[0]][k[1]] = 0;
        }
        console.log('后台所需数据:', that.girdArr);
        var obj={
            type: "post",  url: '/findPath',
            data:JSON.stringify({"start": {"x": start[0], "y": start[1]}, "end": {"x": end[0], "y": end[1]}, "graphID": "graph", "graphMatrix": that.girdArr }),
            fn:function(data){
                console.log('findPath:', data);
                if (data) {
                    for (var i = 0; i < data.length; i++) {
                        $('#F892975_' + data[i].x + '_' + data[i].y).css({backgroundColor: "#800CF2"});
                    }
                    callback && callback();
                }
            }
        }
        ajaxT(obj);
    }//	网格..查找路径
    DrawPointer.prototype.psonFun=function(){//获取人坐标
        var that=this;
        var obj={
            type: "get",  url: '/getPoints/true',
            fn:function(data){
                var shopP=[];
                if(data.result=='there is no data'){
                    $('.pMsg').html('no person pointXY data:'+(++totalP));
                    return false;
                }
                if(!(data instanceof Array)){
                    shopP.push(data);
                }else{
                    shopP= data;
                }
                that.formatData(shopP);//人。。【可多次调用】
            }
        }
        ajaxT(obj);
    },//获取人坐标
    DrawPointer.prototype.getAllPerson=function(){//获取所有人<坐标>（注意：包含每个人的多次坐标）
        var that=this;
        clsImage(that);
        var obj={
            type: "get",  url: '/getPoints/false',
            fn:function(data){
                var shopP=[],shopP2=[],deviceSerial=[],shtml='',deviceSerialName=[];
                if(data.result=='there is no data'){
                    $('#screenList .routeSearch .cnt .tit').html(data.result+(++totF));
                    return false;
                }
                if(!(data instanceof Array)){
                    shopP.push(data);
                }else{
                    shopP= data;
                }
                for(var m=0;m<shopP.length;m++){
                    deviceSerial.push(shopP[m].deviceSerial);//shopP[m].deviceSerial
                }
                for(var m=0;m<shopP.length;m++){
                    deviceSerialName.push(shopP[m].deviceName);//shopP[m].deviceSerial
                }
                console.log('ajax-res:',shopP);
                shopP=unique(deviceSerial);//设备编号和设备名称是唯一的，不会重复。。故去重可用相对应关系
                shopP2=unique(deviceSerialName);//设备编号和设备名称是唯一的，不会重复。。故去重可用相对应关系
                console.log('res:',shopP);
                for(var j=0;j<shopP.length;j++){
                    shtml+='<strong userId="'+shopP[j]+'">'+shopP2[j]+'</strong>';//设备编号和设备名称是唯一的，不会重复。。故去重可用相对应关系
                }
                $('#screenList .routeSearch .cnt').html(shtml);
            }
        }
        ajaxT(obj);
    }

    exports.DrawPointer = new DrawPointer();

});