/**
 * Created by wang on 2014/8/12.
 */
var redis = require('redis');
var easypost = require('easypost');
var sensorCalculator = require("./SensorCalculator.js");
var config = require('./../config.js');

function SendError(err, res) {
    console.error(err);
    res.send({result: false, message: err});
}

exports.GetSensorDataFromRedis = function (key, callback) {
    var client = redis.createClient(config.redisSettings.port, config.redisSettings.host);

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
    var client = redis.createClient(config.redisSettings.port, config.redisSettings.host);
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
    var client = redis.createClient(config.redisSettings.port, config.redisSettings.host);
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

    //var calculator=new Calculator(data,client);
    //var finalResult=calculator.kMeansClusterCalculator();
    var finalResult = singleLineCalculator(data, client);
    io.emit('result', finalResult);
};

exports.processDataFromHttp = function (req, res) {
    var client = redis.createClient(config.redisSettings.port, config.redisSettings.host);
    var calMethod = req.params.calMethod || config.methodName.mapping;
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
        if (!data.monitorPackage) {
            console.log('数据格式错误！monitorPackage未指定！');
            res.send({result: false, message: "数据格式错误！monitorPackage未指定！"});
            res.end();
            client.quit();
            return;
        }

        switch (calMethod) {
            case config.methodName.trilateration:
                kMeansClusterCalculator(data, client);
                break;
            case config.methodName.singleLine:
                singleLineCalculator(data, client);
                break;
            case config.methodName.mapping:
                mappingPointCalculator(data, client);
                break;
            default :
                mappingPointCalculator(data, client);
                break;
        }

        console.log("deviceSerial=" + data.deviceSerial + "，数据接收成功！");
        res.send({result: true, message: "数据接收成功！"});
        res.end();
    });
};

exports.drawPointFromRedis = function (io, socket, data) {
    var client = redis.createClient(config.redisSettings.port, config.redisSettings.host);
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
                //console.log(key);
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

exports.drawSinglePointFromRedis = function (io, socket, data) {
    var client = redis.createClient(config.redisSettings.port, config.redisSettings.host);
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
                //console.log(key);
                if (count == keysLength || count > keysLength) {
                    client.quit();
                }
                io.emit('result', reply);
            });
        });
    });
};

exports.getPoints = function (req, res) {
    var key = req.query.id;
    var isOnlyRecent = req.params.onlyrecent;
    var result = [];
    var client = redis.createClient(config.redisSettings.port, config.redisSettings.host);
    if (key) {
        client.get(key, function (data) {
            res.send(data);
        })
    }
    else {
        client.keys("*_*_Calculated", function (err, keys) {
            if(keys.length>0) {
                keys.sort();
                keys.forEach(function (item, pos) {
                    client.get(item, function (err, data) {
                        result.push(data);
                        if (pos == (keys.length - 1)) {
                            //result=result.sort(function(a,b){return a.checkPoint- b.checkPoint;});
                            if (isOnlyRecent == "true") {
                                res.send(JSON.parse(result[result.length - 1]));
                            }
                            else {
                                res.send(result);
                            }
                            client.quit();
                        }
                    });
                });
            }
            else{
                res.send({result:"there is no data"});
            }
        });
    }
};

/**
 *
 * @说明 使用1维方法计算设备点的距离
 * */
function singleLineCalculator(data, client) {

    var serializeJsonData = JSON.stringify(data);
    var keyBeforeCalculate = sensorCalculator.getKeyBeforeCalculate(data.deviceSerial);

    //save the data before calculate.
    client.set(keyBeforeCalculate, serializeJsonData);

    var beaconPointArray = config.singleSensorPointArray();
    //save the data after calculated.
    var finalResult = sensorCalculator.processSingleLineCalculate(serializeJsonData, config.lineOffset, beaconPointArray);
    if (finalResult) {
        var keyAfterCalculate = sensorCalculator.getKeyAfterCalculate(data.deviceSerial);
        client.set(keyAfterCalculate, JSON.stringify(finalResult));
        //client.expire(keyAfterCalculate, 120);
    }

    client.quit();
    return finalResult;
}

/**
 *
 * @说明 使用定点模型计算
 * */
function mappingPointCalculator(data, client) {
    var serializeJsonData = JSON.stringify(data);
    var keyBeforeCalculate = sensorCalculator.getKeyBeforeCalculate(data.deviceSerial);

    //save the data before calculate.
    client.set(keyBeforeCalculate, serializeJsonData);

    var beaconPointArray = config.pointsMappingArray();//定点模型点映射数组
    //save the data after calculated.
    var finalResult = sensorCalculator.mappingPointCalculate(serializeJsonData, config.lineOffset, beaconPointArray);
    if (finalResult) {
        var keyAfterCalculate = sensorCalculator.getKeyAfterCalculate(data.deviceSerial);
        client.set(keyAfterCalculate, JSON.stringify(finalResult));
        client.expire(keyAfterCalculate, 120);
    }

    client.quit();
    return finalResult;
}

/**
 *
 * @说明  使用K-Means计算点
 * */
function kMeansClusterCalculator(data, client) {

    var serializeJsonData = JSON.stringify(data);
    var keyBeforeCalculate = sensorCalculator.getKeyBeforeCalculate(data.deviceSerial);

    //save the data before calculate.
    client.set(keyBeforeCalculate, serializeJsonData);

    //save the data after calculated.
    var finalResult = sensorCalculator.processCalculate(serializeJsonData);
    if (finalResult) {
        var keyAfterCalculate = sensorCalculator.getKeyAfterCalculate(data.deviceSerial);
        client.set(keyAfterCalculate, JSON.stringify(finalResult));
        //client.expire(keyAfterCalculate, 120);
    }

    client.quit();
    return finalResult;
}

/**
 *
 * @说明 该方法是三种模型的通用方法 存储数据时用的是redis中的集合 集合key的形式为：deviceSerial_methodName
 * */
function commonCalculator(data,client,methodName,cb){
    var serializeJsonData = JSON.stringify(data);
    var keyBeforeCalculate = sensorCalculator.getKeyBeforeCalculate(data.deviceSerial);
    var dataBeforeCalculate={};
    dataBeforeCalculate[keyBeforeCalculate]=serializeJsonData;

    //define the key of the sets.
    var keyOfSets=sensorCalculator.getListsKey(data.deviceSerial,methodName);
    //save the data before calculate.
    client.sadd(keyOfSets,JSON.stringify(dataBeforeCalculate));

    var finalResult=null;
    var beaconPointArray=null;

    switch(methodName){
        case config.methodName.trilateration:
            finalResult=cb(serializeJsonData);
            break;
        case config.methodName.singleLine:
            beaconPointArray = config.singleSensorPointArray();//直线模型
            finalResult=cb(serializeJsonData, config.lineOffset, beaconPointArray);
            break;
        case config.methodName.mapping:
            beaconPointArray=config.pointsMappingArray();//定点模型点映射数组
            finalResult=cb(serializeJsonData, config.lineOffset, beaconPointArray);
            break;
        default :
            beaconPointArray=config.pointsMappingArray();//定点模型点映射数组
            finalResult=cb(serializeJsonData, config.lineOffset, beaconPointArray);
            break;

    }

    if (finalResult) {
        var keyAfterCalculate = sensorCalculator.getKeyAfterCalculate(data.deviceSerial);
        var dataAfterCalculate={};
        dataAfterCalculate[keyAfterCalculate]=JSON.stringify(finalResult);
        //save the data after calculated.
        client.sadd(keyOfSets,JSON.stringify(dataAfterCalculate));
    }

    client.quit();
    return finalResult;
}