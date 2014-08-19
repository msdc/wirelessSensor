var express = require('express');
var app=express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var redis=require('redis');

var sensor=require('./sensor.js');

app.use(express.static(__dirname + '/public'));

server.listen(1338, function(){
    console.log('Express socket io server listening on port 1338');
});

io.on('connection', function (socket) {
    socket.emit('welcome', { welcome: 'server connected success..' });
    console.log("new client:"+socket.id);
    socket.on('sensorData',function(data){
        var client = redis.createClient();
        client.on("error", function (err) {
            console.log(err);
        });
        var serializeJsonData = JSON.stringify(data);
        var timePoint = new Date().getUTCMilliseconds();
        client.set(data.deviceSerial + "_" + timePoint, serializeJsonData);
        client.quit();

        sensor.processDataFromSocket(io,socket,data);
    });

    socket.on('drawPointFromRedis', function(data){
       /* var client = redis.createClient();
        client.on("error", function (err) {
            console.log(err);
        });

        var count=0;
        var keysLength=0;
        client.keys('*',function(err,reply){
            keysLength=reply.length;
            if(keysLength===0)
            {
                client.quit();
                return;
            }
            reply.forEach(function(key){
                client.get(key, function(err,reply){
                    if(err){console.error(err);}
                    count++;
                    console.log(key);
                    if(count==keysLength||count>keysLength)
                    {
                        client.quit();
                    }
                    sensor.processCalculate(io,socket,reply);
                });
            });
        });*/
    });
});