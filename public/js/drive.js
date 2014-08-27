define(function(require, exports, module) {
	var $ = require('jquery');
	var Raphael = require('raphael-debug');	
	function ajaxT(obj){
		$.ajax({
		   type: obj.type,
		   url: obj.url,
		   dataType:obj.dataType||'json',
		   success: function(daT2){
				obj.fn(daT2);
		   }
		})	
	}
	$(function(){
		function listDrive(daT){
			 var L=daT.length;
			 if(L){//暂时不使用模板
				var str='<table class="table table-bordered row_delMg">';
				str+='<tr class="tr_bg">';
					str+='<th class="whiteCol" style="border:none;">ID</th>';
					str+='<th class="whiteCol" style="border:none;">名称</th>';
					str+='<th class="whiteCol" style="border:none;">添加时间</th>';
					str+='<th class="whiteCol" style="border:none;">下一次维护时间</th>';
					str+='<th class="whiteCol" style="border:none;">状态</th>';
					str+='<th class="whiteCol" style="border:none;">操作</th>';
				str+='</tr>';
				for(var j=0;j<daT.length;j++){
					var data=JSON.parse(daT[j]);
					str+='<tr msg="'+data.uuid+'_'+data.major+'_'+data.minor+'"><td>'+data.BleMac+'</td><td>'+data.uuid+'_'+data.major+'_'+data.minor+'</td><td>'+data.createDate+'</td><td>'+data.nextMaintainDate+'</td><td>'+data.status+'</td>';
						str+='<td><button type="button" class="btn adview_a adview_a_bg3 margRight Adrive_edit">编辑</button><button type="button" class="btn adview_a adview_a_bg4 margRight Adrive_del">删除</button></td>';
					str+='</tr>';	
				}	
				str+='</table>';
				$('#AdriveLiST').html(str);	
			 }				
		}//获取设备列表
		var obj={type:'get',url: "/device/get",dataType:'json',fn:listDrive};
		ajaxT(obj);//获取设备列表
		
		$("body").delegate(".Adrive_del", "click", function(){
			var currL=$(this).parents('tr');
			var driveMsg=currL.attr('msg');
			var msg=driveMsg.split('_');
			var url='/device/del?uuid='+(msg[0]||'')+'&major='+(msg[1]||'')+'&minor='+(msg[2]||'');
			var obj={type:'delete',url: url,fn:function(daT){
					alert(daT.message);
					currL.remove();
			}};
			ajaxT(obj);		
		})//设备删除
		$("body").delegate(".Adrive_edit", "click", function(){
			$('.moveLay').show();
			var currL=$(this).parents('tr');
			var driveMsg=currL.attr('msg');
			var msg=driveMsg.split('_');
			var url='/device/get?uuid='+(msg[0]||'')+'&major='+(msg[1]||'')+'&minor='+(msg[2]||'');
			
			var obj={type:'get',url: url,fn:function(daT){
					console.log('getSign:',daT);
					$('#modalAddDevice .cntBtn span.tit').html('&nbsp;&nbsp;编辑设备信息');
			}};
			ajaxT(obj);	
		})//设备编辑	
		
	})	
	
    $(function(){
		var raphaelTP = $('#raphaelTP');
		/***
		实际尺寸：2450 mm		图上像素：233.275 px
        图上毫米：82.294 mm		图上厘米：8.2294 cm		
		**/
		
		//get
		var configJson={ 
			canvas:{w:1240,h:1000},
			bj_draw:{w:1240,h:1000,src:'2.jpg',zoom:0.4}, //3100*2500  缩放0.4  w:1240,h:1000
			scale:233.275/0.245,  //比例尺eg：1/5000。。
			girdSize:'124,100'//格子数量 eg：默认20*20
		};	
		var shopP = [{
				"deviceID": "mobile1","timePoint": "2013-12-23 00:00:00:0001","deviceSerial": 'dS0',
				"beaconCalculatePosition": [{"x": "150", "y": "175"}]//单位是米
			},{
				"deviceID": "mobile2","timePoint": "2013-12-23 00:00:00:0885","deviceSerial": 'dSl',
				"beaconCalculatePosition": [{"x": "439", "y": "339"}]
			}
		];//后台返回的数据格式	
		var sbJson={
			'E2C56DB_0_1': {x: 250.00, y: 310.00},
			'E2C56_0_6': {x: 60.00, y: 150.00}
		}// x、y 单位为米.E2C56DB5-DFFB-48D2-B060-D0F5A71096E0_0_1为设备名称
		var sbJson2={
			'E2C56DB_0_12': {x: 150.00, y: 410.00},
			'E2C56_0_62': {x: 160.00, y: 250.00}
		}// x、y 单位为米.E2C56DB5-DFFB-48D2-B060-D0F5A71096E0_0_1为设备名称		
		
		/***API
			drwaA.resetData(configJson);//初始化配置文件..必须。。
			drwaA.sbPos(sbJson);//设备坐标或商家的位置 【可多次调用】.所需数据在configJson.uuidArr中
			drwaA.formatData(shopP);//人。。【可多次调用】
		**/
		var drwaA = require('locationCanvas.js').DrawPointer;
		drwaA.resetData(configJson);//初始化配置文件
		
		drwaA.sbPos(sbJson);//设备坐标或商家的位置 【可多次调用】.所需数据在configJson.uuidArr中
		drwaA.sbPos(sbJson2,{src:'t3.png',w:50,h:50});//换一个图片，代表不同的用途
		drwaA.formatData(shopP);//人。。【可多次调用】

		
		$("body").delegate(".btnDriveAdd", "click", function(){
			$('.moveLay').show();
			$('#modalAddDevice input').val('');
			$('#modalAddDevice .cntBtn span.tit').html('&nbsp;&nbsp;添加设备信息');
		})//‘添加’按钮  初始化
		
		$('#submitBZ').unbind('click').click(function () {//提交“标注”...”添加记录“
			
			var url='/device/add',modalAddDevice=$('#modalAddDevice');
			if(stateDrive){
				url='/device/update';
			}
			function opt(pX,pY,configJson){
				$.post(url,{
						"BleMac": modalAddDevice.find('input.drive_BleMac').val(),
						"uuid": modalAddDevice.find('input.drive_uuid').val(),
						"major": modalAddDevice.find('input.drive_major').val(),
						"minor": modalAddDevice.find('input.drive_minor').val(),
						"createDate": modalAddDevice.find('input.drive_createDate').val(),
						"nextMaintainDate": modalAddDevice.find('input.drive_nextMaintainDate').val(),
						"status": modalAddDevice.find('input.drive_status').val(),
						"position":{
							"mapsID":"maps_1",
							"x":pX * configJson.resolution / configJson.zoomImg,
							"y":pY *configJson.resolution * configJson.zoomImg
						}
				},function(data){
					if(data.result){
						alert('保存成功');
						$('.moveLay').hide();
						location.reload();
					}
				})	
			};
			drwaA.sumA(opt);
		})
		
		
		
		
		
		
		
		
		function pathFun(parms,configJson){//路径功能
			if($('#gridStr').val().length<1){
				alert('请选择网格数量');
				return false;
			}
			$('#gridStr').val(configJson.girdSize||'20,20');
			var change=$('#gridStr').val().split(',');//存放格子的数量
			
			drwaA.createGird(change[0],change[1]);//生成网格。。eg：行18 列20
			
			
			drwaA.barriers([[0,1,1,0,0],[1,0,0,0,0]]);//将ajax获取的障碍点放到网格上
			//障碍点数组。。这里列出的少。。应该是网格有多少，则它返回多少，只不过是内部0为障碍，1为路
			
			
			drwaA.ajaxSubmit(parms,function(){//parms ajax提交所需参数,function是ajax提交成功后执行的fn
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
				$('#maptt').html('').css({'zIndex':-10,opacity:'0'});
				$(this).data('gird','false').val('无“寻径”功能');
			}
			return false;
		 })			
		
		
	 })//jq end
});