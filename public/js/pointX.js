define(function(require, exports, module) {
	var $ = require('jquery');  
	console.log('jquery:',$('body').css('width'))
    $(function(){
		var Raphael = require('raphael-debug');
		var raphaelTP = $('#raphaelTP');


		var configJson={ //配置文件..将要转为ajax 获取json
			canvas:{
				w:600||700,h:600||700,//单位为像素
				numX:7,numY:7
			},
			bj_draw:{
				w:600||700,h:600||700,src:'2.jpg'
			},//初始图片大小  后面的是默认值
			scale:5000||5000,  //比例尺eg：1/500。。现实中的500米等于地图上的1米。。而这里是几百px。
			gridSize:'20,20', //格子数量20*20
			PPI:96||96, //1英寸有96px
			inchesM:0.0254, //1英寸等于0.0254米..固定值不可更改
			zoomImg:1,   //默认为1。。即图片和画布一样大小
			uuidArr: {
				//这里只是给出一个格式。。将来以后台给出为主，或直接告知后台需要什么的数据和格式
				//locationCanvas.js中使用for in获取。。若修改这个的格式，同步修改locationCanvas.js
				// x、y 单位为米.E2C56DB5-DFFB-48D2-B060-D0F5A71096E0_0_1为设备名称
				'E2C56DB5-DFFB-48D2-B060-D0F5A71096E0_0_1': {x: 250.00, y: 310.00},
				'E2C56DB5-DFFB-48D2-B060-D0F5A71096E0_0_2': {x: 190.00, y: 290.00},
				'E2C56DB5-DFFB-48D2-B060-D0F5A71096E0_0_3': {x: 120.00, y: 150.00},
				'E2C56DB5-DFFB-48D2-B060-D0F5A71096E0_0_4': {x: 70.00, y: 360.00},
				'E2C56DB5-DFFB-48D2-B060-D0F5A71096E0_0_5': {x: 300.00, y: 220.00},
				'E2C56DB5-DFFB-48D2-B060-D0F5A71096E0_0_6': {x: 60.00, y: 150.00}
			}
		};	
		var kTjFormat = [{
				"deviceID": "mobile1","timePoint": "2013-12-23 00:00:00:0001","deviceSerial": 'dS0',
				"beaconCalculatePosition": [{"x": "450", "y": "475"}]//单位是米
			},{
				"deviceID": "mobile2","timePoint": "2013-12-23 00:00:00:0885","deviceSerial": 'dSl',
				"beaconCalculatePosition": [{"x": "639", "y": "639"}]
			},{
				"deviceID": "mobile3","timePoint": "2013-12-23 00:00:00:0885","deviceSerial": 'dSl',
				"beaconCalculatePosition": [{"x": "439", "y": "239"}]
			}
		];//后台返回的数据格式
			
	
	
	
		var DrawPointer = require('locationCanvas.js').DrawPointer;
		var drwaA=new DrawPointer();
		drwaA.resetData(configJson);//初始化基本数据
		
		/***“设备”的位置 start***/
		drwaA.coordinate();//坐标系(红点)..可删除
		drwaA.sbPos();//设备坐标
		drwaA.evt();//事件
		/***“设备”的位置 end***/
		
		/***“人”的位置 start***/
		drwaA.formatData(kTjFormat);//格式化数据
		drwaA.delNode();//删除重复节点（即更新某人新位置）
		drwaA.circleD();
		/***“人”的位置 end***/
	    setTimeout(function(){//这里假设为ajax。。2秒后获取
			var kTjFormat2=[//后台返回的数据格式
				{
					"deviceID": "mobile1",
					"timePoint": "2013-12-23 00:00:00:0001",
					"beaconCalculatePosition": [
						{"x": "300","y": "375"}
					]
				},
				{
					"deviceID": "mobile2",
					"timePoint": "2013-12-23 00:00:00:0001",
					"beaconCalculatePosition": [
						{"x": "310","y": "650"}
					]
				}
			];
			/***“人”的位置 start***/
			drwaA.formatData(kTjFormat2);//格式化数据
			drwaA.delNode();//删除重复节点（即更新某人新位置）
			drwaA.circleD();
			/***“人”的位置 end***/
        },2000)	
		
		
		
		
				
		var GirdF = require('starRouter.js').GirdF;
		var Ogird=new GirdF();	
	

	
		 $('#pointOrGrid').data('gird','false').click(function(){//暂时放到这里。。 切换 网格 or 坐标系 初始化为‘坐标系’，无“寻径”功能
				var gird=$(this).data('gird');
				if(gird=='false'){//change gird
					$('.setPoints').show();
					$('#maptt').show().css({'zIndex':10,opacity:'0.2'});
					$(this).data('gird','true').val('“寻径”功能启动，隐藏坐标系');//启动“寻径”功能
					
					var change=$('#gridStr').val().split(',');//下拉框的值
					/**路径功能 start**/
					Ogird.resetData(configJson);//初始化图片和画布
					//若ajax获取的configJson中有网格数量，则使用ajax获取的。。这里是没有保存之前的。。
					
					Ogird.createGird(change[0],change[1]);//生成网格。。行18 列20
					Ogird.girdArr=Ogird.tDim(change[0],change[1]);//生成网格对应的二维数组并设置每一项为1（路1，障碍为0），动态的
					Ogird.evt();//网格相关事件
					
					//important: ajax前，需要将ajax获取的障碍点放到网格上，并放到二维数组中每项设置为0 【新加的障碍点也是如此】
					//此功能ajax及获取后的数据未知，自行添加
					
				

						   $('#raphaelTP svg').remove();
						   var canvasN = Raphael('raphaelTP', configJson.canvas.w, configJson.canvas.h);
						   var tetronimo=canvasN.path("M 150 150 L 0 150 L 150 0");
						   tetronimo.attr({'stroke-width':3,'stroke':'#ff7300'});//测试画路线。。自行删除

							
					var parms={url:'http://192.168.1.0/saveGraphMatrix',graphName:'firstTestGraph'};//graphName场馆名称
					Ogird.ajaxSubmit(parms,function(){//内部使用Ogird.girdArr
							$('#raphaelTP').html('');
							var canvasN = Raphael('raphaelTP', configJson.canvas.w, configJson.canvas.h);//画布的大小
							var tetronimo=canvasN.path("M 150 150 L 0 150 L 150 0");//进行画线（路径）
							tetronimo.attr({'stroke-width':3,'stroke':'#ff7300'});	
					})
					/**路径功能 start**/
					
				}
				else{
					$('.setPoints').hide();
					$('#maptt').html(' ').css({'zIndex':-10,opacity:'0'});
					$(this).data('gird','false').val('坐标系,无“寻径”功能');
				}
		 })	

		
		
	 })//jq end
});