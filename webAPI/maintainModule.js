/**
 * Created by Administrator on 2014/8/22.
 */
var redis = require('redis');
var RedisOperator = require('./redisOperator.js');
var config = require("./../config.js");
var easypost = require('easypost');

var place = function () {
}

place.prototype.add = function (req, res) {
    var redisOperator = new RedisOperator(req, res);
    redisOperator.Add('place');
}

place.prototype.get = function (req, res) {
    var redisOperator = new RedisOperator(req, res);
    redisOperator.Get('place');
}

place.prototype.del = function (req, res) {
    var redisOperator = new RedisOperator(req, res);
    redisOperator.Del('place');
}

var seller = function () {
}

seller.prototype.add = function (req, res) {
    var redisOperator = new RedisOperator(req, res);
    redisOperator.Add('seller');
}
seller.prototype.get = function (req, res) {
    var redisOperator = new RedisOperator(req, res);
    redisOperator.Get('seller');
}
seller.prototype.getByPlace = function (req, res) {

}
seller.prototype.del = function (req, res) {
    var redisOperator = new RedisOperator(req, res);
    redisOperator.Del('seller');
}

var beaconDevice = function () {
}

beaconDevice.prototype.add = function (req, res) {
    var moduleName = "device";
    easypost.get(req, res, function (data) {
        if (data) {
            var dataObj = typeof (data) == "object" ? data : JSON.parse(data);
            var dataStr = typeof (data) == "string" ? data : JSON.stringify(data);
            if (dataObj.uuid && dataObj.major && dataObj.minor) {
                var client = redis.createClient(config.redisSettings.port, config.redisSettings.host);
                // Get connection errors for logging...
                client.on("error", function (reason) {
                    console.log("Connection Error:", reason);
                });
                var tpkey = moduleName + "_" + dataObj.uuid + "_" + dataObj.major + "_" + dataObj.minor;
                client.set(tpkey, dataStr);
                res.send({result: "success"});
            }
            else {
                res.send(500, {error: "data format error"});
            }
            client.quit();
        }
        else {
            res.send(500, {error: "data format error"});
        }
    });
}

beaconDevice.prototype.get = function (req, res) {
    var moduleName = "device";
    var uuid = req.query.uuid;
    var major = req.query.major;
    var minor = req.query.minor;
    var client = redis.createClient(config.redisSettings.port, config.redisSettings.host);
    // Get connection errors for logging...
    client.on("error", function (reason) {
        console.log("Connection Error:", reason);
    });
    var keyPart = moduleName + "_*";
    if (uuid && major && minor) {
        keyPart = moduleName + "_" + uuid + "_" + major + "_" + minor;
        client.get(tpkey, function (err, data) {
            res.send(data);
            client.quit();
        });
    }
    else {
        var result = [];
        client.keys(keyPart, function (err, list) {
            if (!err && list && list.length > 0) {
                list.forEach(function (key, pos) {
                    client.get(key, function (err, item) {
                        result.push(item);
                        if (pos == (list.length - 1)) {
                            res.send(result);
                            client.quit();
                        }
                    });
                });
            }
            else {
                res.send({error: "There is no device", message: err});
                client.quit();
            }
        });
    }
}

beaconDevice.prototype.del = function (req, res) {
    var redisOperator = new RedisOperator(req, res);
    redisOperator.Del('device');
}

var promotion = function () {
}

promotion.prototype.add = function (req, res) {
    var redisOperator = new RedisOperator(req, res);
    redisOperator.Add('promotion');
}
promotion.prototype.get = function (req, res) {
    var redisOperator = new RedisOperator(req, res);
    redisOperator.Get('promotion');
}
promotion.prototype.del = function (req, res) {
    var redisOperator = new RedisOperator(req, res);
    redisOperator.Del('promotion');
}

exports.place = new place();
exports.beaconDevice = new beaconDevice();
exports.promotion = new promotion();
exports.seller = new seller();