var uuidArr = [//测试数据(固定值，设备坐标)
    {pointSB:'a0',x:2,y:2},//,Cacc:'FE添加的mpgAjax中每个距离acc'
    {pointSB:'a1',x:20,y:30},
    {pointSB:'a2',x:50,y:10},
    {pointSB:'a3',x:40,y:20}
];
var uuidArr=
[
    {pointSB:'E2C56DB5-DFFB-48D2-B060-D0F5A71096E0_0_1',x:0.00,y:5.00},//,Cacc:'FE添加的mpgAjax中每个距离acc'
    {pointSB:'E2C56DB5-DFFB-48D2-B060-D0F5A71096E0_0_2',x:5.00,y:0.00},
    {pointSB:'E2C56DB5-DFFB-48D2-B060-D0F5A71096E0_0_3',x:0.00,y:5.00},
    {pointSB:'E2C56DB5-DFFB-48D2-B060-D0F5A71096E0_0_4',x:5.00,y:5.00},
    {pointSB:'E2C56DB5-DFFB-48D2-B060-D0F5A71096E0_0_5',x:2.50,y:2.30},
    {pointSB:'E2C56DB5-DFFB-48D2-B060-D0F5A71096E0_0_6',x:10.00,y:5.00}
]

//坐标系X----向右
//      Y----向下

//pointSB:uuid+“_”+major+"_"+"minor"
//x: cell y:cell   distance: rate,, realX==cell*rate.


var uuidArr_L=uuidArr.length;
//var mpgAjax = [//测试数据
//    {"deviceID": "mobile1", "monitorPackage": [
//        {"checkPoint": "2011-12-11 00:00:00:0000", "beaconPKG": [
//            {"uuid": "a0", "acc": "5.74"},
//            {"uuid": "a3", "acc": "-0.5"},
//            {"uuid": "a2", "acc": "2.44"},
//            {"uuid": "a3", "acc": "3.64"}
//        ],'comb':[//存放编号..(此字段FE生成)
//            [0,1,2],[0,1,3],[0,2,3],[1,2,3]
//        ]},
//        {"checkPoint": "2011-12-11 00:00:12:5600", "beaconPKG": [
//            {"uuid": "a0", "acc": "-3"},
//            {"uuid": "a1", "acc": "3.48"}
//        ]}
//    ]},
//    {"deviceID": "mobile2", "monitorPackage": [
//        {"checkPoint": "2011-12-11 00:00:00:0000", "beaconPKG": [
//            {"uuid": "a0", "acc": "20.74"},
//            {"uuid": "a2", "acc": "20.24"},
//            {"uuid": "a1", "acc": "46.74"},
//            {"uuid": "a3", "acc": "41.48"}
//        ]},
//        {"checkPoint": "2011-12-11 00:00:12:5600", "beaconPKG": [
//            {"uuid": "a2", "acc": "3.44"},
//            {"uuid": "a3", "acc": "4.64"},
//            {"uuid": "a0", "acc": "6.74"},
//            {"uuid": "a1", "acc": "7.48"}
//        ]}
//    ]}
//];
var kTjFormat={//提交的数据格式
    "deviceID": "mobile1",
    "timePoint": "2013-12-23 00:00:00:0001",
    "beaconCanculatePosition": [
        {"x": "0.813115258088","y": "2.813115258624"},
        {"x": "1.25813115088624","y": "2.88131886248"}
    ]
};

var submitJson=[], //存放提交的数据
    currTelResule=[];//存放计算后最终手机 点-时间-坐标（数组bCPos）

function Combine(a, n, m) {

    m = m > n ? n : m;

    var order = [m + 1];
    var outputArray = [];
    for (var i = 0; i <= m; i++) {
        order[i] = i - 1;
    }
    // 注意这里order[0]=-1用来作为循环判断标识

    var count = 0;
    var k = m;
    var flag = true;           // 标志找到一个有效组合
    while (order[0]) {
        // 输出符合要求的组合
        if (flag) {
            var tpObj = [];
            for (i = 1; i <= m; i++) {
                //console.log(a[order[i]]);
                tpObj.push(a[order[i]]);
            }
            outputArray.push(tpObj);
            count++;
            flag = false;
        }
        // 在当前位置选择新的数字
        order[k]++;
        // 当前位置已无数字可选，回溯
        if (order[k] == n) {
            order[k--] = 0;
            continue;
        }
        // 更新当前位置的下一位置的数字
        if (k < m) {
            order[++k] = order[k - 1];
            continue;
        }

        if (k == m) {
            flag = true;
        }
    }
    return outputArray;
}

function Calculation(mpgAjax) {
    //测试数据：var mpgAjax=[{"deviceSerial":"F2LJMKYDDTWD","deviceName":"Ning’s iPhone","monitorPackage":[{"checkPoint":"2014-08-13 03:27:25:7930","beaconPKG":[{"major":"0","minor":"2","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"3.84"},{"major":"0","minor":"4","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"10.79"},{"major":"0","minor":"5","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"11.50"},{"major":"0","minor":"3","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"13.64"},{"major":"0","minor":"1","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"23.54"},{"major":"0","minor":"6","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"39.23"}]},{"checkPoint":"2014-08-13 03:27:26:2930","beaconPKG":[{"major":"0","minor":"2","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"3.84"},{"major":"0","minor":"4","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"10.79"},{"major":"0","minor":"5","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"11.50"},{"major":"0","minor":"3","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"13.64"},{"major":"0","minor":"1","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"23.54"},{"major":"0","minor":"6","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"39.23"}]},{"checkPoint":"2014-08-13 03:27:26:7930","beaconPKG":[{"major":"0","minor":"2","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"3.91"},{"major":"0","minor":"4","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"10.87"},{"major":"0","minor":"5","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"11.43"},{"major":"0","minor":"3","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"13.79"},{"major":"0","minor":"1","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"23.89"},{"major":"0","minor":"6","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"38.89"}]},{"checkPoint":"2014-08-13 03:27:27:2930","beaconPKG":[{"major":"0","minor":"2","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"3.91"},{"major":"0","minor":"4","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"10.87"},{"major":"0","minor":"5","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"11.43"},{"major":"0","minor":"3","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"13.79"},{"major":"0","minor":"1","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"23.89"},{"major":"0","minor":"6","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"38.89"}]},{"checkPoint":"2014-08-13 03:27:27:7930","beaconPKG":[{"major":"0","minor":"4","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"-1.00"},{"major":"0","minor":"6","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"-1.00"},{"major":"0","minor":"2","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"4.04"},{"major":"0","minor":"5","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"11.48"},{"major":"0","minor":"3","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"13.93"},{"major":"0","minor":"1","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"23.45"}]},{"checkPoint":"2014-08-13 03:27:28:2930","beaconPKG":[{"major":"0","minor":"4","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"-1.00"},{"major":"0","minor":"6","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"-1.00"},{"major":"0","minor":"2","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"4.04"},{"major":"0","minor":"5","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"11.48"},{"major":"0","minor":"3","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"13.93"},{"major":"0","minor":"1","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"23.45"}]},{"checkPoint":"2014-08-13 03:27:28:7930","beaconPKG":[{"major":"0","minor":"2","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"3.97"},{"major":"0","minor":"4","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"10.89"},{"major":"0","minor":"5","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"11.48"},{"major":"0","minor":"3","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"13.73"},{"major":"0","minor":"1","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"23.18"},{"major":"0","minor":"6","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"37.47"}]},{"checkPoint":"2014-08-13 03:27:29:2930","beaconPKG":[{"major":"0","minor":"2","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"3.97"},{"major":"0","minor":"4","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"10.89"},{"major":"0","minor":"5","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"11.48"},{"major":"0","minor":"3","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"13.73"},{"major":"0","minor":"1","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"23.18"},{"major":"0","minor":"6","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"37.47"}]},{"checkPoint":"2014-08-13 03:27:29:7930","beaconPKG":[{"major":"0","minor":"6","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"-1.00"},{"major":"0","minor":"2","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"4.20"},{"major":"0","minor":"4","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"11.06"},{"major":"0","minor":"5","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"11.47"},{"major":"0","minor":"3","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"13.92"},{"major":"0","minor":"1","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"22.79"}]},{"checkPoint":"2014-08-13 03:27:30:2930","beaconPKG":[{"major":"0","minor":"6","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"-1.00"},{"major":"0","minor":"2","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"4.20"},{"major":"0","minor":"4","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"11.06"},{"major":"0","minor":"5","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"11.47"},{"major":"0","minor":"3","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"13.92"},{"major":"0","minor":"1","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"22.79"}]}]}];
    this.mpgAjax=mpgAjax;
}
Calculation.prototype = {
    delKeyZero:function(next){//格式化数据：eg 删除无效记录及不足3个点的记录
        var mpgAjax=this.mpgAjax;
        if(mpgAjax instanceof Array){
            console.log('发过来的数据不是数组');
            return false;
        }
        for (var i = 0, L=mpgAjax.length; i <L; i++) {//循环所有手机
            var currTel=mpgAjax[i];//当前手机
            var mPackage=currTel.monitorPackage;//当前手机的“点-包”
            for(var j=0;j<mPackage.length;j++){
                var bPKGL=mPackage[j].beaconPKG;
                for(var m=0;m<bPKGL.length;m++){//删<0的距离节点
                    if(parseFloat(bPKGL[m].acc)<0){
                        bPKGL.splice(m,1);
                        m--;
                    }
                }

                if(bPKGL.length<3){//不足3个点，删除此记录
                   console.log('不足3个点，delete record');
                   mPackage.splice(j,1);
                   j--;
                }
                else{
                    var _v5=[];
                    for(var k=0;k<bPKGL.length;k++){
                        _v5.push(k);
                    }
                    mPackage[j].comb=Combine(_v5,bPKGL.length,3);
                }
            }
            console.log('bPKGL处理后：',bPKGL);
        }
        console.log('mpgAjax：',mpgAjax);
        this.result(next);
    },
    result: function (next) {
        var mpgAjax=this.mpgAjax;
        for (var i = 0, L=mpgAjax.length; i <L; i++) {//循环所有手机
            var currTel=mpgAjax[i];//当前手机
            var mPackage=currTel.monitorPackage,//当前手机的“点-包”
                bCPos=[];//存放计算后最终点坐标

            for(var n=0;n<mPackage.length;n++){
                var cBPKG=mPackage[n].beaconPKG, //当前手机“点-包” 之“详细点”
                    Ccomb=mPackage[n].comb;//需要取得下标志

                console.log('当前包的点beaconPKG:',cBPKG);
                for(var j=0;j<Ccomb.length;j++){
                    var down_comb=Ccomb[j];
                    var findXY=[];//findTel存放某设备的坐标+距离acc
                    var c0=cBPKG[down_comb[0]],//所需要的3个点 对应："beaconPKG": [ {"uuid": "a0", "acc": "5.74"}}
                        c1=cBPKG[down_comb[1]],//down_comb[0]是下标
                        c2=cBPKG[down_comb[2]];

                    var sbArr=[c0,c1,c2];
                    for(var k=0;k<sbArr.length;k++){
                        for(var m=0;m<uuidArr_L;m++){
                            var uuidT=sbArr[k].uuid+'_'+sbArr[k].major+"_"+sbArr[k].minor;
                            if(uuidT==uuidArr[m].pointSB){
                                console.log('kk:',uuidT,uuidArr[m].pointSB);
                                uuidArr[m].Cacc=sbArr[k].acc;//每次都重新赋值
                                findXY.push(uuidArr[m]);
                                console.log('qq',findXY,findXY.length);
                                break;
                            }
                        }
                    }

                    var d=Math.sqrt(Math.pow(findXY[0].x-findXY[1].x,2)+  Math.pow(findXY[0].y-findXY[1].y,2));//a平方+b平方=c平方
                    var x = ( Math.pow(findXY[0].Cacc,2) - Math.pow(findXY[1].Cacc,2) + Math.pow(d,2) ) / (2*d);
                    var y = ( Math.pow(findXY[0].Cacc,2) - Math.pow(findXY[2].Cacc,2) - Math.pow(x,2) + Math.pow((x-findXY[2].x),2) + Math.pow(findXY[2].y,2))/(2*findXY[2].y);
                    console.log('距离d',d);
                    bCPos.push({x:x,y:y});
                    console.log('bCPos',x,y);
                    if(j==Ccomb.length-1&&n==mPackage.length-1){//最后一个点的计算完成且该手机包点最后一条记录计算完成。。
                        currTelResule.push({deviceID:currTel.deviceSerial,timePoint:mPackage[mPackage.length-1].checkPoint,beaconCanculatePosition:bCPos});
                    }
                }
            }
        }
        console.log('结果：',currTelResule);
        next&&next(currTelResule);
    }
}

module.exports=Calculation;
//var Cal = new Calculation();
//Cal.delKeyZero();
//route...http  redis 发送和接受。。。

