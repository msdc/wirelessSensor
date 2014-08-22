/**
 * Created by Administrator on 2014/8/22.
 */
var RedisPool = require('sol-redis-pool');
var easypost = require('easypost');
var redisSettings = {
    host: "127.0.0.1",
    port: 6379,
    auth_pass: "dingbats"
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

place.add = function (req, res) {
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

place.get = function (req, res) {
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

place.del = function (req, res) {
    var placeID = req.query.id;
    var placeName = req.query.name;
    myPool.acquire(function (err, client) {
        client.del("place_" + placeName + "_" + placeID);
        myPool.release();
    });
}

var seller = function () {
}

seller.add = function (req, res) {

}
seller.get = function (req, res) {

}
seller.getByPlace = function (req, res) {

}
seller.del = function (req, res) {

}

var beaconDevice = function () {
}

beaconDevice.add = function (req, res) {

}

beaconDevice.get = function (req, res) {

}

beaconDevice.del = function (req, res) {

}

var promotion = function () {
}

promotion.add = function (req, res) {

}
promotion.get = function (req, res) {

}
promotion.del = function (req, res) {

}