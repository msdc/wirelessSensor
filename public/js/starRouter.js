/** 矩阵（2维数组）1 0 ***/
define(function(require, exports, module) {
	var $ = require('jquery');
	var raphaelTP = $('#raphaelTP');
	var imgA = $('#imgA10086');
	
	function GirdF(){
		this.girdArr=[];
		this.currFlag=0;
	}
	GirdF.prototype={
	    resetData:function(configJson){
		     var that=this;
			configJson.canvas.w=configJson.bj_draw.w;//new add  图片大小为画布大小
			configJson.canvas.h=configJson.bj_draw.h;
			
			canvasN = Raphael('raphaelTP', configJson.canvas.w, configJson.canvas.h);
			configJson.resolution = configJson.scale * configJson.inchesM / configJson.PPI;//地图分辨率
			
			that.configJson=configJson;
			
			imgA.attr({width: configJson.bj_draw.w, height: configJson.bj_draw.h, src: configJson.bj_draw.src});
			raphaelTP.css({width: configJson.canvas.w + 'px', height: configJson.canvas.h + 'px'});
		},
		tDim:function(m,g){//生成2维数组
			var tArray = [];
			for(var k=0;k<m;k++){
				tArray[k]=[];
				for(var j=0;j<g;j++){
					tArray[k][j]="1";//默认都是路1，障碍为0
				}
			}
			this.girdArr=tArray;//生成网格对应的二维数组并设置每一项为1（路1，障碍为0），动态的
		},
		createGird:function(configJson,hL,zL){//生成网格
			var that=this;
			if(raphaelTP.find('svg').length>1){
				raphaelTP.find('svg:first').remove();
			}
			that.resetData(configJson);
			var tdH=imgA.attr('height')/zL;//hL纵向个数 zL横向个数 
			var tdW=imgA.attr('width')/hL;
			$('#maptt').html('');
			console.log(hL,zL)
			for(var i= 0,str='';i<zL;i++){
				str+='<tr>';
				for(var j=0;j<hL;j++){
					str+=('<td style="height:'+ tdH +'px;width:'+tdW+'px" serialNum="'+j+','+i+'"></td>');
				}
				str+='</tr>';
			}
			$('#maptt').html(str); 
			that.evt();//网格相关事件
			that.tDim(hL,zL);//生成2维数组
		},
		ajaxSubmit:function(parms,callback){
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
		},
		evt:function(){//网格相关事件
			var that=this;
			$('#gridStr').unbind('change').change(function(){	
				var change=$(this).val().split(',');//下拉框的值
				//增加障碍点
				that.createGird(that.configJson,change[0],change[1]);//生成网格。。行18 列20	
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
		}
	}
    exports.GirdF=new GirdF();

});

