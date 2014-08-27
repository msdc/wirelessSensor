/**
 * Created by Administrator on 2014/8/22.
 */
var redis = require('redis');
var RedisOperator = require('./redisOperator.js');
var config=require("./../config.js");

var client = redis.createClient(config.redisSettings.port, config.redisSettings.host);
// Get connection errors for logging...
client.on("error", function (reason) {
    console.log("Connection Error:", reason);
})

var place = function () {
}

place.prototype.add = function (req, res) {
    var redisOperator = new RedisOperator(client, req, res);
    redisOperator.Add('place');
}

place.prototype.get = function (req, res) {
    var redisOperator = new RedisOperator(client, req, res);
    redisOperator.Get('place');
}

place.prototype.del = function (req, res) {
    var redisOperator = new RedisOperator(client, req, res);
    redisOperator.Del('place');
}

var seller = function () {
}

seller.prototype.add = function (req, res) {
    var redisOperator = new RedisOperator(client, req, res);
    redisOperator.Add('seller');
}
seller.prototype.get = function (req, res) {
    var redisOperator = new RedisOperator(client, req, res);
    redisOperator.Get('seller');
}
seller.prototype.getByPlace = function (req, res) {

}
seller.prototype.del = function (req, res) {
    var redisOperator = new RedisOperator(client, req, res);
    redisOperator.Del('seller');
}

var beaconDevice = function () {
}

beaconDevice.prototype.add = function (req, res) {
    var redisOperator = new RedisOperator(client, req, res);
    redisOperator.Add('device');
}

beaconDevice.prototype.get = function (req, res) {
    var redisOperator = new RedisOperator(client, req, res);
    redisOperator.Get('device');
}

beaconDevice.prototype.del = function (req, res) {
    var redisOperator = new RedisOperator(client, req, res);
    redisOperator.Del('device');
}

var promotion = function () {
}

promotion.prototype.add = function (req, res) {
    var redisOperator = new RedisOperator(client, req, res);
    redisOperator.Add('promotion');
}
promotion.prototype.get = function (req, res) {
    var redisOperator = new RedisOperator(client, req, res);
    redisOperator.Get('promotion');
}
promotion.prototype.del = function (req, res) {
    var redisOperator = new RedisOperator(client, req, res);
    redisOperator.Del('promotion');
}

exports.place = new place();
exports.beaconDevice = new beaconDevice();
exports.promotion = new promotion();
exports.seller = new seller();