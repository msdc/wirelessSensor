window.configJson={ //配置文件
    canvas:{
        w:600||700,h:600||700,
        numX:parseInt(4)<5?5:(parseInt(4)>9?9:parseInt(4)),//坐标系X轴个数..坐标点数最少为5，最多为9。。其中包括了(0,0)点
        numY:parseInt(4)<5?5:(parseInt(4)>9?9:parseInt(4)) //坐标系Y轴个数
    },//上面的数字4，是配置出来的，即后台给出的..||后面的是默认值
    bj_draw:{
        w:900||700,h:1600||700,
        src:'2.jpg'
    },//初始图片大小
    scale:600||500,  //比例尺1/500
    PPI:96||96, //1英寸有96px
    inchesM:0.0254, //1英寸等于0.0254米..固定值不可更改
    zoomImg:1,   //默认为1。。即图片和画布一样大小
    uuidArr:function(){
        var pointSB=[];
        var frontStr='E2C56DB5-DFFB-48D2-B060-D0F5A71096E0';
        pointSB[frontStr+'_0_1']={x:500.00,y:170.00};
        pointSB[frontStr+'_0_2']={x:900.00,y:900.00};
        pointSB[frontStr+'_0_3']={x:200.00,y:150.00};
        pointSB[frontStr+'_0_4']={x:750.00,y:600.00};
        pointSB[frontStr+'_0_5']={x:900.00,y:270.00};
        pointSB[frontStr+'_0_6']={x:600.00,y:590.00};
        return pointSB;
    }
};