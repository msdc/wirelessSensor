/**
 * Created by wang on 2014/8/12.
 */
var redis = require('redis');
var easypost = require('easypost');
var trilateration = require("./Trilateration.js");
var kmeans = require("./KMeansClustering.js");
/**
 * @说明 获取手机端post数据的api接口
 * @api public
 * */
exports.GetSensorDataFromMobile = function (req, res) {
    var client = redis.createClient();
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
        var timespan = new Date().getUTCMilliseconds();
        client.set(data.deviceSerial + "_" + timespan, serializeJsonData);

//        var tpNDataArray=[];
//        tpNDataArray.push(data);
//        var trlCal = new trilateration(tpNDataArray);
//
//        trlCal.delKeyZero(function (pointDt) {
//            kmeans.GetFinallySensorData(pointDt, function (finalPoint) {
//                res.send(finalPoint);
//                console.log("deviceID=" + finalPoint.deviceID);
//                console.log("timePoint=" + finalPoint.timePoint);
//                console.log("deviceSerial=" + finalPoint.deviceSerial);
//                console.log("beaconCanculatedPosition=[{\"x\"=" + finalPoint.beaconCalculatePosition[0].x + ",\"y=\"" + finalPoint.beaconCalculatePosition[0].y + "}]");
//                //todo write back info the redis and trigger postback event using websocket
//                var resultPointKeyName = finalPoint.deviceID + "_" + new Date().getUTCMilliseconds() + "_" + "Calculated";
//                client.set(resultPointKeyName, finalPoint);
//            });
//        });

        client.quit();
        console.log("deviceSerial="+data.deviceSerial+"，数据接收成功！");
        res.send({result: true, message: "数据接收成功！"});
        res.end();
    });
};

/**
 * @param
 * @说明 向客户端发送错误信息，并向控制台输出该错误信息。
 * @api private.
 * */
function SendError(err, res) {
    console.error(err);
    res.send({result: false, message: err});
}

exports.getSampleData = function (req, res) {
    var client = redis.createClient();
    client.on("error", function (err) {
        console.log("Error " + err);
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

                trlCal.delKeyZero(function (pointDt) {
                    for (var point in pointDt) {
                        if (!pointDt[point].beaconCalculatePosition) break;//skip incorrect data in redis.
                        kmeans.GetFinallySensorData(pointDt[point], function (finalPoint) {
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

//        var tpNDataArray = [];
//        tpNDataArray.push(JSON.parse(reply));
//        var trlCal = new trilateration(tpNDataArray);
//
//        trlCal.delKeyZero(function (pointDt) {
//            for (var point in pointDt) {
//                kmeans.GetFinallySensorData(pointDt[point], function (finalPoint) {
//                    res.send(finalPoint);
//                    console.log("deviceID=" + finalPoint.deviceID);
//                    console.log("timePoint=" + finalPoint.timePoint);
//                    console.log("deviceSerial=" + finalPoint.deviceSerial);
//                    console.log("beaconCanculatedPosition=[{\"x\"=" + finalPoint.beaconCalculatePosition[0].x+",\"y=\""+finalPoint.beaconCalculatePosition[0].y+"}]");
//                    //todo write back info the redis and trigger postback event using websocket
//                });
//            }
//        });

    });
};

/**
 * @param:[key]:deviceName设备名称  [callback] 回调函数，有两个参数 err,reply
 * reply中包含获取的数据信息，err 返回redis错误信息。
 * @api public
 * */
exports.GetSensorDataFromRedis = function (key, callback) {
    var client = redis.createClient();
    client.on("error", function (err) {
        console.log("Error " + err);
    });

    client.get(key, function (err, reply) {
        callback(err, reply);
        client.quit();
    });
};

/*One package of Sensor Data Calculate static class.*/
function SensorDataCalculater(){};
SensorDataCalculater.calculate=function(socket,data){
    var tpNDataArray = [];
    var data;
    try
    {
        data=JSON.parse(data);
    }catch(e)
    {
        return;
    }

    //exclude incorrect data.
    if(!data.deviceSerial){
        return;
    }

    tpNDataArray.push(data);
    var trlCal = new trilateration(tpNDataArray);

    trlCal.delKeyZero(function (pointDt) {
        for (var point in pointDt) {
            if(!pointDt[point].beaconCalculatePosition)break;//skip incorrect data in redis.
            kmeans.GetFinallySensorData(pointDt[point], function (finalPoint) {
                //Save to the redis
                //SensorDataCalculater.saveToRedis(finalPoint);
                socket.emit('result',finalPoint);
                console.log("deviceID=" + finalPoint.deviceID);
                console.log("timePoint=" + finalPoint.timePoint);
                console.log("deviceSerial=" + finalPoint.deviceSerial);
                console.log("beaconCanculatedPosition=[{\"x\"=" + finalPoint.beaconCalculatePosition[0].x+",\"y=\""+finalPoint.beaconCalculatePosition[0].y+"}]");
                //todo write back info the redis and trigger postback event using websocket
            });
        }
    });
};

/**
 * @param {类聚后的最终的点}
 * @return {无}
 * */
SensorDataCalculater.saveToRedis=function(finalPoint){
    var client = redis.createClient();
    client.on("error", function (err) {
        console.log(err);
    });

    var serializeJsonData=JSON.stringify(finalPoint);
    client.set(finalPoint.deviceSerial + "_" + timespan+"_Calculated", serializeJsonData);
    client.quit();
};

exports.SensorDataCalculater=SensorDataCalculater;
