/**
 * Created by wang on 2014/8/12.
 */
var redis = require('redis');
var easypost = require('easypost');
var sensorCalculator=require("./SensorCalculator.js");
//var trilateration = require("./Trilateration.js");
//var kmeans = require("./KMeansClustering.js");
var redis_port = 6379,
    redis_host = "127.0.0.1";

function SendError(err, res) {
    console.error(err);
    res.send({result: false, message: err});
}

exports.getSampleData = function (req, res) {
    /*var client = redis.createClient(redis_port,redis_host);
    client.on("error", function (err) {
        SendError(err,res);
    });

    var count=0;
    var keysLength=0;
    client.keys('*', function (err, reply) {
        keysLength=reply.length;
        reply.forEach(function (key) {
            client.get(key, function (err, reply) {
                if (err) {
                    console.error(err);
                }
                count++;
                console.log(key);
                if(count==keysLength||count>keysLength)
                {
                    client.quit();
                }
                var tpNDataArray = [];
                var data;
                try {
                    data = JSON.parse(reply);
                }
                catch (e) {
                    return;
                }

                //exclude incorrect data.
                if (!data.deviceSerial) {
                    return;
                }

                tpNDataArray.push(data);
                var trlCal = new trilateration(tpNDataArray);

                trlCal.cleanZeroKey(function (pointDt) {
                    for (var point in pointDt) {
                        if (!pointDt[point].beaconCalculatePosition) break;//skip incorrect data in redis.
                        kmeans.GetClusteredPoint(pointDt[point], function (finalPoint) {
                            //res.send(finalPoint);
                            console.log("deviceID=" + finalPoint.deviceID);
                            console.log("timePoint=" + finalPoint.timePoint);
                            console.log("deviceSerial=" + finalPoint.deviceSerial);
                            console.log("beaconCalculatePosition=[{\"x\"=" + finalPoint.beaconCalculatePosition[0].x + ",\"y=\"" + finalPoint.beaconCalculatePosition[0].y + "}]");
                            //todo write back info the redis and trigger postback event using websocket
                        });
                    }
                });
            });
        });
    });*/
};

exports.GetSensorDataFromRedis = function (key, callback) {
    var client = redis.createClient(redis_port,redis_host);

    client.on("error", function (err) {
        console.log("Error " + err);
    });

    client.get(key, function (err, reply) {
        callback(err, reply);
        client.quit();
    });
};

exports.GetSensorDataFromDevices = function (req, res) {
    var client = redis.createClient(redis_port,redis_host);
    client.on("error", function (err) {
        if (err) {
            SendError(err, res);
        }
    });

    easypost.get(req, res, function (data) {
        //var data=JSON.parse(data);
        if (!data.monitorPackage) {
            console.log('数据格式错误！monitorPackage未指定！');
            res.send({result: false, message: "数据格式错误！monitorPackage未指定！"});
            res.end();
            return;
        }

        var serializeJsonData = JSON.stringify(data);
        var redisKey=sensorCalculator.getKeyBeforeCalculate(data.deviceSerial);
        client.set(redisKey, serializeJsonData);
        client.quit();

        console.log("deviceSerial="+data.deviceSerial+"，数据接收成功！");
        res.send({result: true, message: "数据接收成功！"});
        res.end();
    });
};

exports.saveToRedis = function (finalPoint) {
    var client = redis.createClient(redis_port,redis_host);
    client.on("error", function (err) {
        console.log(err);
    });

    var serializeJsonData = JSON.stringify(finalPoint);
    var resultPointKeyName = sensorCalculator.getKeyAfterCalculate(finalPoint.deviceSerial);
    client.set(resultPointKeyName, serializeJsonData);
    client.quit();
};

exports.processDataFromSocket= function (io, socket, data) {


};

exports.processDataFromHttp=function(res,req){

};