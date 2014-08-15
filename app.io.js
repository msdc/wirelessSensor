/**
 * Created by wang on 2014/8/14.
 */
var express = require('express'),
    app=express();
var http = require('http'),
    server=http.createServer(app);
var io = require('socket.io')(server);
var redis=require('redis');
var sensor=require('./sensor.js');
var trilateration=require("./Trilateration.js");
var kmeans=require("./KMeansClustering.js");
var path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

server.listen(13327,function(){
    console.log('Express server listening on port 13327');
});

io.on('connection', function (socket) {
    socket.emit('welcome', { welcome: 'server connected success..' });

    socket.on('sensorData',function(data){
        client = redis.createClient();
        client.on("error", function (err) {
            console.log(err);
        });
        var serializeJsonData = JSON.stringify(data);
        var timespan = new Date().getUTCMilliseconds();
        client.set(data.deviceSerial + "_" + timespan, serializeJsonData);
        client.quit();

        SensorDataCalculater.calculate(socket,data);
    });

    socket.on('sensorDataFromRedis', function(data){
        client = redis.createClient();
        client.on("error", function (err) {
            console.log(err);
        });

        client.keys('*',function(err,reply){
            reply.forEach(function(key){
                client.get(key, function(err,reply){
                    if(err){console.error(err);}
                    console.log(key);
                    SensorDataCalculater.calculate(socket,reply);
                });
            });
            client.quit();
        });
    });
});

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


