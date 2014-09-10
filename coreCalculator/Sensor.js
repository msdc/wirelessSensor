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
                commonCalculator(data, client,config.methodName.mapping,sensorCalculator.mappingPointCalculate);
                break;
            default :
                commonCalculator(data, client,config.methodName.mapping,sensorCalculator.mappingPointCalculate);
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
    var deviceSerial = req.query.deviceSerial;
    var isOnlyRecent = req.params.onlyrecent;
    var client = redis.createClient(config.redisSettings.port, config.redisSettings.host);
    var recentTimePoint;//最近的时间戳
    var recentLocation;//最新的点
    var resultPoints = [];

    if (deviceSerial) {
        //the key of the sets
        var keyOfSets = sensorCalculator.getListsKey(deviceSerial, config.methodName.mapping);
        client.smembers(keyOfSets, function (err, members) {
            if (members.length > 0) {
                members.forEach(function (item, index) {
                    var calculatedData = JSON.parse(item);
                    if (index == 0) {
                        recentTimePoint = calculatedData.timePoint;//初始化时间戳
                        recentLocation = calculatedData;//初始化最新的点
                    } else {
                        if (recentTimePoint < calculatedData.timePoint) {
                            recentLocation = calculatedData;
                        }
                    }
                    resultPoints.push(calculatedData);
                    //遍历完成
                    if (index == (members.length - 1)) {
                        client.quit();
                        if (isOnlyRecent == "true"){
                            res.send(recentLocation);
                        }else{
                            res.send(resultPoints);
                        }
                    }
                });
            } else {
                client.quit();
                res.send({result: "there is no data"});
                res.end();
            }
        });
    } else {
        var keyPart = "*_" + config.methodName.mapping;
        client.keys(keyPart, function (err, listKeys) {

            if (listKeys.length > 0) {
                var location=[];//所有设备的最新的坐标
                listKeys.forEach(function (listKey, listIndex) {
                    var deviceRecentTimePoint;//每个设备中最新的时间点
                    var deviceRecentLocation;//每个设备中最新的点坐标

                    client.smembers(listKey, function (err, members) {

                        if (members.length > 0) {
                            members.forEach(function (item, index) {
                                var calculatedData = JSON.parse(item);
                                if (index == 0) {
                                    deviceRecentTimePoint = calculatedData.timePoint;//初始化时间戳
                                    deviceRecentLocation = calculatedData;//初始化最新的点
                                } else {
                                    if (deviceRecentTimePoint < calculatedData.timePoint) {
                                        deviceRecentLocation = calculatedData;
                                    }
                                }

                                resultPoints.push(calculatedData);

                                if (index === (members.length - 1)) {

                                    location.push(deviceRecentLocation);

                                    if (listIndex === (listKeys.length - 1)) {
                                        client.quit();
                                        if (isOnlyRecent == "true"){
                                            res.send(location);
                                        }else
                                        {
                                            res.send(resultPoints);
                                        }
                                    }
                                }
                            });
                        } else {
                            return;
                        }
                    });
                });
            } else {
                client.quit();
                res.send({result: "there is no data"});
                res.end();
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
    client.expire(keyBeforeCalculate, 120);

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
    client.expire(keyBeforeCalculate, 120);

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
    client.expire(keyBeforeCalculate, 120);

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
    //var keyBeforeCalculate = sensorCalculator.getKeyBeforeCalculate(data.deviceSerial);

    //save the data before calculate.
    //client.set(keyBeforeCalculate, serializeJsonData);
    //client.expire(keyBeforeCalculate, 120);

    //the key of the sets
    var keyOfSets=sensorCalculator.getListsKey(data.deviceSerial,methodName);

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
        //save the data after calculated.
        client.sadd(keyOfSets,JSON.stringify(finalResult));
    }

    client.quit();
    return finalResult;
}

exports.getRemainTime=function(req,res){
   var screenName=req.query.screenName;
   var deviceSerial=req.query.deviceSerial;
   var client = redis.createClient(config.redisSettings.port, config.redisSettings.host);
   var remainTime=0;
   var screenArray=config.screensArray();
   var resultArray=[];

   if(screenName&&deviceSerial){
       //the key of the sets
       var keyOfSets = sensorCalculator.getListsKey(deviceSerial, config.methodName.mapping);
       client.smembers(keyOfSets, function (err, members){
           if(members.length>0){
               members.forEach(function(item,index){
                   var calculatedData = JSON.parse(item);
                   //同一个位置 时间累加
                   if(calculatedData.location[0].valueOf()==screenArray[screenName].valueOf()){
                       if(calculatedData.remainTime!=null){
                           remainTime=remainTime+calculatedData.remainTime;
                       }
                   }

                   if(index==(members.length-1)){
                       client.quit();
                       resultArray.push({screenName:screenName,remainTime:remainTime,deviceSerial:deviceSerial});
                       res.send(resultArray);
                       res.end();
                   }
               });
           }else{
               client.quit();
               res.send({result:"there is no data."});
               res.end();
           }
       });
   }
   else if(screenName){
       var keyPart = "*_" + config.methodName.mapping;
       client.keys(keyPart, function (err, listKeys) {
           if (listKeys.length > 0) {
               listKeys.forEach(function (listKey, listIndex){
                   var deviceSerialString=listKey.substring(0,listKey.indexOf('_'));//当前的设备号
                   client.smembers(listKey, function (err, members){
                       if (members.length > 0) {
                           members.forEach(function (item, index) {
                               var calculatedData = JSON.parse(item);
                               //同一个位置 时间累加
                               if(calculatedData.location[0].valueOf()==screenArray[screenName].valueOf()){
                                   if(calculatedData.remainTime!=null){
                                       remainTime=remainTime+calculatedData.remainTime;
                                   }
                               }
                               if(index==(members.length-1)){
                                   resultArray.push({screenName:screenName,remainTime:remainTime,deviceSerial:deviceSerialString});
                                   if(listIndex==(listKeys.length-1)){
                                       client.quit();
                                       res.send(resultArray);
                                   }
                               }
                           });
                       }else{
                           return;
                       }
                   });
               });
           }else{
               client.quit();
               res.send({result: "there is no data"});
               res.end();
           }
       });
   }else if(deviceSerial){
       //the key of the sets
       var keyOfSets = sensorCalculator.getListsKey(deviceSerial, config.methodName.mapping);

       client.smembers(keyOfSets, function (err, members){
           if(members.length>0){
               for(var screenIndex in screenArray) {
                   //不同的屏幕
                   var compareFactor = screenArray[screenIndex].valueOf();

                   members.forEach(function (item, index) {
                       var calculatedData = JSON.parse(item);

                       if(compareFactor==calculatedData.location[0].valueOf()){
                           if (calculatedData.remainTime != null) {
                               remainTime = remainTime + calculatedData.remainTime;
                           }
                       }

                       if (index === (members.length - 1)) {
                           client.quit();
                           resultArray.push({screenName: screenIndex, remainTime: remainTime, deviceSerial: deviceSerial});
                           res.send(resultArray);
                       }
                   });
               }
           }else{
               client.quit();
               res.send({result:"there is no data."});
               res.end();
           }
       });
   }
};