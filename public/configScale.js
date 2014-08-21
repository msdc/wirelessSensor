window.configJson={ //配置文件..将要转为ajax 获取json
    canvas:{
        w:600||700,h:600||700,//单位为像素
        numX:parseInt(4)<5?5:(parseInt(4)>9?9:parseInt(4)),//坐标系X轴个数..坐标点数最少为5，最多为9。。其中包括了(0,0)点
        numY:parseInt(4)<5?5:(parseInt(4)>9?9:parseInt(4)) //坐标系Y轴个数
    },//上面的数字4，是配置出来的，即后台给出的..||后面的是默认值
    bj_draw:{
        w:600||700,h:600||700,
        src:'2.jpg'
    },//初始图片大小
    scale:5000||500,  //比例尺eg：1/500。。现实中的500米等于地图上的1米。。而这里是几百px。
    PPI:96||96, //1英寸有96px
    inchesM:0.0254, //1英寸等于0.0254米..固定值不可更改
    zoomImg:1,   //默认为1。。即图片和画布一样大小
    uuidArr:function(){//这里只是给出一个格式。。将来以后台给出为主，或直接告知后台需要什么的数据和格式
                       //locationCanvas.js中使用for in获取。。若修改这个的格式，同步修改locationCanvas.js
        var pointSB=[],
            frontStr='E2C56DB5-DFFB-48D2-B060-D0F5A71096E0';
        pointSB[frontStr+'_0_1']={x:250.00,y:310.00};//单位为米
        pointSB[frontStr+'_0_2']={x:190.00,y:290.00};
        pointSB[frontStr+'_0_3']={x:120.00,y:150.00};
        pointSB[frontStr+'_0_4']={x:70.00,y:360.00};
        pointSB[frontStr+'_0_5']={x:300.00,y:220.00};
        pointSB[frontStr+'_0_6']={x:60.00,y:150.00};
        return pointSB;
    }
};