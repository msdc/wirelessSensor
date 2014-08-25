/**
 * Created by Administrator on 2014/8/22.
 */
var RedisPool = require('sol-redis-pool');
var easypost = require('easypost');
var util=require('util');
var RedisOperator=require('./redisOperator.js');
var redisSettings = {
    host: "127.0.0.1",
    port: 6379
};

// Configure the generic-pool settings.
var poolSettings = {
    max: 10,
    min: 2
};

var myPool = RedisPool(redisSettings, poolSettings);
// Get connection errors for logging...
myPool.on("error", function (reason) {
    console.log("Connection Error:", reason);
})

myPool.on("destroy", function () {
    console.log(util.format(" Checking pool info after client destroyed: ", myPool.availableObjectsCount(), myPool.getPoolSize()));
})

var place = function () {
}

place.prototype.add = function (req, res) {
    var redisOperator=new RedisOperator(myPool,req, res);
    redisOperator.Add('place');
}

place.prototype.get = function (req, res) {
    var redisOperator=new RedisOperator(myPool,req, res);
    redisOperator.Get('place');
}

place.prototype.del = function (req, res) {
    var redisOperator=new RedisOperator(myPool,req, res);
    redisOperator.Del('place');
}

var seller = function () {
}

seller.prototype.add = function (req, res) {
   var redisOperator=new RedisOperator(myPool,req, res);
   redisOperator.Add('seller');
}
seller.prototype.get = function (req, res) {
    var redisOperator=new RedisOperator(myPool,req, res);
    redisOperator.Get('seller');
}
seller.prototype.getByPlace = function (req, res) {

}
seller.prototype.del = function (req, res) {
    var redisOperator=new RedisOperator(myPool,req, res);
    redisOperator.Del('seller');
}

var beaconDevice = function () {
}

beaconDevice.prototype.add = function (req, res) {
    var redisOperator=new RedisOperator(myPool,req, res);
    redisOperator.Add('device');
}

beaconDevice.prototype.get = function (req, res) {
    var redisOperator=new RedisOperator(myPool,req, res);
    redisOperator.Get('device');
}

beaconDevice.prototype.del = function (req, res) {
    var redisOperator=new RedisOperator(myPool,req, res);
    redisOperator.Del('device');
}

var promotion = function () {
}

promotion.prototype.add = function (req, res) {
    var redisOperator=new RedisOperator(myPool,req, res);
    redisOperator.Add('promotion');
}
promotion.prototype.get = function (req, res) {
    var redisOperator=new RedisOperator(myPool,req, res);
    redisOperator.Get('promotion');
}
promotion.prototype.del = function (req, res) {
    var redisOperator=new RedisOperator(myPool,req, res);
    redisOperator.Del('promotion');
}

exports.place= new place();
exports.beaconDevice=new beaconDevice();
exports.promotion=new promotion();
exports.seller=new seller();