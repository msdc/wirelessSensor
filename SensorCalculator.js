/**
 * Created by Administrator on 2014/8/19.
 */
var trilateration = require("./Trilateration.js");
var kmeans = require("./KMeansClustering.js");

function SensorDataCalculator() {};

SensorDataCalculator.processCalculate = function (sourceData) {
    var tpNDataArray = [];
    var finalResult = [];
    var dataObj;
    try {
        dataObj = JSON.parse(sourceData);
    }
    catch (e) {
        return;
    }
    //exclude incorrect data.
    if (!dataObj.deviceSerial) {
        return;
    }

    tpNDataArray.push(dataObj);
    var trlCal = new trilateration(tpNDataArray);
    //清除空点
    trlCal.cleanZeroKey();
    //三点定一点
    var levelOneResult = trlCal.getCalResult();
    //聚类计算
    if (levelOneResult && levelOneResult.length > 0) {
        for (var point in levelOneResult) {
            if (levelOneResult[point].beaconCalculatePosition) {
                continue;
            }
            var levelTwoResult = kmeans.GetClusteredPoint(levelOneResult[point]);
            finalResult.push((levelTwoResult));
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
}

SensorDataCalculator.filterDataByAcc = function (sourceData,filterValue) {
    var tpPkg = sourceData.monitorPackage;
    if (tpPkg) {
        tpPkg.each(function (pkg) {
            var tpTimeStamp = pkg.checkPoint;
            var beaconNodes = pkg.beaconPKG;
            if (beaconNodes&&beaconNodes.length > 3) {
                    beaconNodes.each(function(tpNode){
                        if(parseInt(tpNode.acc)>parseInt(filterValue)){
                            beaconNodes.remove(tpNode);
                        }
                    });
                pkg.beaconPKG=beaconNodes;
            }
        });
    }
    sourceData.monitoring=tpPkg;
    return sourceData;
}

module.exports = SensorDataCalculator;

