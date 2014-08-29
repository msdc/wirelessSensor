var express = require('express');
var bodyParser = require('body-parser');
var sensor=require('./coreCalculator/Sensor.js');
var navigation=require('./coreCalculator/AStarNavigation.js');
var maintain=require('./webAPI/maintainModule.js');
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.json({ type: 'application/vnd.api+json',limit:'50mb' }));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/website'));

app.post('/sensorData',sensor.processDataFromHttp);
app.get("/getPoints/:onlyrecent",sensor.getPoints);

app.post("/saveGraphMatrix",navigation.saveGraphMatrix);
app.get("/getGraphMatrix/:graphid",navigation.getGraphMatrix);
app.post("/findPath",navigation.findPath);

app.post("/place/add",maintain.place.add);
app.post("/place/update",maintain.place.add);
app.delete("/place/del",maintain.place.del);
app.get("/place/get",maintain.place.get);//huoqu

app.post("/seller/add",maintain.seller.add);
app.post("/seller/update",maintain.seller.add);
app.delete("/seller/del",maintain.seller.del);
app.get("/seller/get",maintain.seller.get);

app.post("/device/add",maintain.beaconDevice.add);
app.post("/device/update",maintain.beaconDevice.add);
app.delete("/device/del",maintain.beaconDevice.del);
app.get("/device/get",maintain.beaconDevice.get);

app.post("/promotion/add",maintain.promotion.add);
app.post("/promotion/update",maintain.promotion.add);
app.delete("/promotion/del",maintain.promotion.del);
app.get("/promotion/get",maintain.promotion.get);

app.listen(1337, function () {
    console.log('Express server listening on port 1337');
});

