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
    myPool.acquire(function (err, client) {
        easypost.get(req, res, function (data) {
            if (data) {
                var dataObj=JSON.parse(data);
                var tpkey = "place_" + dataObj.name + "_" + dataObj.id;
                client.set(tpkey, data);
                res.send("success");
            }
            else {
                res.send(500, "data format error");
            }
            myPool.release();
        });
    });
}

place.prototype.get = function (req, res) {
    myPool.acquire(function (err, client) {
        var result = [];
        var count=0;
        client.keys("place_*", function (err,places) {
            for (var plIndex in places) {
                count++;
                client.get(places[plIndex], function (err,place) {
                    result.push(place);
                    if(count==places.length){
                        res.send(result);
                        myPool.release();
                    }
                });
            }
        });
    });
}

place.prototype.del = function (req, res) {
    var placeID = req.query.id;
    var placeName = req.query.name;
    myPool.acquire(function (err, client) {
        var delKey="place_" + placeName + "_" + placeID;
        client.del(delKey,function(err,reply){
            if(err){
                console.error(err);
            }
            if(reply>0){
                res.send("data deleted success!");
            }
            myPool.release();
        });
    });
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