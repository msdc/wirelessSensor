var express = require('express');
var app=express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var sensor=require('./coreCalculator/Sensor.js');

app.use(express.static(__dirname + '/public'));

server.listen(1338, function(){
    console.log('Express socket io server listening on port 1338');
});

io.on('connection', function (socket) {
    socket.emit('welcome', { welcome: 'server connected success..' });

    socket.on('sensorData', function (data) {
        sensor.processDataFromSocket(io, socket, data);
    });

    socket.on('drawPointFromRedis', function (data) {
        sensor.drawPointFromRedis(io, socket, data);
    });

    socket.on('drawSinglePointFromRedis', function (data) {
        sensor.drawSinglePointFromRedis(io, socket, data);
    });
});
