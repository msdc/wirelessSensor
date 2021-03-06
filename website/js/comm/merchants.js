define(function(require, exports, module) {
	var $ = require('jquery');
	var Raphael = require('raphael-debug');	
	var drwaA = require('locationCanvas.js').DrawPointer;
	/***实际尺寸：2450 mm		图上像素：233.275 px  图上毫米：82.294 mm		图上厘米：8.2294 cm		**/
	window.configJson={ //get
		canvas:{w:1240,h:1000},
		bj_draw:{w:1240,h:1000,src:'2.jpg',zoom:0.4}, //3100*2500  缩放0.4  w:1240,h:1000
		scale:2450/233.275/1000,  //比例尺eg：1/5000。。
		girdSize:'124,100'  //格子数量 eg：默认20*20
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
        /***初始化 start***/
        $('.moveLay').appendTo($('.wrapDrivePOS'));
        $('.moveLay').show();
        $('#bxPoint').html('');//清空设备或人产生的svg
        /***初始化 end***/
        drwaA.resetData(configJson,'create');//初始化配置文件
        setTimeout(function(){//临时应急
            var mvcK2=$('#MVC_merchantsLocation').val();
            if(mvcK2.length){
                mvcK2=mvcK2.split(',');
                var sbJson2={'bj': {x: mvcK2[0], y:mvcK2[1]}};
                drwaA.sbPos(sbJson2);
                $('.wrapDrivePOS2').append($('.moveStatic').css({left:$('#sb_bj').attr('x')+'px',top:$('#sb_bj').attr('y')+'px'}))
            }
        },500)
        //App.setLocation({x:300,y:300});
        //App.BusinessController.setLocation({x:300,y:300});调用失败
        $('#tempSave').click(function(){
            $('#wpsModi').click();
        })
	})
});