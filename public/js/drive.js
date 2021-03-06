define(function(require, exports, module) {
	var stateDrive=0;// 设备：0 add,1 update
	var defDat={
		"BleMac": 5,"uuid": "ES123654","major": 3,
		"minor": 2,"createDate": "2014-1-1","nextMaintainDate": "2015-12-1",
		"status": "运行中","position":{"mapsID":"maps_1","x":12,"y":13}
	}//设备的默认值		
	var $ = require('jquery');
	var Raphael = require('raphael-debug');	
	var drwaA = require('locationCanvas.js').DrawPointer;
	/***实际尺寸：2450 mm		图上像素：233.275 px  图上毫米：82.294 mm		图上厘米：8.2294 cm		**/
	window.configJson={ //get
		canvas:{w:1240,h:1000},
		bj_draw:{w:1240,h:1000,src:'2.jpg',zoom:0.4}, //3100*2500  缩放0.4  w:1240,h:1000
		scale:233.275/0.245,  //比例尺eg：1/5000。。
		girdSize:'124,100'//格子数量 eg：默认20*20
	};		
	
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
		var modalAddDevice=$('#modalAddDevice');//弹出设备对话框id
		
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
						str+='<td><button type="button" class="btn adview_a adview_a_bg3 margRight Adrive_edit" data-toggle="modal" data-target="#modalAddDevice">编辑</button><button type="button" class="btn adview_a adview_a_bg4 margRight Adrive_del">删除</button></td>';
					str+='</tr>';	
				}	
				str+='</table>';
				$('#AdriveLiST').html(str);	
			 }				
		}//获取设备列表
		var obj={type:'get',url: "/device/get",dataType:'json',fn:listDrive};
		ajaxT(obj);//获取设备列表
		
		
		function dpos(daT){
			var L=daT.length;
			var sbJson={};
			if(L){
				for(var j=0;j<daT.length;j++){
					var data=JSON.parse(daT[j]);
					console.log('设备坐标:',data)
					var ID=data.uuid+'_'+data.major+'_'+data.minor;
					sbJson[ID]={x:data['position[x]'],y:data['position[y]']};
				}			
			}

			drwaA.resetData(configJson);//初始化配置文件
			drwaA.sbPos(sbJson);			
			/** var sbJson={'E2C56DB_0_1': {x: 250.00, y: 310.00},'E2C56_0_6': {x: 60.00, y: 150.00}} **/			
		}//设备分布。。。。
		$("body").delegate("#EquD", "click", function(){
			/***初始化 start***/
			$('.moveLay').appendTo($('.wrapDrivePOS'));
			$('.moveLay').show();		
			$('#bxPoint').html('');//清空设备或人产生的svg
			/***初始化 end***/
			
			var obj={type:'get',url: "/device/get",dataType:'json',fn:dpos};
			ajaxT(obj);	
		})//设备分布。。。。
		
		$("body").delegate(".Adrive_del", "click", function(){
			var currL=$(this).parents('tr');
			var driveMsg=currL.attr('msg');
			var msg=driveMsg.split('_');
			var url='/device/del?uuid='+(msg[0]||'')+'&major='+(msg[1]||'')+'&minor='+(msg[2]||'');
			var obj={type:'delete',url: url,fn:function(daT){
					if(daT.result){
						alert(daT.result);
						currL.remove();				
					}
			}};
			ajaxT(obj);		
		})//设备删除
		
		$("body").delegate(".Adrive_edit", "click", function(){
			/**初始化 start**/
			stateDrive=1;	
			$('.moveLay').show().appendTo($('.wrapDriveDLE'));
			$('#bxPoint').html('');//清空设备或人产生的svg
			/**初始化 end**/
			
			var currL=$(this).parents('tr');
			var driveMsg=currL.attr('msg');
			var msg=driveMsg.split('_');
			var url='/device/get?uuid='+(msg[0]||'')+'&major='+(msg[1]||'')+'&minor='+(msg[2]||'');
			
			var obj={type:'get',url: url,fn:function(daT){//暂不简化。
					modalAddDevice.find('.cntBtn span.tit').html('&nbsp;&nbsp;编辑设备信息');
					modalAddDevice.find('input.drive_BleMac').val(daT.BleMac||'');
					modalAddDevice.find('input.drive_uuid').val(daT.uuid||'');
					modalAddDevice.find('input.drive_major').val(daT.major||'');
					modalAddDevice.find('input.drive_minor').val(daT.minor||'');
					modalAddDevice.find('input.drive_createDate').val(daT.createDate||'');
					modalAddDevice.find('input.drive_nextMaintainDate').val(daT.nextMaintainDate||'');
					modalAddDevice.find('input.drive_status').val(daT.status||'');
					//"position[mapsID]":"maps_1","position[x]":"-225.04626342773437","position[y]":"21.66521726190476"
					var sbJson={};
					var ID=daT.uuid+'_'+daT.major+'_'+daT.minor;
					sbJson[ID]={x:daT['position[x]'],y:daT['position[y]']};
					drwaA.resetData(configJson,'edit',ID);//初始化配置文件..id以便删除，更新
					drwaA.sbPos(sbJson);
			}};
			ajaxT(obj);	
		})//设备编辑	
		
	})	
	
    $(function(){
		var raphaelTP = $('#raphaelTP');
		var modalAddDevice=$('#modalAddDevice');//弹出设备对话框id

		$("body").delegate(".btnDriveAdd", "click", function(){
			/**初始化 start**/
			$('.moveLay').appendTo($('.wrapDriveDLE'));//单击时，或其他时候。。。。.svg图。。
			stateDrive=0;		
			$('.moveLay').show();
			$('#bxPoint').html('');//清空设备或人产生的svg
			/**初始化 end**/
			
			modalAddDevice.find('input.drive_BleMac').val(defDat.BleMac||'');
			modalAddDevice.find('input.drive_uuid').val(defDat.uuid||'');
			modalAddDevice.find('input.drive_major').val(defDat.major||'');
			modalAddDevice.find('input.drive_minor').val(defDat.minor||'');
			modalAddDevice.find('input.drive_createDate').val(defDat.createDate||'');
			modalAddDevice.find('input.drive_nextMaintainDate').val(defDat.nextMaintainDate||'');
			modalAddDevice.find('input.drive_status').val(defDat.status||'');
			$('#modalAddDevice .cntBtn span.tit').html('&nbsp;&nbsp;添加设备信息');
            drwaA.resetData(configJson,'create');//初始化配置文件
		})//‘添加’按钮  初始化
		
		$("body").delegate("#submitBZ", "click", function(){//提交“标注”...”添加记录/修改记录“
			var url='/device/add',modalAddDevice=$('#modalAddDevice');
			if(stateDrive==1){
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
						"y":pY * configJson.resolution / configJson.zoomImg
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
		
		$("body").delegate("#saveZ", "click", function(){
			//var girdArr=drwaA.girdArr;//需要判断是否已经生成网格。
			var mSleep=$('#maptt td.mSleep');
			for(j=0;j<mSleep.length;j++){//mSleep障碍物的点一开始ajax获取到的。。
				var k=mSleep.eq(j).attr('serialnum').split(',');
				drwaA.girdArr[k[0]][k[1]]=0;
			}			
			$.ajax({
				type: "post",
				url: '/saveGraphMatrix',
				contentType:'application/text',
				data:JSON.stringify({"graphName":"graph","graphMatrix":drwaA.girdArr }),
				dataType:'json',
				success: function(data){
					console.log('saveGraphMatrix:',data);
                    alert(data.result)
				}
			});			
			return false;
		})//保存障碍点

		
		
		
		
		
		function pathFun(parms,configJson){//路径功能
			if($('#gridStr').val().length<1){
				alert('请选择网格数量');
				return false;
			}
			$('#gridStr').val(configJson.girdSize||'20,20');
			var change=$('#gridStr').val().split(',');//存放格子的数量
			
			drwaA.createGird(change[0],change[1]);//生成网格。。eg：行18 列20

            drwaA.getBarriers('场馆名称',function(){
                drwaA.barriers();//将ajax获取的障碍点放到网格上
            });//获取障碍点。
		}
        $('#pointOrGrid').data('gird','false').click(function(){//暂时放到这里。。 切换 网格 or 坐标系 初始化为‘坐标系’，无“寻径”功能
            var gird=$(this).data('gird');
            if(gird=='false'){//change gird
                $('.setPoints').show();
                $('#maptt').show().css({'zIndex':10,opacity:'0.2'});
                $(this).data('gird','true').val('“寻径”功能启动');//启动“寻径”功能

                pathFun({url:'/findPath',graphName:'firstTestGraph'},configJson);//路径功能..
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