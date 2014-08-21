$(function () {
    var raphaelTP = $('#raphaelTP');
    var imgA = $('#imgA');
    /**初始化 start**/
    configJson.resolution = configJson.scale * configJson.inchesM / configJson.PPI;//地图分辨率
    console.log('resolution:', configJson.resolution);
    var a1 = Math.max(configJson.bj_draw.w, configJson.bj_draw.h),
        b1 = Math.max(configJson.canvas.w, configJson.canvas.h);
    var c1 = a1 / b1;
    if (c1 > 1) {//先不简化
        configJson.zoomImg = c1;//图片与画布的比例..缩放
        configJson.bj_draw.nW = configJson.bj_draw.w / c1;//缩放后的大小
        configJson.bj_draw.nH = configJson.bj_draw.h / c1;
    }
    else {
        configJson.bj_draw.nW = configJson.bj_draw.w;//
        configJson.bj_draw.nH = configJson.bj_draw.h;
    }

    imgA.attr({width: configJson.bj_draw.nW, height: configJson.bj_draw.nH, src: configJson.bj_draw.src});
    raphaelTP.css({width: configJson.canvas.w + 'px', height: configJson.canvas.h + 'px'});

    var canvasN = Raphael('raphaelTP', configJson.canvas.w, configJson.canvas.h),
        rectW = 5, rectH = 5, radius = 8, sbW = 20, sbH = 20;//坐标系矩形宽高、画圆的半径 设备大小
    var rapAll = [];//存放页面rect元素的“画”对象
    /**初始化 end**/

    window.DrawPointer = function () {}
    DrawPointer.prototype = {
        evt: function () {
            var that = this;
            $('#addBZ').unbind('click').click(function () {
                $('#maptt').html(' ').css({'zIndex':-10,opacity:'0'});
                $('#raphaelTP').click(function (e) {
                    /** 如果有，则移动，如果没有，则添加 **/
                    if ($('.occupying').length) {//暂时不‘添加多个标注’
                        $('.occupying').css({left: e.clientX + 'px', top: e.clientY + 'px'}).show();
                    }
                    else {
                        var Oelem = '<div class="occupying"></div>';
                        $('body').append(Oelem);
                        $('.occupying:last').css({left: e.clientX + 'px', top: e.clientY + 'px'}).show();
                    }
                    return false;
                })
            })
            $('#submitBZ').unbind('click').click(function () {//暂时不‘添加多个标注’
                var sLeft = parseFloat($('.occupying:last').css('left')),
                    sTop = parseFloat($('.occupying:last').css('Top'));
                var Odoc = raphaelTP.offset();
                console.log(sLeft - Odoc.left, sTop - Odoc.top);
                var pX = sLeft - Odoc.left, pY = sTop - Odoc.top//当前坐标系上的坐标
                alert('提交到服务器上的距离' + pX * configJson.resolution / configJson.zoomImg + '米*' + pY * configJson.resolution * configJson.zoomImg + '米 当前坐标系上的坐标' + pX + '*' + pY)
                return false;
            })
        },
        coordinate: function () {//坐标系（更新一次）
            var that = this;
            var xAxisWid = configJson.canvas.w / configJson.canvas.numX,
                yAxisWid = configJson.canvas.h / configJson.canvas.numY;//9*9。+1从0.0点开始。。。。
            for (var j = 0; j < configJson.canvas.numX; j++) {
                for (var n = 0; n < configJson.canvas.numY; n++) {
                    ;(function (n, j) {
                        var rect1 = canvasN.rect(n * xAxisWid, j * yAxisWid, rectW, rectH);//rect(x,y,w,h)
                        rect1.attr({"fill": "#fa0a0a"})  //填充色
                            .attr("stroke", "none")     //去掉底边;
                            .data("i", 'j=' + j + ' n=' + n)
                            .data("m", 'mobile1')
                            .click(function () {
                                console.log('坐标：', rect1.node.id)
                            });
                        rect1.node.id = 'A' + n * xAxisWid + '_' + j * yAxisWid;
                    })(n, j)
                }
            }
            that.sbPos();
            that.evt();
        },
        sbPos: function () {//设备坐标（更新一次）
            var uuidArr = configJson.uuidArr;
            for (var m in uuidArr) {
                console.log('sbpos-XY:Source-PX:', uuidArr[m].x, uuidArr[m].y, ' zoomImg:', configJson.zoomImg);
                var cX = parseFloat(uuidArr[m].x) / configJson.resolution * configJson.zoomImg;
                var cY = parseFloat(uuidArr[m].y) / configJson.resolution * configJson.zoomImg;
                console.log('sbpos-XY:End-PX:', cX, cY, ' zoomImg:', configJson.zoomImg);
                var circle1 = canvasN.image('t1.png', cX, cY, sbW, sbW);//var circle1=canvasN.circle(cX,cY,radius);//圆
                circle1.attr({"fill": "blue"})  //填充色
                    .attr("stroke", "none")   //去掉边框
                    .data('dt', {x: cX, y: cY, 'deviceSerial': m})
                    .hover(function (e) {
                        var str = '设备名称:' + this.data('dt').deviceSerial + ' 坐标 X:' + this.data('dt').x + ' Y:' + this.data('dt').y;
                        $('#tips').css({left: e.clientX + 'px', top: e.clientY + 'px'}).html(str).show();
                    }, function () {
                        $('#tips').hide();
                    });
                var dt = circle1.data('dt');
                circle1.node.id = 'sb_' + dt.deviceSerial;
                circle1.node.setAttribute('msg', '设备名称:' + dt.deviceSerial + ' 坐标 X:' + dt.x + ' Y:' + dt.y);
            }
        },
        formatData: function (postData) {//格式化成可用数据
            var that = this;
            var currData = that.source_Send = postData,
                fotData = [];
            for (var i = 0; i < currData.length; i++) {
                //console.log('checkPoint1:',(!!currData[i].deviceID),(!!currData[i].timePoint),(!!currData[i].beaconCalculatePosition))
                if ((!!currData[i].deviceID) && (!!currData[i].timePoint) && (!!currData[i].beaconCalculatePosition)) {//3个字段必须有
                    //console.log('checkPoint2:',currData[i].beaconCalculatePosition.length>0,!!currData[i].beaconCalculatePosition[0].x,!!currData[i].beaconCalculatePosition[0].y);
                    if ((currData[i].beaconCalculatePosition.length > 0) && !!currData[i].beaconCalculatePosition[0].x && (!!currData[i].beaconCalculatePosition[0].y)) {
                        fotData.push(currData[i]);
                    }
                }
            }
            that.fotData = fotData;
            console.log('format：', fotData);
            that.delNode();
        },
        delNode: function () {//删除页面已有的,更新新的。(原有的是该人的旧坐标，该人现更新为新坐标)
            var that = this;
            for (var m = 0; m < rapAll.length; m++) {//已有的node
                for (var k = 0; k < that.fotData.length; k++) {//新来的
                    if (that.fotData[k].deviceID == rapAll[m].node.getAttribute('id')) {//删除某个节点。
                        rapAll.splice(m, 1);
                        m--;
                        console.log(rapAll);
                    }
                }
            }
            that.circleD();
        },
        circleD: function () {//添加新节点
            var that = this;
            var fotData = that.fotData;
            if (!that.fotData || this.fotData.length < 1) {
                console.log('no data');
                return;
            }
            for (var j = 0; j < fotData.length; j++) {
                that.posAB(j, fotData);
            }
        },
        posAB: function (j, fotData) {//人的坐标（更新N次）
            var that = this;

            var tetronimo=canvasN.path("M 150 150 l 0 150 l 150 0");//路径
            tetronimo.attr({'href':'http://www.baidu.com','stroke-width':3,'stroke':'#ff7300'});

            var curr = fotData[j];
            var cX = fotData[j].beaconCalculatePosition[0].x,
                cY = fotData[j].beaconCalculatePosition[0].y;
            console.log('XY:source-M:', cX, cY);
            cX = parseFloat(cX) / configJson.resolution * configJson.zoomImg;
            cY = parseFloat(cY) / configJson.resolution * configJson.zoomImg;
            console.log('XY:End-PX:', cX, cY, ' zoomImg:', configJson.zoomImg);
            var circle1 = canvasN.circle(cX, cY, radius);//圆
            circle1.attr({"fill": "#f20bda"})  //填充色
                .attr("stroke", "none")   //去掉边框
                .data('dt', {x: cX, y: cY, deviceID: curr.deviceID, timePoint: curr.timePoint, 'deviceSerial': curr.deviceSerial})
                .hover(function (e) {
                    var dt = this.data('dt');
                    var str = '人物名称:' + dt.deviceID + ' 坐标 X:' + dt.x + ' Y:' + dt.y + ' 时间:' + dt.timePoint + ' 设备编号=' + curr.deviceSerial;
                    $('#tips').css({left: e.clientX + 'px', top: e.clientY + 'px'}).html(str).show();
                }, function () {
                    $('#tips').hide();
                });
            var dt = circle1.data('dt');
            circle1.node.id = curr.deviceID;
            circle1.node.setAttribute('msg', '名称:' + dt.deviceID + ' 坐标 X:' + dt.x + ' Y:' + dt.y + ' 时间:' + dt.timePoint + ' 设备编号=' + curr.deviceSerial);
            var anim2 = Raphael.animation({"fill": "#000"}, Math.random() * 1500 + 300);
            circle1.animate(anim2.repeat(Infinity));//动画效果
            rapAll.push(circle1);
        }
    }
    new DrawPointer().coordinate();//设备坐标+坐标系

    /**ajax 后台调用 start**/
    var kTjFormat = [//后台返回的数据格式
        {
            "deviceID": "mobile1",
            "timePoint": "2013-12-23 00:00:00:0001",
            "deviceSerial": 'dS0',
            "beaconCalculatePosition": [
                {"x": "50", "y": "75"}//单位是米
            ]
        },
        {
            "deviceID": "mobile2",
            "timePoint": "2013-12-23 00:00:00:0885",
            "deviceSerial": 'dSl',
            "beaconCalculatePosition": [
                {"x": "639", "y": "639"}
            ]
        },
        {
            "deviceID": "mobile3",
            "timePoint": "2013-12-23 00:00:00:5120",
            "deviceSerial": 'dS2',
            "beaconCalculatePosition": [
                {"x": "38", "y": "123"}
            ]
        },
        {
            "deviceID": "mobile4",
            "timePoint": "2013-12-23 00:00:00:2755",
            "deviceSerial": 'dS3',
            "beaconCalculatePosition": [
                {"x": "140", "y": "50"}
            ]
        }
    ];
    var drawP1 = new DrawPointer();
    drawP1.formatData(kTjFormat);
    /**ajax 后台调用 end**/
})
