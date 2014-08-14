/**
 * Module dependencies.
 */

var express = require('express');
var bodyParser = require('body-parser');
var sensor = require('./sensor.js');
//var redisTest=require('./redisTestFile.js');
var http = require('http');
var path = require('path');

var app = express();

// all environments
//app.set('port', process.env.PORT || 3000);
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json({limit:'50mb'}));
// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json',limit:'50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/sensorData',sensor.GetSensorDataFromMobile);
app.get('/getDevicePoints',sensor.getSampleData);
//app.get('/redis',redisTest.redisTest);

http.createServer(app).listen(13337, function () {
    console.log('Express server listening on port 13337');
});
