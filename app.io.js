/**
 * Created by wang on 2014/8/14.
 */
var express = require('express'),
    app=express();
var http = require('http'),
    server=http.createServer(app);
var io = require('socket.io')(server);
var redis=require('redis');
var path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

server.listen(13327,function(){
    console.log('Express server listening on port 13327');
});

io.on('connection', function (socket) {
    socket.emit('welcome', { welcome: 'server connected success..' });
    socket.on('sensorData', function(data){
        client = redis.createClient();
        client.on("error", function (err) {
            socket.emit('redisError',{});
        });

        if(!data.monitorPackage){
            res.send({result:false,message:"数据格式错误！monitorPackage未指定！"});
        }

        var serializeJsonData=JSON.stringify(data);
        //var timespan=new Date().getUTCMilliseconds();
        //client.set(data.deviceSerial+"_"+timespan, serializeJsonData);
        client.set("socket.io.test",serializeJsonData);
        client.get("socket.io.test",function(err,reply){
            if(err){console.error(err);}
            console.log(reply);
            client.quit();
        });
    });
});


