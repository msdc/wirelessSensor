define(function(require, exports, module) {
		var $ = require('jquery');  
		var raphaelTP = $('#raphaelTP');
		var imgA = $('#imgA10086');
		var canvasN,configJson,
			rectW = 5, rectH = 5, radius = 8, sbW = 20, sbH = 20;//坐标系矩形宽高、画圆的半径 设备大小
		var rapAll = [];//存放页面rect元素的“画”对象

		function DrawPointer() {}
		DrawPointer.prototype = {
			resetData:function(configJson){//初始化基本数据
				var that=this;
				that.rapAll=[];
				
				//new add  图片大小为画布大小...
				configJson.canvas.w=configJson.bj_draw.w;
				configJson.canvas.h=configJson.bj_draw.h;
				
				canvasN = Raphael('raphaelTP', configJson.canvas.w, configJson.canvas.h);
				configJson.resolution = configJson.scale * configJson.inchesM / configJson.PPI;//地图分辨率
				
				that.configJson=configJson;
				configJson.zoomImg=1;
				
				imgA.attr({width: configJson.bj_draw.w, height: configJson.bj_draw.h, src: configJson.bj_draw.src});
				raphaelTP.css({width: configJson.canvas.w + 'px', height: configJson.canvas.h + 'px'});

			},
			evt: function () {
				var that = this;
				var configJson=that.configJson;
				$('#addBZ').unbind('click').click(function () {
					$('#maptt').html(' ').css({'zIndex':-10,opacity:'0'});
					$('#raphaelTP').click(function (e) {
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
					if(isNaN(sLeft)||isNaN(sTop)){alert('请选择标注的位置');return false;}
					console.log(sLeft - Odoc.left, sTop - Odoc.top);
					var pX = sLeft - Odoc.left, pY = sTop - Odoc.top//当前坐标系上的坐标
					alert('sumitServer:' + pX * configJson.resolution / configJson.zoomImg + '米*' + pY *configJson.resolution * configJson.zoomImg + '米 当前坐标系上的坐标' + pX + '*' + pY)
					return false;
				})
			},
			coordinate: function () {//坐标系（更新一次）
				var that = this;
				var configJson=that.configJson;
				
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
			},
			sbPos: function () {//设备坐标（更新一次）
				var that = this;
				var configJson=that.configJson;
				var uuidArr = configJson.uuidArr;
				
				for (var m in uuidArr) {
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
				console.log('need Format:',currData)	
				for(var i=0;i<currData.length;i++){
					if((!!currData[i].deviceID)&&(!!currData[i].timePoint)&&(!!currData[i].beaconCalculatePosition)){//3个字段必须有
						if((currData[i].beaconCalculatePosition.length>0)&&!!currData[i].beaconCalculatePosition[0].x&&(!!currData[i].beaconCalculatePosition[0].y)){
							 fotData.push(currData[i]);
						}
					}
				}
				that.fotData = fotData;
				console.log('format：', fotData);
			},
			delNode: function () {//删除页面已有的,更新新的。(原有的是该人的旧坐标，该人现更新为新坐标)
				var that = this;
				for (var m = 0; m < that.rapAll.length; m++) {//已有的node
					for (var k = 0; k < that.fotData.length; k++) {//新来的
						if (that.fotData[k].deviceID == that.rapAll[m].node.getAttribute('id')) {//删除某个节点。
							that.rapAll[m].remove();//删除svg上的位置
							that.rapAll.splice(m, 1);//删除数组内已存该节点
							m--;
							m=m<0?0:m;
							console.log('del:',that.rapAll);
						}
					}
				}
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
				var configJson=that.configJson;
				
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
				that.rapAll.push(circle1);
			}
		}

	exports.DrawPointer = DrawPointer;
	
});