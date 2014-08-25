/**
 * Created by wang on 2014/8/12.
 */
var redis = require('redis');
var easypost = require('easypost');
var sensorCalculator = require("./SensorCalculator.js");
var redis_port = 6379,
    redis_host = "127.0.0.1";
var offset=1.5;//实际的偏移量
var MonitorPackageHandler=require('./MonitorPackageHandler.js');

function SendError(err, res) {
    console.error(err);
    res.send({result: false, message: err});
}

exports.GetSensorDataFromRedis = function (key, callback) {
    var client = redis.createClient(redis_port, redis_host);

    client.on("error", function (err) {
        client.quit();
        console.log("Error " + err);
        return;
    });

    client.get(key, function (err, reply) {
        callback(err, reply);
        client.quit();
    });
};

exports.saveToRedis = function (finalPoint) {
    var client = redis.createClient(redis_port, redis_host);
    client.on("error", function (err) {
        client.quit();
        console.log(err);
        return;
    });

    var serializeJsonData = JSON.stringify(finalPoint);
    var resultPointKeyName = sensorCalculator.getKeyAfterCalculate(finalPoint.deviceSerial);
    client.set(resultPointKeyName, serializeJsonData);
    client.quit();
};

exports.processDataFromSocket = function (io, socket, data) {
    var client = redis.createClient(redis_port, redis_host);
    client.on("error", function (err) {
        client.quit();
        console.log(err);
        return;
    });
    if (!data) {
        console.log('data is not defined.');
        client.quit();
        return;
    }

    //var data=JSON.parse(data);
    if (!data.monitorPackage) {
        console.log('数据格式错误！monitorPackage未指定！');
        client.quit();
        return;
    }

    var calculator=new Calculator(data,client);
    //var finalResult=calculator.kMeansClusterCalculator();
    var finalResult=calculator.singleLineCalculator();
    io.emit('result', finalResult);
};

exports.processDataFromHttp = function (req, res) {
    var client = redis.createClient(redis_port, redis_host);
    client.on("error", function (err) {
        if (err) {
            SendError(err, res);
        }
    });

    easypost.get(req, res, function (data) {
        if (!data) {
            console.log('data is not defined.');
            client.quit();
            return;
        }

        //var data=JSON.parse(data);
        if (!data.monitorPackage) {
            console.log('数据格式错误！monitorPackage未指定！');
            res.send({result: false, message: "数据格式错误！monitorPackage未指定！"});
            res.end();
            client.quit();
            return;
        }

        var calculator=new Calculator(data,client);
        //calculator.kMeansClusterCalculator();
        calculator.singleLineCalculator();

        console.log("deviceSerial=" + data.deviceSerial + "，数据接收成功！");
        res.send({result: true, message: "数据接收成功！"});
        res.end();
    });
};

/**
 *
 * @说明 取redis中key中包含_Calculated的key进行描点操作
 * */
exports.drawPointFromRedis = function (io, socket, data) {
    var client = redis.createClient(redis_port, redis_host);
    client.on("error", function (err) {
        console.log(err);
        client.quit();
        return;
    });

    var count = 0;
    var keysLength = 0;
    client.keys('*_*_Calculated', function (err, reply) {
        keysLength = reply.length;
        if (keysLength === 0) {
            client.quit();
            return;
        }
        reply.forEach(function (key) {
            client.get(key, function (err, reply) {
                if (err) {
                    console.error(err);
                }
                count++;
                console.log(key);
                if (count == keysLength || count > keysLength) {
                    client.quit();
                }
                var finalResult = JSON.parse(reply);
                for (var point in finalResult) {
                    io.emit('result', finalResult[point]);
                }
            });
        });
    });
};

exports.drawSinglePointFromRedis=function (io, socket, data) {
    var client = redis.createClient(redis_port, redis_host);
    client.on("error", function (err) {
        console.log(err);
        client.quit();
        return;
    });

    var count = 0;
    var keysLength = 0;
    client.keys('*_*_Calculated', function (err, reply) {
        keysLength = reply.length;
        if (keysLength === 0) {
            client.quit();
            return;
        }
        reply.forEach(function (key) {
            client.get(key, function (err, reply) {
                if (err) {
                    console.error(err);
                }
                count++;
                console.log(key);
                if (count == keysLength || count > keysLength) {
                    client.quit();
                }
                io.emit('result', reply);
            });
        });
    });
};

/**
 *
 * @说明 计算样本数据入口类
 * @param {Object} 原始的样本数据，Json对象  {Object} redisClient.
* */
function Calculator(originalData,redisClient){
    this.redisClient=redisClient||{};
    this.originalData=originalData||{};
};

/**
*
 * @说明 使用1维方法计算设备点的距离
* */
Calculator.prototype.singleLineCalculator=function(){
    var data=this.originalData;
    var client=this.redisClient;

    var serializeJsonData = JSON.stringify(data);
    var keyBeforeCalculate = sensorCalculator.getKeyBeforeCalculate(data.deviceSerial);

    //save the data before calculate.
    client.set(keyBeforeCalculate, serializeJsonData);

    //save the data after calculated.
    var finalResult = sensorCalculator.processSingleLineCalculate(serializeJsonData);
    if(finalResult) {
        var keyAfterCalculate = sensorCalculator.getKeyAfterCalculate(data.deviceSerial);
        var obj={result:finalResult};
        client.set(keyAfterCalculate, JSON.stringify(obj));
        client.expire(keyAfterCalculate, 120);
    }

    client.quit();

    //存入redis后，将数据继续处理并返回
    //todo translate the distance to point.  finalResult=[{beaconName:2,distance:3},{{beaconName:3,distance:4}]
    if(finalResult.length===2){
        var beaconOneIndex=finalResult[0].beaconName;
        var monitorPackageHandler=new MonitorPackageHandler();
        var pointX=finalResult[0].distance+monitorPackageHandler.getBeaconDistance(beaconOneIndex);
        var pointY=offset;
        var pointObj={x:pointX,y:pointY};
        var location=[];
        location.push(pointObj);
        var resultLocationData={deviceSerial:data.deviceSerial,deviceName:data.deviceName,location:location};
        return resultLocationData;
    }

    //return finalResult;
};

/**
 *
 * @说明 保存计算前后的数据到redis.
 * @param {Function} 点的计算方法
* */
Calculator.prototype.saveCalculateData=function(calculateMethod){};

/**
 *
 * @说明  使用K-Means计算点
* */
Calculator.prototype.kMeansClusterCalculator=function(){
    var data=this.originalData;
    var client=this.redisClient;

    var serializeJsonData = JSON.stringify(data);
    var keyBeforeCalculate = sensorCalculator.getKeyBeforeCalculate(data.deviceSerial);

    //save the data before calculate.
    client.set(keyBeforeCalculate, serializeJsonData);

    //save the data after calculated.
    var finalResult = sensorCalculator.processCalculate(serializeJsonData);
    if(finalResult.length>0) {
        var keyAfterCalculate = sensorCalculator.getKeyAfterCalculate(data.deviceSerial);
        client.set(keyAfterCalculate, JSON.stringify(finalResult));
        client.expire(keyAfterCalculate, 120);
    }

    client.quit();
    return finalResult;
};