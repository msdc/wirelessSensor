var config = require('./../config.js');
function Calculation() {
    //var mpgAjax=[{"deviceSerial":"F2LJMKYDDTWD","deviceName":"Ning’s iPhone","monitorPackage":[{"checkPoint":"2014-08-13 03:27:25:7930","beaconPKG":[{"major":"0","minor":"2","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"3.84"},{"major":"0","minor":"4","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"10.79"},{"major":"0","minor":"5","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"11.50"},{"major":"0","minor":"3","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"13.64"},{"major":"0","minor":"1","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"23.54"},{"major":"0","minor":"6","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"39.23"}]},{"checkPoint":"2014-08-13 03:27:26:2930","beaconPKG":[{"major":"0","minor":"2","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"3.84"},{"major":"0","minor":"4","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"10.79"},{"major":"0","minor":"5","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"11.50"},{"major":"0","minor":"3","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"13.64"},{"major":"0","minor":"1","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"23.54"},{"major":"0","minor":"6","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"39.23"}]},{"checkPoint":"2014-08-13 03:27:26:7930","beaconPKG":[{"major":"0","minor":"2","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"3.91"},{"major":"0","minor":"4","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"10.87"},{"major":"0","minor":"5","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"11.43"},{"major":"0","minor":"3","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"13.79"},{"major":"0","minor":"1","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"23.89"},{"major":"0","minor":"6","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"38.89"}]},{"checkPoint":"2014-08-13 03:27:27:2930","beaconPKG":[{"major":"0","minor":"2","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"3.91"},{"major":"0","minor":"4","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"10.87"},{"major":"0","minor":"5","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"11.43"},{"major":"0","minor":"3","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"13.79"},{"major":"0","minor":"1","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"23.89"},{"major":"0","minor":"6","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"38.89"}]},{"checkPoint":"2014-08-13 03:27:27:7930","beaconPKG":[{"major":"0","minor":"4","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"-1.00"},{"major":"0","minor":"6","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"-1.00"},{"major":"0","minor":"2","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"4.04"},{"major":"0","minor":"5","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"11.48"},{"major":"0","minor":"3","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"13.93"},{"major":"0","minor":"1","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"23.45"}]},{"checkPoint":"2014-08-13 03:27:28:2930","beaconPKG":[{"major":"0","minor":"4","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"-1.00"},{"major":"0","minor":"6","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"-1.00"},{"major":"0","minor":"2","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"4.04"},{"major":"0","minor":"5","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"11.48"},{"major":"0","minor":"3","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"13.93"},{"major":"0","minor":"1","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"23.45"}]},{"checkPoint":"2014-08-13 03:27:28:7930","beaconPKG":[{"major":"0","minor":"2","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"3.97"},{"major":"0","minor":"4","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"10.89"},{"major":"0","minor":"5","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"11.48"},{"major":"0","minor":"3","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"13.73"},{"major":"0","minor":"1","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"23.18"},{"major":"0","minor":"6","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"37.47"}]},{"checkPoint":"2014-08-13 03:27:29:2930","beaconPKG":[{"major":"0","minor":"2","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"3.97"},{"major":"0","minor":"4","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"10.89"},{"major":"0","minor":"5","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"11.48"},{"major":"0","minor":"3","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"13.73"},{"major":"0","minor":"1","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"23.18"},{"major":"0","minor":"6","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"37.47"}]},{"checkPoint":"2014-08-13 03:27:29:7930","beaconPKG":[{"major":"0","minor":"6","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"-1.00"},{"major":"0","minor":"2","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"4.20"},{"major":"0","minor":"4","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"11.06"},{"major":"0","minor":"5","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"11.47"},{"major":"0","minor":"3","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"13.92"},{"major":"0","minor":"1","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"22.79"}]},{"checkPoint":"2014-08-13 03:27:30:2930","beaconPKG":[{"major":"0","minor":"6","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"-1.00"},{"major":"0","minor":"2","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"4.20"},{"major":"0","minor":"4","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"11.06"},{"major":"0","minor":"5","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"11.47"},{"major":"0","minor":"3","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"13.92"},{"major":"0","minor":"1","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"22.79"}]}]}];
    //this.mpgAjax = mpgAjax;
    this.tStart = new Date().getTime();
    this.uuidArr = config.uuidArr();//外部配置的数据
}

Calculation.prototype = {
    cleanZeroKey: function (sourceObjData) {//格式化数据：eg 删除无效记录及不足3个点的记录
        //var mpgAjax = this.mpgAjax;
        //for (var i = 0, L = mpgAjax.length; i < L; i++) {//循环所有手机
            var currTel = sourceObjData;//当前手机
            var mPackage = currTel.monitorPackage;//当前手机的“点-包”
            for (var j = 0; j < mPackage.length; j++) {
                var bPKGL = mPackage[j].beaconPKG;
                for (var m = 0; m < bPKGL.length; m++) {//删<0的距离节点
                    if (parseFloat(bPKGL[m].acc) < 0) {
                        bPKGL.splice(m, 1);
                        m--;
                    }
                }
                if (bPKGL.length < 3) {//不足3个点，删除此记录
                    console.log('不足3个点，delete record');
                    mPackage.splice(j, 1);
                    j--;
                }
            }
            console.log('bPKGL处理后：', bPKGL);
        //}
        //console.log('mpgAjax：', currTel);
        //this.result(next);
        return currTel;
    },
    getCalResult: function (sourceObjData) {
        //var mpgAjax = this.mpgAjax;
        var currPointCom = [];//当前点产生的多个组合的最终结果
        //for (var i = 0; i < mpgAjax.length; i++) {//循环所有手机
            var currTel = sourceObjData;//当前手机
            var mPackage = currTel.monitorPackage;//当前手机的“点-包”

            for (var n = 0; n < mPackage.length; n++) {
                var cBPKG = mPackage[n].beaconPKG; //当前手机“点-包” 之“详细点”
                var bCPos = [];//点的每个组合计算出的坐标
                var findXY = [];//findTel存放某设备的坐标+距离acc
                var sbArr = [cBPKG[0], cBPKG[1], cBPKG[2]];//永远只取前三个点计算
                for (var k = 0; k < sbArr.length; k++) {
                    var tpDeviceKey = sbArr[k].uuid + '_' + sbArr[k].major + "_" + sbArr[k].minor;
                    tpDeviceKey = tpDeviceKey.toUpperCase();
                    var uuidT = this.uuidArr[tpDeviceKey];
                    //console.log('uuidT',uuidT,sbArr[k].acc);
                    findXY.push({acc: sbArr[k].acc, x: uuidT.x, y: uuidT.y});//取X Y +ACC
                }
                var resP = this.getTrilateration(findXY[0], findXY[1], findXY[2], findXY[0].acc, findXY[1].acc, findXY[2].acc);
                if (isNaN(resP.x) || isNaN(resP.y) || resP.x == -Infinity || resP.x == Infinity || resP.y == -Infinity || resP.y == Infinity) {
                    console.log('不存', resP);
                } else {
                    bCPos.push(resP);
                }
                currPointCom.push({
                    deviceID: currTel.deviceName,
                    deviceSerial: currTel.deviceSerial,
                    timePoint: mPackage[n].checkPoint,
                    beaconCalculatePosition: bCPos});
            }
        //}
        //console.log('总个数:' + currPointCom.length, '结果：', currPointCom, '本次计算时间:', (new Date().getTime()) - that.tStart);
        return currPointCom;
    },
    getTrilateration: function (pos1, pos2, pos3, distToPos1, distToPos2, distToPos3) {
        var xa = pos1.x, ya = pos1.y, xb = pos2.x,
            yb = pos2.y, xc = pos3.x, yc = pos3.y,
            ra = distToPos1, rb = distToPos2, rc = distToPos3;

        var S = (Math.pow(xc, 2) - Math.pow(xb, 2) + Math.pow(yc, 2) - Math.pow(yb, 2) + Math.pow(rb, 2) - Math.pow(rc, 2)) / 2;
        var T = (Math.pow(xa, 2) - Math.pow(xb, 2) + Math.pow(ya, 2) - Math.pow(yb, 2) + Math.pow(rb, 2) - Math.pow(ra, 2)) / 2;
        var y = ((T * (xb - xc)) - (S * (xb - xa))) / (((ya - yb) * (xb - xc)) - ((yc - yb) * (xb - xa)));
        var x = ((y * (ya - yb)) - T) / (xb - xa);
        var position = {x: 0, y: 0};
        position.x = x;
        position.y = y;
        console.log('oneCom:', pos1, pos2, pos3, distToPos1, distToPos2, distToPos3, '计算出：', position)
        return position;
    }
}

module.exports = Calculation;
//var Cal = new Calculation();
//Cal.cleanZeroKey();


