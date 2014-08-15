var deviceConfig = require('./deviceConfig');

function Calculation(mpgAjax) {
    //var mpgAjax=[{"deviceSerial":"F2LJMKYDDTWD","deviceName":"Ning’s iPhone","monitorPackage":[{"checkPoint":"2014-08-13 03:27:25:7930","beaconPKG":[{"major":"0","minor":"2","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"3.84"},{"major":"0","minor":"4","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"10.79"},{"major":"0","minor":"5","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"11.50"},{"major":"0","minor":"3","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"13.64"},{"major":"0","minor":"1","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"23.54"},{"major":"0","minor":"6","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"39.23"}]},{"checkPoint":"2014-08-13 03:27:26:2930","beaconPKG":[{"major":"0","minor":"2","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"3.84"},{"major":"0","minor":"4","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"10.79"},{"major":"0","minor":"5","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"11.50"},{"major":"0","minor":"3","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"13.64"},{"major":"0","minor":"1","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"23.54"},{"major":"0","minor":"6","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"39.23"}]},{"checkPoint":"2014-08-13 03:27:26:7930","beaconPKG":[{"major":"0","minor":"2","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"3.91"},{"major":"0","minor":"4","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"10.87"},{"major":"0","minor":"5","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"11.43"},{"major":"0","minor":"3","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"13.79"},{"major":"0","minor":"1","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"23.89"},{"major":"0","minor":"6","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"38.89"}]},{"checkPoint":"2014-08-13 03:27:27:2930","beaconPKG":[{"major":"0","minor":"2","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"3.91"},{"major":"0","minor":"4","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"10.87"},{"major":"0","minor":"5","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"11.43"},{"major":"0","minor":"3","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"13.79"},{"major":"0","minor":"1","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"23.89"},{"major":"0","minor":"6","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"38.89"}]},{"checkPoint":"2014-08-13 03:27:27:7930","beaconPKG":[{"major":"0","minor":"4","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"-1.00"},{"major":"0","minor":"6","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"-1.00"},{"major":"0","minor":"2","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"4.04"},{"major":"0","minor":"5","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"11.48"},{"major":"0","minor":"3","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"13.93"},{"major":"0","minor":"1","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"23.45"}]},{"checkPoint":"2014-08-13 03:27:28:2930","beaconPKG":[{"major":"0","minor":"4","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"-1.00"},{"major":"0","minor":"6","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"-1.00"},{"major":"0","minor":"2","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"4.04"},{"major":"0","minor":"5","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"11.48"},{"major":"0","minor":"3","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"13.93"},{"major":"0","minor":"1","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"23.45"}]},{"checkPoint":"2014-08-13 03:27:28:7930","beaconPKG":[{"major":"0","minor":"2","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"3.97"},{"major":"0","minor":"4","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"10.89"},{"major":"0","minor":"5","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"11.48"},{"major":"0","minor":"3","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"13.73"},{"major":"0","minor":"1","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"23.18"},{"major":"0","minor":"6","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"37.47"}]},{"checkPoint":"2014-08-13 03:27:29:2930","beaconPKG":[{"major":"0","minor":"2","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"3.97"},{"major":"0","minor":"4","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"10.89"},{"major":"0","minor":"5","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"11.48"},{"major":"0","minor":"3","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"13.73"},{"major":"0","minor":"1","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"23.18"},{"major":"0","minor":"6","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"37.47"}]},{"checkPoint":"2014-08-13 03:27:29:7930","beaconPKG":[{"major":"0","minor":"6","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"-1.00"},{"major":"0","minor":"2","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"4.20"},{"major":"0","minor":"4","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"11.06"},{"major":"0","minor":"5","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"11.47"},{"major":"0","minor":"3","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"13.92"},{"major":"0","minor":"1","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"22.79"}]},{"checkPoint":"2014-08-13 03:27:30:2930","beaconPKG":[{"major":"0","minor":"6","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"-1.00"},{"major":"0","minor":"2","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"4.20"},{"major":"0","minor":"4","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"11.06"},{"major":"0","minor":"5","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"11.47"},{"major":"0","minor":"3","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"13.92"},{"major":"0","minor":"1","uuid":"E2C56DB5-DFFB-48D2-B060-D0F5A71096E0","beaconBLE":"","acc":"22.79"}]}]}];
    this.mpgAjax = mpgAjax;
    this.tStart = new Date().getTime();
    this.uuidArr = deviceConfig.uuidArr();//外部配置的数据
    this.uuidArr_L = this.uuidArr.length;
}

Calculation.prototype = {
    delKeyZero: function (next) {//格式化数据：eg 删除无效记录及不足3个点的记录
        var mpgAjax = this.mpgAjax;
        for (var i = 0, L = mpgAjax.length; i < L; i++) {//循环所有手机
            var currTel = mpgAjax[i];//当前手机
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
                else {
                    var _v5 = [];
                    for (var k = 0; k < bPKGL.length; k++) {
                        _v5.push(k);
                    }
                    mPackage[j].comb = this.combine(_v5, bPKGL.length, 3);
                }
            }
            console.log('bPKGL处理后：', bPKGL);
        }
        console.log('mpgAjax：', mpgAjax);
        this.result(next);
    },
    result: function (next) {
        var that = this;
        var mpgAjax = this.mpgAjax;
        var currPointCom = [];//当前点产生的多个组合的最终结果
        for (var i = 0, L = mpgAjax.length; i < L; i++) {//循环所有手机
            var currTel = mpgAjax[i];//当前手机
            var mPackage = currTel.monitorPackage;//当前手机的“点-包”

            for (var n = 0; n < mPackage.length; n++) {
                var cBPKG = mPackage[n].beaconPKG, //当前手机“点-包” 之“详细点”
                    Ccomb = mPackage[n].comb;//需要取得下标志
                var bCPos = [];//点的每个组合计算出的坐标
                //console.log('当前包的点beaconPKG:',cBPKG,Ccomb);
                for (var j = 0; j < Ccomb.length; j++) {
                    var down_comb = Ccomb[j];//每个Ccomb[j]中存放一个组合:eg:[0,1,2]  [0,1,3]
                    var findXY = [];//findTel存放某设备的坐标+距离acc
                    var c0 = cBPKG[down_comb[0]],//所需要的3个点 对应："beaconPKG": [ {"uuid": "a0", "acc": "5.74"}}
                        c1 = cBPKG[down_comb[1]],//down_comb[0]是下标
                        c2 = cBPKG[down_comb[2]];

                    var sbArr = [c0, c1, c2];
                    for (var k = 0; k < sbArr.length; k++) {
                        var uuidT = that.uuidArr[sbArr[k].uuid + '_' + sbArr[k].major + "_" + sbArr[k].minor];
                        //console.log('uuidT',uuidT,sbArr[k].acc);
                        findXY.push({acc: sbArr[k].acc, x: uuidT.x, y: uuidT.y});//取X Y +ACC
                    }
                    var resP = that.getTrilateration(findXY[0], findXY[1], findXY[2], findXY[0].acc, findXY[1].acc, findXY[2].acc);
                    if (isNaN(resP.x) || isNaN(resP.y)||resP.x==-Infinity||resP.x==Infinity||resP.y==-Infinity||resP.y==Infinity) {
                        console.log('不存', resP);
                    } else {
                        bCPos.push(resP);
                    }

                    if (j == Ccomb.length - 1) {//最后一个点的计算完成且该手机包点最后一条记录计算完成。。
                        currPointCom.push({
                            deviceID: currTel.deviceName,
                            deviceSerial: currTel.deviceSerial,
                            timePoint: mPackage[n].checkPoint,
                            beaconCalculatePosition: bCPos});
                    }
                }
            }
        }
        console.log('总个数:' + currPointCom.length, '结果：', currPointCom, '本次计算时间:', (new Date().getTime()) - that.tStart);
        next(currTelResule);
    },
    getTrilateration: function (pos1, pos2, pos3, distToPos1, distToPos2, distToPos3) {
        var xa = pos1.x, ya = pos1.y, xb = pos2.x,
            yb = pos2.y, xc = pos3.x, yc = pos3.y,
            ra = distToPos1, rb = distToPos2, rc = distToPos3;

        var S = (Math.pow(xc, 2) - Math.pow(xb, 2) + Math.pow(yc, 2) - Math.pow(yb, 2) + Math.pow(rb, 2) - Math.pow(rc, 2)) / 2;
        var T = (Math.pow(xa, 2) - Math.pow(xb, 2) + Math.pow(ya, 2) - Math.pow(yb, 2) + Math.pow(rb, 2) - Math.pow(ra, 2)) / 2;
        var y = ((T * (xb - xc)) - (S * (xb - xa))) / (((ya - yb) * (xb - xc)) - ((yc - yb) * (xb - xa)));
        var x = ((y * (ya - yb)) - T) / (xb - xa);
        var position = {
            x: 0,
            y: 0
        };
        position.x = x;
        position.y = y;
        console.log('oneCom:', pos1, pos2, pos3, distToPos1, distToPos2, distToPos3, '计算出：', position)
        return position;
    },
    combine: function (inputArray, totalNum, chooseNum) {//产生组合

        chooseNum = chooseNum > totalNum ? totalNum : chooseNum;

        var order = [chooseNum + 1];
        var outputArray = [];
        for (var i = 0; i <= chooseNum; i++) {
            order[i] = i - 1;
        }
        // 注意这里order[0]=-1用来作为循环判断标识
        var count = 0;
        var k = chooseNum;
        var flag = true;           // 标志找到一个有效组合
        while (order[0]) {
            // 输出符合要求的组合
            if (flag) {
                var tpObj = [];
                for (i = 1; i <= chooseNum; i++) {
                    //console.log(a[order[i]]);
                    tpObj.push(inputArray[order[i]]);
                }
                outputArray.push(tpObj);
                count++;
                flag = false;
            }
            // 在当前位置选择新的数字
            order[k]++;
            // 当前位置已无数字可选，回溯
            if (order[k] == totalNum) {
                order[k--] = 0;
                continue;
            }
            // 更新当前位置的下一位置的数字
            if (k < chooseNum) {
                order[++k] = order[k - 1];
                continue;
            }

            if (k == chooseNum) {
                flag = true;
            }
        }
        return outputArray;
    }
}

module.exports = Calculation;
//var Cal = new Calculation();
//Cal.delKeyZero();


