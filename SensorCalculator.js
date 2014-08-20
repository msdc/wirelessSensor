/**
 * Created by Administrator on 2014/8/19.
 */
var trilateration = require("./Trilateration.js");
var kmeans = require("./KMeansClustering.js");
var deviceConfig=require('./deviceConfig.js');

function SensorDataCalculator() {};

function MonitorPackageHandler(monitorPackage){
    this.monitorPackage=monitorPackage||{};
    this.beaconArray=deviceConfig.uuidArr();
    this.prefixString='E2C56DB5-DFFB-48D2-B060-D0F5A71096E0_0_';
}

MonitorPackageHandler.prototype.getBeaconDistance=function(beaconIndex){
    var beaconIndex=beaconIndex||0;
    var beaconArray=this.beaconArray;
    var prefixString=this.prefixString;
    var beaconObj=beaconArray[prefixString+String(beaconIndex)];
    if(beaconObj){
        return beaconObj.x;
    }
    return null;
};

MonitorPackageHandler.prototype.getMinorsArray=function(){
    var monitorPackage=this.monitorPackage;
    var minor=[];
    for(var beaconPkgIndex in monitorPackage){
        var beaconPKG=monitorPackage[beaconPkgIndex].beaconPKG;
        for(var beaconIndex in beaconPKG){
            var beaconObj=beaconPKG[beaconIndex];
            minor.push(beaconObj.minor);
        }
    }
    return minor;
};

MonitorPackageHandler.prototype.getAccValue=function(monitorPackage,minorIndex){
    var monitorPackage=monitorPackage||{};
    var accValue=null;
    var minorIndex=Number(minorIndex);
    for(var beaconPkgIndex in monitorPackage){
        var beaconPKG=monitorPackage[beaconPkgIndex].beaconPKG;
        for(var beaconIndex in beaconPKG){
            var beaconObj=beaconPKG[beaconIndex];
            var minorValue=Number(beaconObj.minor);
            if(minorIndex===minorValue){
                accValue=beaconObj.acc;
                break;
            }
        }
    }

    return accValue;
};

MonitorPackageHandler.prototype.getAverageMonitorPackage=function(){
    var monitorPackage=this.monitorPackage;
    var result=[];
    var sumDistanceBeaconOne=0;
    var sumDistanceBeaconTwo=0;
    var sumDistanceBeaconThree=0;
    var sumDistanceBeaconFour=0;
    var sumDistanceBeaconFive=0;
    var sumDistanceBeaconSix=0;
    var beaconPkgCounts=0;//save counts of the monitorPackage.
    for(var beaconPkgIndex in monitorPackage){
        beaconPkgCounts++;
        var beaconPKG=monitorPackage[beaconPkgIndex].beaconPKG;
        for(var beaconIndex in beaconPKG){
            var beaconObj=beaconPKG[beaconIndex];

            var minor=Number(beaconObj.minor);
            var acc=Number(beaconObj.acc);
            switch(minor){
                case 1:
                    sumDistanceBeaconOne+=acc;
                    break;
                case 2:
                    sumDistanceBeaconTwo+=acc;
                    break;
                case 3:
                    sumDistanceBeaconThree+=acc;
                    break;
                case 4:
                    sumDistanceBeaconFour+=acc;
                    break;
                case 5:
                    sumDistanceBeaconFive+=acc;
                    break;
                case 6:
                    sumDistanceBeaconSix+=acc;
                    break;
            }
        }
    }

    var averageResult={"major": "0", "minor": "1", "uuid": "E2C56DB5-DFFB-48D2-B060-D0F5A71096E0", "beaconBLE": "", "acc": sumDistanceBeaconOne/beaconPkgCounts};
    result.push(averageResult);
    averageResult={"major": "0", "minor": "2", "uuid": "E2C56DB5-DFFB-48D2-B060-D0F5A71096E0", "beaconBLE": "", "acc": sumDistanceBeaconTwo/beaconPkgCounts};
    result.push(averageResult);
    averageResult={"major": "0", "minor": "3", "uuid": "E2C56DB5-DFFB-48D2-B060-D0F5A71096E0", "beaconBLE": "", "acc": sumDistanceBeaconThree/beaconPkgCounts};
    result.push(averageResult);
    averageResult={"major": "0", "minor": "4", "uuid": "E2C56DB5-DFFB-48D2-B060-D0F5A71096E0", "beaconBLE": "", "acc": sumDistanceBeaconFour/beaconPkgCounts};
    result.push(averageResult);
    averageResult={"major": "0", "minor": "5", "uuid": "E2C56DB5-DFFB-48D2-B060-D0F5A71096E0", "beaconBLE": "", "acc": sumDistanceBeaconFive/beaconPkgCounts};
    result.push(averageResult);
    averageResult={"major": "0", "minor": "6", "uuid": "E2C56DB5-DFFB-48D2-B060-D0F5A71096E0", "beaconBLE": "", "acc": sumDistanceBeaconSix/beaconPkgCounts};
    result.push(averageResult);

    var lastestCheckPoint=monitorPackage[monitorPackage.length-1].checkPoint;

    var finalResult=[];
    var packageObj={};
    packageObj.checkPoint=lastestCheckPoint;
    packageObj.beaconPKG=result;
    finalResult.push(packageObj);

    return finalResult;
};

/**
 * @参数 indexArg0:第1个beacon的索引   indexArg1:第2个beacon的索引
* */
MonitorPackageHandler.prototype.getFinalDistance=function(monitorPackageHandler,monitorPackage,indexArg0,indexArg1){
    var resultArray=[];
    var monitorPackageHandler=monitorPackageHandler||{};
    var monitorPackage=monitorPackage||{};
    var firstBeaconIndex=Number(indexArg0)||0;
    var secondBeaconIndex=Number(indexArg1)||0;

    //实际设备到beacon1的距离
    var d1=monitorPackageHandler.getAccValue(monitorPackage,firstBeaconIndex);
    //实际设备到beacon2的距离
    var d2=monitorPackageHandler.getAccValue(monitorPackage,secondBeaconIndex);
    //二元方程中的x平方前的系数
    var factor1=Math.pow((d1/d2-1),2);
    //beacon1点预设的初始距离
    var b1=monitorPackageHandler.getBeaconDistance(firstBeaconIndex);
    //beacon2点预设的初始距离
    var b2=monitorPackageHandler.getBeaconDistance(secondBeaconIndex);
    //二元方程中的x前的系数
    var factor2=2*b1-Math.pow((d1/d2),2)*2*b2;
    //二元方程上的常数
    var factor3=Math.pow((d1/d2),2)*Math.pow(b2,2)-Math.pow(b1,2);

    var result1=(-factor2+Math.sqrt(Math.pow(factor2,2)-4*factor1*factor3))/2*factor1;
    resultArray.push(result1);
    var result2=(-factor2-Math.sqrt(Math.pow(factor2,2)-4*factor1*factor3))/2*factor1;
    resultArray.push(result2);

    return resultArray;
};

SensorDataCalculator.processCalculate = function (sourceData) {
    var tpNDataArray = [];
    var finalResult=[];
    var dataObj;
    try {
        dataObj = JSON.parse(sourceData);
        dataObj=SensorDataCalculator.filterDataByAcc(dataObj,'20');
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
    var levelOneResult=trlCal.getCalResult();
    //聚类计算
    if(levelOneResult&&levelOneResult.length>0){
        for(var point in levelOneResult){
            if(!levelOneResult[point].beaconCalculatePosition) {
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

SensorDataCalculator.getKeyBeforeCalculate=function(deviceSerial){
    var timespan = (new Date()).getTime();
    var key=null;
    if(deviceSerial)
    {
        key = deviceSerial + "_" + timespan;
    }
    return key;
};

SensorDataCalculator.getKeyAfterCalculate=function(deviceSerial){
    var timespan = (new Date()).getTime();
    var key=null;
    if(deviceSerial)
    {
        key = deviceSerial + "_" + timespan+ "_" + "Calculated";
    }
    return key;
};

SensorDataCalculator.getArrayAverageValue=function(arrayObj){
    var array=arrayObj||[];
    var counts=0;
    var sum=0;
    var average=-1;
    for(var arrIndex in array){
        counts++;
        var obj=array[arrIndex];
        if(!isNaN(obj)){
            sum+=Number(obj);
        }
    }

    if(counts!=0){
        average=sum/counts;
    }
    return average;
};

SensorDataCalculator.processSingleLineCalculate = function (sourceData) {
    var finalResult = [];
    var dataObj;
    try {
        dataObj = JSON.parse(sourceData);
        if (!dataObj.deviceSerial||!dataObj.monitorPackage) {
            return;
        }
    }
    catch (e) {
        console.log(e);
        return;
    }

    var monitorPackage=dataObj.monitorPackage;
    var monitorPackageHandler=new MonitorPackageHandler(monitorPackage);
    monitorPackage=monitorPackageHandler.getAverageMonitorPackage(monitorPackage);

    var resultArray=[];
    resultArray=monitorPackageHandler.getFinalDistance(monitorPackageHandler,monitorPackage,1,2);

    var averageDistance=SensorDataCalculator.getArrayAverageValue(resultArray);

    return averageDistance;
};

SensorDataCalculator.filterDataByAcc = function (sourceData,filterValue) {
    var finalResult={};
    var tpPkg = sourceData.monitorPackage;
    finalResult.deviceSerial=sourceData.deviceSerial;
    finalResult.deviceName=sourceData.deviceName;
    if (tpPkg) {
        var rtPKG=[];
        for(var pkIndex in tpPkg){
            var pkg=tpPkg[pkIndex];
            var rtNode={};
            rtNode.checkPoint = pkg.checkPoint;
            var beaconNodes = pkg.beaconPKG;
            var rtBeaconNodes=[];
            if (beaconNodes&&beaconNodes.length > 3) {
                for(var i=0;i<beaconNodes.length;i++){
                    if(parseInt(beaconNodes[i].acc)>parseInt((filterValue))){
                        continue;
                    }
                    else{
                        rtBeaconNodes.push(beaconNodes[i]);
                    }
                }
            }
            else{
                rtBeaconNodes.push(beaconNodes);
            }
            rtNode.beaconPKG=rtBeaconNodes;
            rtPKG.push(rtNode);
        }
        finalResult.monitorPackage=rtPKG;
    }
    //sourceData.monitoring=tpPkg;
    return finalResult;
};

module.exports = SensorDataCalculator;