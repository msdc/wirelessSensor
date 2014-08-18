/**
 * Created by wang on 2014/8/14.
 */
var express = require('express'),
    app=express();
var http = require('http'),
    server=http.createServer(app);
var io = require('socket.io')(server);
var redis=require('redis');
var sensor=require('./sensor.js'),
    sensorDataCalculater=sensor.SensorDataCalculater;
var path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

server.listen(13327,function(){
    console.log('Express server listening on port 13327');
});

io.on('connection', function (socket) {
    socket.emit('welcome', { welcome: 'server connected success..' });

    socket.on('sensorData',function(data){
        var client = redis.createClient();
        client.on("error", function (err) {
            console.log(err);
        });
        var serializeJsonData = JSON.stringify(data);
        var timespan = new Date().getUTCMilliseconds();
        client.set(data.deviceSerial + "_" + timespan, serializeJsonData);
        client.quit();

        sensorDataCalculater.calculate(io,socket,data);
    });

    socket.on('sensorDataFromRedis', function(data){
        var client = redis.createClient();
        client.on("error", function (err) {
            console.log(err);
        });

        var count=0;
        var keysLength=0;
        client.keys('*',function(err,reply){
            keysLength=reply.length;
            reply.forEach(function(key){
                client.get(key, function(err,reply){
                    if(err){console.error(err);}
                    count++;
                    console.log(key);
                    if(count==keysLength||count>keysLength)
                    {
                        client.quit();
                    }
                    sensorDataCalculater.calculate(io,socket,reply);
                });
            });
        });
    });
});