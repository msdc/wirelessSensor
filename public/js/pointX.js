define(function(require, exports, module) {
	var $ = require('jquery');
	var Raphael = require('raphael-debug');	
    $(function(){
		var raphaelTP = $('#raphaelTP');

		var configJson={ 
			canvas:{w:600,h:600},bj_draw:{w:600,h:600,src:'2.jpg'},
			scale:5000,  //比例尺eg：1/500。。
		};	
		var shopP = [{
				"deviceID": "mobile1","timePoint": "2013-12-23 00:00:00:0001","deviceSerial": 'dS0',
				"beaconCalculatePosition": [{"x": "150", "y": "175"}]//单位是米
			},{
				"deviceID": "mobile2","timePoint": "2013-12-23 00:00:00:0885","deviceSerial": 'dSl',
				"beaconCalculatePosition": [{"x": "639", "y": "639"}]
			}
		];//后台返回的数据格式	
		var sbJson={
			'E2C56DB_0_1': {x: 250.00, y: 310.00},
			'E2C56_0_6': {x: 60.00, y: 150.00}
		}// x、y 单位为米.E2C56DB5-DFFB-48D2-B060-D0F5A71096E0_0_1为设备名称
		
		
		/***API
			drwaA.resetData(configJson);//初始化配置文件
			
			drwaA.sbPos(sbJson);//设备坐标或商家的位置 【可多次调用】.所需数据在configJson.uuidArr中
			drwaA.formatData(shopP);//人。。【可多次调用】
		**/
		var drwaA = require('locationCanvas.js').DrawPointer;
		drwaA.resetData(configJson);//初始化配置文件
		
		drwaA.sbPos(sbJson);//设备坐标或商家的位置 【可多次调用】.所需数据在configJson.uuidArr中
		drwaA.formatData(shopP);//人。。【可多次调用】

		$('#submitBZ').unbind('click').click(function () {//提交“标注”
			function opt(pX,pY,configJson){//接收当前坐标，并计算alert
				//ajax请求。。具体请求根据接口。。
				alert('sumitServer:' + pX * configJson.resolution / configJson.zoomImg + '米*' + pY *configJson.resolution * configJson.zoomImg + '米 当前坐标系上的坐标' + pX + '*' + pY)
			};
			drwaA.sumA(opt);
		})
		

		
		var Ogird = require('starRouter.js').GirdF;	
		/***API
			Ogird.createGird(configJson,20,20);//生成网格。。行18 列20
		    Ogird.ajaxSubmit({url:'/saveGraphMatrix',graphName:'firstTestGraph'},fn);//ajax提交的url和succ后执行的函数	
		**/
		
		$('#q2').click(function(){//测试。
			$('.setPoints').show();
			$('#maptt').show().css({'zIndex':10,opacity:'0.2'});
			Ogird.createGird(configJson,20,20);//生成网格。。行18 列20
			Ogird.ajaxSubmit({url:'/saveGraphMatrix',graphName:'firstTestGraph'},function(){});//ajax提交的url和succ后执行的函数	
		})

		
		function pathFun(parms,configJson){//路径功能
			if($('#gridStr').val().length<1){
				alert('请选择网格数量');
				return false;
			}
			var change=$('#gridStr').val().split(',');//下拉框的值
			
			Ogird.createGird(configJson,change[0],change[1]);//生成网格。。行18 列20
			//important: ajax前，需要将ajax获取的障碍点放到网格上，并放到二维数组中每项设置为0 【新加的障碍点也是如此】
			
			Ogird.ajaxSubmit(parms,function(){//parms ajax提交所需参数,function是ajax提交成功后执行的fn
				var canvasN = Raphael('raphaelTP', configJson.canvas.w, configJson.canvas.h);//画布的大小
				var tetronimo=canvasN.path("M 150 150 L 0 150 L 150 0");//进行画线（路径）
				tetronimo.attr({'stroke-width':3,'stroke':'#ff7300'});		
			})
		}

		$('#pointOrGrid').data('gird','false').click(function(){//暂时放到这里。。 切换 网格 or 坐标系 初始化为‘坐标系’，无“寻径”功能
			var gird=$(this).data('gird');
			if(gird=='false'){//change gird
				$('.setPoints').show();
				$('#maptt').show().css({'zIndex':10,opacity:'0.2'});
				$(this).data('gird','true').val('“寻径”功能启动');//启动“寻径”功能
				
				pathFun({url:'/saveGraphMatrix',graphName:'firstTestGraph'},configJson);//路径功能..
				//参数为ajax提交的参数.configJson为配置文件
			}
			else{
				$('.setPoints').hide();
				if($('#raphaelTP svg').length>1){
					$('#raphaelTP svg:first').remove();
				}
				$('#maptt').html('').css({'zIndex':-10,opacity:'0'});
				$(this).data('gird','false').val('无“寻径”功能');
			}
			return false;
		 })	
		
	 })//jq end
});