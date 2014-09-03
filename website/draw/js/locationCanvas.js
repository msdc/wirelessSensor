define(function(require, exports, module) {
		var $ = require('jquery');  
		var raphaelTP = $('#raphaelTP');
		var bxPoint=$('#bxPoint');
		var imgA = $('#imgA10086'),maptt=$('#maptt');
		var canvasN,configJson,
			rectW = 5, rectH = 5, radius = 8, sbW =16, sbH = 24;//坐标系矩形宽高、画圆的半径 设备大小
		var rapAll = [];//存放页面rect元素的“画”对象

		function DrawPointer() {
			this.girdArr=[];//存放生成的网格二维数组
			this.currFlag=0;//存放当前‘起点、终点、障碍点’标志		
		}
		DrawPointer.prototype = {
			resetData:function(configJson){//初始化基本数据
				var that=this;
				console.log('configJson:',configJson);
				that.rapAll=[];
				configJson.girdSize=configJson.girdSize||'20,20';
				configJson.scale=configJson.scale||5000;
				
				configJson.PPI=96;
				configJson.inchesM=0.0254;
				
				//configJson.zoomImg=1;
				configJson.zoomImg={}
				configJson.zoomImg.x=configJson.bj_draw.w/3100,
				configJson.zoomImg.y=configJson.bj_draw.h/2500;//imgA10086的viewBOX 值
				console.log('configJson.zoomImg:',configJson.zoomImg);
				
				configJson.uuidArr=configJson.uuidArr;
				configJson.canvas.w=configJson.bj_draw.w;
				configJson.canvas.h=configJson.bj_draw.h;
				
				
				configJson.resolution = configJson.scale * configJson.inchesM / configJson.PPI;//地图分辨率
				that.configJson=configJson;
				console.log('222configJson:',configJson,configJson.resolution);
	
				canvasN = Raphael('bxPoint', configJson.canvas.w, configJson.canvas.h);
				imgA.find('img').attr({width: configJson.bj_draw.w, height: configJson.bj_draw.h, src: configJson.bj_draw.src});
				//imgA.find('svg').attr({width: configJson.bj_draw.w, height: configJson.bj_draw.h});
				
				$('#wrapRapGird,#raphaelTP,#maptt,#bxPoint,#imgA10086,#imgA10086 svg').css({width: configJson.canvas.w + 'px', height: configJson.canvas.h + 'px'});
				//#imgA10086 svg 无它设置则显示大小及位置出错。。如前面的：Raphael('bxPoint', configJson.canvas.w, configJson.canvas.h);
				that.evt();
			},
			sumA:function(callback){//提交‘标注
				var configJson=this.configJson;
				var sLeft = parseFloat($('.occupying:last').css('left')),
					sTop = parseFloat($('.occupying:last').css('Top'));
				var Odoc = raphaelTP.offset();
				if(isNaN(sLeft)||isNaN(sTop)){alert('请选择标注的位置');return false;}
				var pX = sLeft - Odoc.left, pY = sTop - Odoc.top;//当前坐标系上的坐标
				callback&&callback(pX,pY,configJson);
				return false;			
			},
			evt: function () {
				var that = this;
				var configJson=that.configJson;
				$('#addBZ').unbind('click').click(function () {
				     if(maptt.find('td').length>0){
						alert('当前网格化，请选择“障碍点”进行标注即可');
						return false;
					 }
					maptt.html(' ').css({'zIndex':-10,opacity:'0'});
					raphaelTP.click(function (e) {
						if ($('.occupying').length) {//暂时不‘添加多个标注’
							$('.occupying').css({left: e.pageX + 'px', top: e.pageY + 'px'}).show();
						}
						else {
							var Oelem = '<div class="occupying"></div>';
							$('body').append(Oelem);
							$('.occupying:last').css({left: e.pageX + 'px', top: e.pageY + 'px'}).show();
						}
						return false;
					})
				})
				
				/****网格相关evt start***/
				$('#gridStr').unbind('blur').blur(function(){	
					configJson.girdSize=$(this).val();
					var change=$(this).val().split(',');//输入框的值
					that.createGird(change[0],change[1]);//生成网格。。行18 列20	
					console.log('改变后原先的障碍点需要重新设置。');
					return false;
				})			
				$('#maptt td').unbind('click').click(function(){
					var serialnum='',allTd=$('#maptt td'),Oelem=$(this);
					if($(this).hasClass('mStart')||$(this).hasClass('mEnd')||$(this).hasClass('mSleep')){//取消选择
						$(this).removeClass();
						return ;
					}
					switch(that.currFlag){
						case 1:
							allTd.removeClass('mStart');
							serialnum=Oelem.addClass('mStart').attr('serialnum').split(',');
							break;
						case 2:
							allTd.removeClass('mEnd');
							serialnum=Oelem.addClass('mEnd').attr('serialnum').split(',');
							break;
						case 3:
							serialnum=Oelem.addClass('mSleep').attr('serialnum').split(',');
							break;
					}
					return false;
				})

				$('.cS1').unbind('click').click(function(){//设置起点
					that.currFlag=1;return false;
				})
				$('.cS2').unbind('click').click(function(){//设置终点
					that.currFlag=2;return false;
				})
				$('.cS3').unbind('click').click(function(){//设置障碍物
					that.currFlag=3;return false;
				})			
				/****网格相关evt end***/
			},
			sbPos: function (uuidArr,imgJson) {//设备坐标（更新一次）
				var that = this,imgJ;
				var configJson=that.configJson;
				if(imgJson){
					imgJ={src:imgJson.src||'t2.png',w:imgJson.w||sbW,h:imgJson.h||sbH}
				}
				else{
					imgJ={src:'t2.png',w:sbW,h:sbH}
				}

				for (var m in uuidArr) {
					var cX = parseFloat(uuidArr[m].x) / configJson.resolution * configJson.zoomImg.x;
					var cY = parseFloat(uuidArr[m].y) / configJson.resolution * configJson.zoomImg.y;
					console.log('sbpos-XY:End-PX:', cX, cY, ' zoomImg:', configJson.zoomImg);
					var circle1 = canvasN.image(imgJ.src, cX, cY, imgJ.w, imgJ.h);//var circle1=canvasN.circle(cX,cY,radius);//圆
					circle1.attr({"fill": "blue"})  //填充色
						.attr("stroke", "none")   //去掉边框
						.data('dt', {x: cX, y: cY, 'deviceSerial': m})
						.hover(function (e) {
							var str = '设备名称:' + this.data('dt').deviceSerial + ' 坐标 X:' + this.data('dt').x + ' Y:' + this.data('dt').y;
							$('#tips').html(str).show();
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
				that.delNode();//删除重复节点（即更新某人新位置）
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
				var configJson=that.configJson;
				
				var curr = fotData[j];
				var cX = fotData[j].beaconCalculatePosition[0].x,
					cY = fotData[j].beaconCalculatePosition[0].y;
				console.log('XY:source-M:', cX, cY);
				cX = parseFloat(cX) / configJson.resolution * configJson.zoomImg.x;
				cY = parseFloat(cY) / configJson.resolution * configJson.zoomImg.y;
				console.log('XY:End-PX:', cX, cY, ' zoomImg:', configJson.zoomImg);
				var circle1 = canvasN.circle(cX, cY, radius);//圆
				circle1.attr({"fill": "#f20bda"})  //填充色
					.attr("stroke", "none")   //去掉边框
					.data('dt', {x: cX, y: cY, deviceID: curr.deviceID, timePoint: curr.timePoint, 'deviceSerial': curr.deviceSerial})
					.hover(function (e) {
						var dt = this.data('dt');
						var str = '人物名称:' + dt.deviceID + ' 坐标 X:' + dt.x + ' Y:' + dt.y + ' 时间:' + dt.timePoint + ' 设备编号=' + curr.deviceSerial;
						$('#tips').html(str).show();
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
			
		DrawPointer.prototype.tDim=function(m,g){//生成2维数组
			var tArray = [];
			for(var k=0;k<m;k++){
				tArray[k]=[];
				for(var j=0;j<g;j++){
					tArray[k][j]="1";//默认都是路1，障碍为0
				}
			}
			this.girdArr=tArray;//生成网格对应的二维数组并设置每一项为1（路1，障碍为0），动态的
		};
		
		DrawPointer.prototype.barriers=function(barriers){//设置表格障碍点...
			var girdArr=this.girdArr=barriers;//新网格。。
			if(girdArr.length<1){
				alert('请生成网格!');
				return false;
			}
			for(var k=0,L=girdArr.length;k<L;k++){
				var currArr=girdArr[k];
				for(var j=0;j<currArr.length;j++){
					if(currArr[j]=="0"){//默认都是路1，障碍为0
						$('#F892975_'+k+'_'+j).addClass('mSleep');	
					}
				}
			}
		};
		
		
		DrawPointer.prototype.createGird=function(hL,zL){//生成网格
			var that=this;
			var tdH=(parseInt(imgA.css('height'))/hL)-2;//hL纵向个数 zL横向个数 
			var tdW=(parseInt(imgA.css('width'))/zL)-2;
			$('#maptt').html('<table style="width:'+parseInt(imgA.css('width'))+'px;height:'+parseInt(imgA.css('height'))+'px;" cellspacing="0" cellpadding="0" border="0" id="tabBcoll"></table>');
			for(var i= 0,str='';i<hL;i++){
				str+='<tr>';
				for(var j=0;j<zL;j++){
					str+=('<td id="F892975_'+j+'_'+i+'" style="height:'+ tdH +'px;width:'+tdW+'px" serialNum="'+j+','+i+'"></td>');
				}
				str+='</tr>';
			}
			$('#maptt table').html(str); 
			that.evt();//网格相关事件
			that.tDim(hL,zL);//生成2维数组
		};
		DrawPointer.prototype.ajaxSubmit=function(parms,callback){//	网格
			var that=this;
			$('#searchLJ').unbind('click').click(function(){//开始查找。。。
				var mStart=$('#maptt td.mStart'),mEnd=$('#maptt td.mEnd'),mSleep=$('#maptt td.mSleep');
				console.log(mStart.length,mEnd.length)
				if(mStart.length!=1||mEnd.length!=1){//是否已经有起点 终点
					alert('请选择起点、终点');
					return  false;
				}

				var start=mStart.attr('serialnum').split(',');
				var end=mEnd.attr('serialnum').split(',');

				for(j=0;j<mSleep.length;j++){//mSleep障碍物的点一开始ajax获取到的。。
					var k=mSleep.eq(j).attr('serialnum').split(',');
					that.girdArr[k[0]][k[1]]=0;
				}
				console.log('后台所需数据:',that.girdArr);

				$.post(parms.url,{start:{x:start[0],y:start[1]},end:{x:end[0],y:end[1]},graphName:parms.graphName||'firstTestGraph',graphMatrix:JSON.stringify(that.girdArr) }, function (result) {
					console.log(result);
					callback&&callback();
				})
			})
		}	
		
	exports.DrawPointer = new DrawPointer();
	
});