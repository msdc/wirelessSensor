/** 矩阵（2维数组）存放起点和终点，无障碍点 返回“路径” ***/
function GirdF(){
    this.girdArr=[];
    this.currFlag=0;
}
GirdF.prototype={
    init:function(w,h){
        //建筑物（如某个桌子之类的是障碍物。。ajax获取后，在生成的网格中进行画障碍物。故网格个数、每个的宽度都影响其坐标）
        var that=this;
        that.basicD(w,h);
        that.girdArr=that.tDim(that.wL,that.hL);//动态的
        that.createGird();//生成网格
        that.evt();//网格相关事件
    },
    basicD:function(w,h){
        this.wL=$('#imgA').attr('width')/w;//行总数30，列总数20
        this.hL=$('#imgA').attr('height')/h;
    },
    tDim:function(m,g){//生成2维数组
        var tArray = [];
        for(var k=0;k<m;k++){
            tArray[k]=[];
            for(var j=0;j<g;j++){
                tArray[k][j]="";
            }
        }
        return tArray;
    },
    createGird:function(){//生成网格
        var that=this;
        for(var i= 0,str='';i<that.hL;i++){
            str+='<tr>';
            for(var j=0;j<that.wL;j++){
                str+=('<td serialNum="'+j+','+i+'"></td>');
                var xpPStr=''+j+','+i;
            }
            str+='</tr>';
        }
        $('#maptt').html(str);
    },
    evt:function(){//网格相关事件
        var that=this;
        $('#maptt td').click(function(){//暂不优化，先实现功能
            var serialnum='',allTd=$('#maptt td'),Oelem=$(this);
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
        })

        $('.cS1').unbind('click').click(function(){//设置起点
            that.currFlag=1;
        })
        $('.cS2').unbind('click').click(function(){//设置终点
            that.currFlag=2;
        })
        $('.cS3').unbind('click').click(function(){//设置障碍物
            that.currFlag=3;
        })
        $('#searchLJ').unbind('click').click(function(){//开始查找。。。
            var mStart=$('#maptt td.mStart'),mEnd=$('#maptt td.mEnd'),mSleep=$('#maptt td.mSleep');
            if(mStart.length!=1||mStart.length!=1){//是否已经有起点 终点
                alert('请选择起点、终点');
            }
            for(var j=0;j< that.girdArr.length;j++){//清空girdArr所有值
                var t2= that.girdArr[j];
                for(var k=0;k<t2.length;k++){
                    t2[k]=0;
                }
            }

            var s=mStart.attr('serialnum').split(',');
            that.girdArr[s[0]][s[1]]='start';
            var s=mEnd.attr('serialnum').split(',');
            that.girdArr[s[0]][s[1]]='end';
            for(j=0;j<mSleep.length;j++){//mSleep障碍物的点一开始ajax获取到的。。
                var k=mSleep.eq(j).attr('serialnum').split(',');
                that.girdArr[k[0]][k[1]]='sleep';
            }
            console.log('后台所需数据:',that.girdArr);
            //alert('ajax发送给后台。后续执行画线功能');

            $.ajax({
                type: "post",
                data:JSON.stringify({"graphName":'1',"graphMatrix":that.girdArr }),
                url: '192.168.100.189:1337/saveGraphMatrix',
                dataType: 'json',
                success: function (data) {
                    console.log('返回的：',data)
                }
            })
        })
    }
}


