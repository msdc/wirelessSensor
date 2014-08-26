define(function(require, exports, module) {
	var $ = require('jquery');
	var Raphael = require('raphael-debug');	
	var drwaA = require('locationCanvas.js').DrawPointer;
	var configJson2={},obj,obj2;
	
    $(function(){
		var raphaelTP = $('#raphaelTP');
		$('#startPos').click(function(){//定位功能  api
			configJson2={
				canvas:{w:parseInt($('#dw1').val()),h:parseInt($('#dw1').val())},
				bj_draw:{w:parseInt($('#dw3').val()),h:parseInt($('#dw4').val()),src:$('#dw5').val()||'2.jpg'},
				scale:$('#dw6').val().slice(2),
			}
			obj=eval("("+$('#tex1').val()+")");
			obj2=eval("("+$('#tex2').val()+")");
			drwaA.resetData(configJson2);//初始化配置文件
			drwaA.sbPos(obj);
			drwaA.formatData(obj2);//人。。【可多次调用】		
		})

		$('#submitBZ').unbind('click').click(function () {//提交“标注”
			function opt(pX,pY,configJson){//接收当前坐标，并计算alert
				//ajax请求。。具体请求根据接口。。
				alert('sumitServer:' + pX * configJson.resolution / configJson.zoomImg + '米*' + pY *configJson.resolution * configJson.zoomImg + '米 当前坐标系上的坐标' + pX + '*' + pY)
			};
			drwaA.sumA(opt);
		})
			
	 })//jq end
	 $(function(){
	   $('#pointOrGrid').click(function(){//路径功能  api
			$('.setPoints').show();
			$('#maptt').show().css({'zIndex':10,opacity:'0.2'});
			
			configJson2={
				canvas:{w:parseInt($('#dw1').val()),h:parseInt($('#dw1').val())},
				bj_draw:{w:parseInt($('#dw3').val()),h:parseInt($('#dw4').val()),src:$('#dw5').val()||'2.jpg'},
				scale:$('#dw6').val().slice(2),
			}
			obj=eval("("+$('#tex1').val()+")");
			obj2=eval("("+$('#tex2').val()+")");

			
			var change=$('#gridStr').val().split(',');//下拉框的值
			drwaA.createGird(change[0],change[1]);//生成网格。。行18 列20 
			drwaA.ajaxSubmit({url:'/saveGraphMatrix',graphName:'firstTestGraph'},function(){console.log('ajax..')});//ajax提交的url和succ后执行的函数	   
	   })
	   $('#gridStr').blur(function (){
			$('#pointOrGrid').click();
	   })
	})//jq end
});