define(function(require, exports, module) {
	var $ = require('jquery');
	var Raphael = require('raphael-debug');	
    var interId,totalP=0;//人物定时器..totalP统计多少次没有人的的坐标
	
    $(function(){
		var raphaelTP = $('#raphaelTP');
		/***
		实际尺寸：2450 mm		图上像素：233.275 px
        图上毫米：82.294 mm		图上厘米：8.2294 cm		
		**/
		
		//get
		var configJson={ 
			canvas:{w:1240,h:1000},
			bj_draw:{w:1240,h:1000,src:'2.jpg',zoom:0.4},//缩放0.4
			scale:1,//2450/233.275,  //比例尺eg：1/5000。。 //3100*2500    w:1240,h:1000 ..1px等于多少mm
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
        /**最新：（代替shopP）{"deviceSerial":"F2LJMKYDDTWD","deviceName":"Ning’s iPhone","location":[{"x":29.36,"y":12.02}]}**/
		var sbJson={
			'E2C56DB_0_1': {x: 250.00, y: 310.00},
			'E2C56_0_6': {x: 60.00, y: 150.00}
		}// x、y 单位为px.E2C56DB5-DFFB-48D2-B060-D0F5A71096E0_0_1为设备名称
		var sbJson2={
			'E2C56DB_0_12': {x: 150.00, y: 410.00},
			'E2C56_0_62': {x: 160.00, y: 250.00}
		}// x、y 单位为svg图的px   .E2C56DB5-DFFB-48D2-B060-D0F5A71096E0_0_1为设备名称
		
		/***API
			drwaA.resetData(configJson);//初始化配置文件..必须。。
			drwaA.sbPos(sbJson);//设备坐标或商家的位置 【可多次调用】.所需数据在configJson.uuidArr中
			drwaA.formatData(shopP);//人。。【可多次调用】
		**/



		var drwaA = require('locationCanvas.js').DrawPointer;
		drwaA.resetData(configJson);//初始化配置文件   x、y 单位为svg图的px
       // var shopP=[{"deviceSerial":"F2LJMKYDDTWD","deviceName":"Ning’s iPhone","location":[{"x":29.36,"y":12.02}]}];
       // drwaA.formatData(shopP);//人。。【可多次调用】

        function psonFun(){
            $.ajax({
                type: "get",
                url: '/getPoints/true',
                dataType:'json',
                success: function(data){
                    var shopP=[];
                    if(data.result=='there is no data'){
                        $('.pMsg').html('no person pointXY:there is no data:'+(++totalP));
                        return false;
                    }
                    if(!(data instanceof Array)){shopP.push(data);}else{shopP= data;}
                    drwaA.formatData(shopP);//人。。【可多次调用】
                }
            });
        }
        $('#getCsP').data('close',1).click(function(){
            var clo=$(this).data('close');
            if(clo==1){
                interId=setInterval(function(){
                    psonFun();
                },1000);
                $(this).data('close',0).val('关闭获取“人”坐标');
            }
            else {
                clearInterval(interId);
                $(this).data('close',1).val('获取场所“人”坐标');
                totalP=0;
            }
        })


		//drwaA.sbPos(sbJson);//设备坐标或商家的位置 【可多次调用】.所需数据在configJson.uuidArr中
		//drwaA.sbPos(sbJson2,{src:'images/t3.png',w:50,h:50});//换一个图片，代表不同的用途
		//drwaA.formatData(shopP);//人。。【可多次调用】

		$('#submitBZ').unbind('click').click(function () {//提交“标注”
			function opt(pX,pY,configJson){//接收当前坐标，并计算alert
				//ajax请求。。具体请求根据接口。。
				alert('sumitServer:' + pX * configJson.resolution / configJson.zoomImg + 'px*' + pY *configJson.resolution/ configJson.zoomImg + 'px 当前坐标系上的坐标' + pX + '*' + pY)
			};
			drwaA.sumA(opt);
		})
		

		/***API
			drwaA.createGird(configJson,20,20);//生成网格。。行18 列20
		    drwaA.ajaxSubmit({url:'/saveGraphMatrix',graphName:'firstTestGraph'},fn);//路径ajax提交的url和succ后执行的函数	
					ajax 获取的二维数组（障碍点数组）：障碍点数组长短与网格完全一样。
			drwaA.barriers(障碍点数组);//条件：需要先生成网格，然后这里讲障碍点数组在网格上体现。
		**/

		function pathFun(parms,configJson){//路径功能
			if($('#gridStr').val().length<1){
				alert('请选择网格数量');
				return false;
			}
			$('#gridStr').val(configJson.girdSize||'20,20');
			var change=$('#gridStr').val().split(',');//存放格子的数量
			
			drwaA.createGird(change[0],change[1]);//生成网格。。eg：行18 列20
			
			
			//drwaA.barriers([[0,1,1,0,0],[1,0,0,0,0]]);//将ajax获取的障碍点放到网格上
			//障碍点数组。。这里列出的少。。应该是网格有多少，则它返回多少，只不过是内部0为障碍，1为路
			
			
			drwaA.ajaxSubmit(parms,function(){//parms ajax提交所需参数,function是ajax提交成功后执行的fn
				var canvasN = Raphael('raphaelTP', configJson.canvas.w, configJson.canvas.h);//画布的大小
				var tetronimo=canvasN.path("M 150 150 L 0 150 L 150 0");//进行画线（路径）
				tetronimo.attr({'stroke-width':3,'stroke':'#ff7300'});		
			})
		}


        function pathFun(graphId,configJson){//路径功能
            if($('#gridStr').val().length<1){alert('请选择网格数量');return false;}

            $('#gridStr').val(configJson.girdSize||'20,20');
            var change=$('#gridStr').val().split(',');//存放格子的数量

            drwaA.createGird(change[0],change[1]);//生成网格。。eg：行18 列20

            drwaA.getBarriers(graphId,function(){
                drwaA.barriers();//将ajax获取的障碍点放到网格上
            });//获取障碍点。
        }
        $('#pointOrGrid').data('gird','false').click(function(){//暂时放到这里。。 切换 网格 or 坐标系 初始化为‘坐标系’，无“寻径”功能
            var gird=$(this).data('gird');
            if(gird=='false'){//change gird
                $('.setPoints').show();
                $('#maptt').show().css({'zIndex':10,opacity:'0.2'});
                $(this).data('gird','true').val('关闭“寻径”功能');//启动“寻径”功能

                pathFun($('#graphId').val(),configJson);//路径功能..
                //参数为ajax提交的参数.configJson为配置文件
            }
            else{
                $('.setPoints').hide();
                $('#maptt').html('').css({'zIndex':-10,opacity:'0'});
                $(this).data('gird','false').val('启动“寻径”功能');
            }
            return false;
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
                data:JSON.stringify({"graphName":$('#graphId').val()||"graph","graphMatrix":drwaA.girdArr }),
                dataType:'json',
                success: function(data){
                    console.log('saveGraphMatrix:',data);
                    alert(data.result)
                }
            });
            return false;
        })//保存障碍点

        $("body").delegate("#getZ9", "click", function(){
            $.ajax({
                type: "get",
                url: '/getGraphMatrix/'+$('#graphId').val(),
                contentType:'application/text',
                dataType:'json',
                success: function(data){
                    console.log(data);
                    drwaA.girdArr=data;
                    drwaA.barriers();//将ajax获取的障碍点放到网格上
                }
            });
            return false;
        })//获取障碍点
        $("body").delegate(".cancelNet", "click", function(){
            $('#pointOrGrid').data('gird','false');
            $('.setPoints').hide();
            $('#maptt').html('').css({'zIndex':-10,opacity:'0'});
            $(this).data('gird','false').val('擦黑板');
            $('#pointOrGrid').click();
        })//'擦黑板'功能

	 })//jq end
});