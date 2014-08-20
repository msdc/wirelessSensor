/**
 * Created by Administrator on 2014/8/19.
 */
var trilateration = require("./Trilateration.js");
var kmeans = require("./KMeansClustering.js");

function SensorDataCalculator() {
};

SensorDataCalculator.processCalculate = function (sourceData) {
    //var tpNDataArray = [];
    var finalResult = [];
    var dataObj;
    try {
        dataObj = JSON.parse(sourceData);
        dataObj = SensorDataCalculator.filterDataByAcc(dataObj, '5');
    }
    catch (e) {
        return;
    }
    //exclude incorrect data.
    if (!dataObj.deviceSerial) {
        return;
    }

    //tpNDataArray.push(dataObj);
    var trlCal = new trilateration();
    //清除空点
    dataObj= trlCal.cleanZeroKey(dataObj);
    //三点定一点
    var levelOneResult = trlCal.getCalResult(dataObj);
    //聚类计算
    if (levelOneResult && levelOneResult.length > 0) {
        for (var point in levelOneResult) {
            if (!levelOneResult[point].beaconCalculatePosition) {
                continue;
            }
            //var levelTwoResult = kmeans.GetClusteredPoint(levelOneResult[point]);
            finalResult.push((levelOneResult[point]));
        }
    }
    return finalResult;
    /*    trlCal.cleanZeroKey(function (pointDt) {
     for (var point in pointDt) {
     if (!pointDt[point].beaconCalculatePosition) break;//skip incorrect data in redis.
     kmeans.GetClusteredPoint(pointDt[point], function (finalPoint) {
     //socket.emit('result',finalPoint);
     //io.emit('result', finalPoint);
     console.log("deviceID=" + finalPoint.deviceID);
     console.log("timePoint=" + finalPoint.timePoint);
     console.log("deviceSerial=" + finalPoint.deviceSerial);
     console.log("beaconCanculatedPosition=[{\"x\"=" + finalPoint.beaconCalculatePosition[0].x + ",\"y=\"" + finalPoint.beaconCalculatePosition[0].y + "}]");
     //todo write back info the redis and trigger postback event using websocket
     //Save to the redis
     //SensorDataCalculator.saveToRedis(finalPoint);
     });
     }
     });*/
};

SensorDataCalculator.getKeyBeforeCalculate = function (deviceSerial) {
    var timespan = (new Date()).getTime();
    var key = null;
    if (deviceSerial) {
        key = deviceSerial + "_" + timespan;
    }
    return key;
};

SensorDataCalculator.getKeyAfterCalculate = function (deviceSerial) {
    var timespan = (new Date()).getTime();
    var key = null;
    if (deviceSerial) {
        key = deviceSerial + "_" + timespan + "_" + "Calculated";
    }
    return key;
};

SensorDataCalculator.processSingleLineCalculate = function (sourceData) {
    var finalResult = [];
    var dataObj;
    try {
        dataObj = JSON.parse(sourceData);
        if (!dataObj.deviceSerial) {
            return;
        }
    }
    catch (e) {
        console.log(e);
        return;
    }
    //todo add singleLine method to mark the node.
}

SensorDataCalculator.filterDataByAcc = function (sourceData, filterValue) {
    var finalResult = {};
    var tpPkg = sourceData.monitorPackage;
    finalResult.deviceSerial = sourceData.deviceSerial;
    finalResult.deviceName = sourceData.deviceName;
    if (tpPkg) {
        var rtPKG = [];
        for (var pkIndex in tpPkg) {
            var pkg = tpPkg[pkIndex];
            var rtNode = {};
            rtNode.checkPoint = pkg.checkPoint;
            var beaconNodes = pkg.beaconPKG;
            beaconNodes.sort(function(a,b){
                return parseInt(a.acc)-parseInt(b.acc);
            });
            var rtBeaconNodes = [];
            if (beaconNodes && beaconNodes.length > 3) {
                for (var i = 0; i < beaconNodes.length; i++) {
                    if (parseInt(beaconNodes[i].acc) > parseInt((filterValue))) {
                        continue;
                    }
                    else {
                        rtBeaconNodes.push(beaconNodes[i]);
                    }
                }
            }
            else {
                rtBeaconNodes.push(beaconNodes);
            }
            rtNode.beaconPKG = rtBeaconNodes;
            rtPKG.push(rtNode);
        }
        finalResult.monitorPackage = rtPKG;
    }
    //sourceData.monitoring=tpPkg;
    return finalResult;
}

SensorDataCalculator.combineExtendData = function (monitorPkgNode) {
    var finalResult = {};
    var tpPkg = sourceData.monitorPackage;
    finalResult.deviceSerial = sourceData.deviceSerial;
    finalResult.deviceName = sourceData.deviceName;
    if (tpPkg) {
        var rtPKG = [];
        for (var pkIndex in tpPkg) {
            var pkg = tpPkg[pkIndex];
            var rtNode = {};
            var beaconNodes = pkg.beaconPKG;
            if (beaconNodes && beaconNodes.length > 3) {//如果大于三，进行排列组合，然后把排列组合后的新集合加入到rtPKG集合中
                rtPKG.push(SensorDataCalculator.combinePerPkgNode(pkg));
                continue;
            }
            else {//如果等于或者小于三个点，就直接丢回去。
                rtNode.checkPoint = pkg.checkPoint;
                rtNode.beaconPKG = beaconNodes;
                rtPKG.push(rtNode);
            }
        }
        finalResult.monitorPackage = rtPKG;
    }
    //sourceData.monitoring=tpPkg;
    return finalResult;
}

SensorDataCalculator.combinePerPkgNode = function (monitorPkgNode) {
    var finalExtendNodeArray = [];
    var beaconPkg = monitorPkgNode.beaconPKG;
    var CN3 = [];
    for (var k = 0; k < beaconPkg.length; k++) {
        CN3.push(k);
    }
    var markNodeArray = SensorDataCalculator.combine(CN3, beaconPkg.length, 3);
    for (var i = 0; i < markNodeArray.length; i++) {
        var rtMonitorPkgNode = {};
        var rtBeaconPkg = [];
        rtMonitorPkgNode.checkPoint = monitorPkgNode.checkPoint;
        var perCombine = markNodeArray[i];
        var c0 = perCombine[0];
        var c1 = perCombine[1];
        var c2 = perCombine[2];
        rtBeaconPkg.push(beaconPkg[c0]);
        rtBeaconPkg.push(beaconPkg[c1]);
        rtBeaconPkg.push(beaconPkg[c2]);
        rtMonitorPkgNode.beaconPKG = rtBeaconPkg;
        finalExtendNodeArray.push(rtMonitorPkgNode);
    }
    return finalExtendNodeArray;
}

SensorDataCalculator.combine = function (inputArray, totalNum, chooseNum) {//产生组合

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

module.exports = SensorDataCalculator;