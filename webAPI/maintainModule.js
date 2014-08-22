/**
 * Created by Administrator on 2014/8/22.
 */
var RedisPool = require('sol-redis-pool');
var easypost = require('easypost');
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
    console.log(util.format(" Checking pool info after client destroyed: ", pool.availableObjectsCount(), pool.getPoolSize()));
})

var place = function () {
}

place.prototype.add = function (req, res) {
    myPool.acquire(function (err, client) {
        easypost.get(req, res, function (data) {
            if (!data) {
                var tpkey = "place_" + data.name + "_" + data.Id;
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
        client.keys("place_*", function (places) {
            for (var plIndex in pl) {
                client.get(pl[plIndex], function (place) {
                    result.push(place);
                });
            }
        });
        res.send(result);
        myPool.release();
    });
}

place.prototype.del = function (req, res) {
    var placeID = req.query.id;
    var placeName = req.query.name;
    myPool.acquire(function (err, client) {
        client.del("place_" + placeName + "_" + placeID);
        myPool.release();
    });
}

var seller = function () {
}

seller.prototype.add = function (req, res) {

}
seller.prototype.get = function (req, res) {

}
seller.prototype.getByPlace = function (req, res) {

}
seller.prototype.del = function (req, res) {

}

var beaconDevice = function () {
}

beaconDevice.prototype.add = function (req, res) {

}

beaconDevice.prototype.get = function (req, res) {

}

beaconDevice.prototype.del = function (req, res) {

}

var promotion = function () {
}

promotion.prototype.add = function (req, res) {

}
promotion.prototype.get = function (req, res) {

}
promotion.prototype.del = function (req, res) {

}

exports.place= new place();