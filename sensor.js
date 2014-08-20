/**
 * Created by wang on 2014/8/12.
 */
var redis = require('redis');
var easypost = require('easypost');
var sensorCalculator = require("./SensorCalculator.js");
var redis_port = 6379,
    redis_host = "127.0.0.1";

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
    var serializeJsonData = JSON.stringify(data);
    var redisKey = sensorCalculator.getKeyBeforeCalculate(data.deviceSerial);
    client.set(redisKey, serializeJsonData);
    client.quit();
    var finalResult = sensorCalculator.processCalculate(serializeJsonData);
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

        var serializeJsonData = JSON.stringify(data);
        var keyBeforeCalculate = sensorCalculator.getKeyBeforeCalculate(data.deviceSerial);

        //save the data before calculate.
        client.set(keyBeforeCalculate, serializeJsonData);

        //save the data after calculated.
        var finalResult = sensorCalculator.processCalculate(serializeJsonData);
        if(finalResult.length>0) {
            var keyAfterCalculate = sensorCalculator.getKeyAfterCalculate(data.deviceSerial);
            client.set(keyAfterCalculate, JSON.stringify(finalResult));
            client.expire(keyAfterCalculate, 60);
            client.quit();
        }
        console.log("deviceSerial=" + data.deviceSerial + "，数据接收成功！");
        res.send({result: true, message: "数据接收成功！"});
        res.end();
    });
};

/**
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