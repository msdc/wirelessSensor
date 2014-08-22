var express = require('express');
var bodyParser = require('body-parser');
var sensor=require('./sensor.js');
var navigation=require('./AStarNavigation.js');
var maintain=require('./maintainModule.js');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.json({ type: 'application/vnd.api+json',limit:'50mb' }));
app.use(express.static(__dirname + '/public'));

app.post('/sensorData',sensor.processDataFromHttp);

app.post("/saveGraphMatrix",navigation.saveGraphMatrix);
app.get("/graphMatrix/:graphid",navigation.getGraphMatrix);
app.post("/findPath",navigation.findPath);

app.post("/place/add",maintain.place.add);

app.listen(1337, function () {
    console.log('Express server listening on port 1337');
});

