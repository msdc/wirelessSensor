define(function(require, exports, module) {
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
    function getSeller(data){
        console.log('/seller/get',data);
        var data=JSON.parse(data);
        if(data.location){
            drwaA.sbPos({'sb_bj':'dd',x:data.location.x,y:data.location.y});
        }
        else{//
           console.log('no seller bz..');
        }
    }
	$(function(){
        /***初始化 start***/
        $('.moveLay').appendTo($('.wrapDrivePOS'));
        $('.moveLay').show();
        $('#bxPoint').html('');//清空设备或人产生的svg
        /***初始化 end***/
        drwaA.resetData(configJson,'create');//初始化配置文件
        setTimeout(function(){
            ajaxT({type:'get',url:'/seller/get',fn:getSeller});//标准地理外置
        },1000);
	})	
	/**
    $(function(){
		var raphaelTP = $('#raphaelTP');
		var modalAddDevice=$('#modalAddDevice');//弹出设备对话框id

		
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

    })//jq end
     **/
});