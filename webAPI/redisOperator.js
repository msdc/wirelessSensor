/**
 * Created by wang on 2014/8/25.
 */
var easypost = require('easypost');
var redis=require("redis");

var redisSettings = {
    host: "127.0.0.1",
    port: 6379
};

function RedisOperator(redisClient, req, res) {
    this.client = redis.createClient(redisSettings.port,redisSettings.host);
    this.req = req || {};
    this.res = res || {};

    this.client.on("error", function (reason) {
        console.log("Connection Error:", reason);
    })
}

RedisOperator.prototype.Add = function (moduleName) {
    var client = this.client;
    var req = this.req;
    var res = this.res;

    easypost.get(req, res, function (data) {
        if (data) {
            var dataObj = typeof (data) == "object" ? data : JSON.parse(data);
            var dataStr = typeof (data) == "string" ? data : JSON.stringify(data);
            var tpkey = moduleName + "_" + dataObj.name + "_" + dataObj.id;
            client.set(tpkey, dataStr);
            res.send("success");
        }
        else {
            res.send(500, "data format error");
        }
    });
    client.quit();
};

RedisOperator.prototype.Get = function (moduleName) {
    var client = this.client;
    var req = this.req;
    var res = this.res;

    var result = [];
    var keyPart = moduleName + "_*";
    if (req.query.id && req.query.name) {
        keyPart = moduleName + "_" + req.query.name + "_" + req.query.id;
    }
    var count = 0;
    client.keys(keyPart, function (err, list) {
        list.forEach(function(key,pos){
            client.get(key, function (err, item) {
                result.push(item);
                if (pos ==(list.length-1)) {
                    res.send(result);
                    client.quit();
                }
            });
        });
    });
    //client.quit();
};

RedisOperator.prototype.Del = function (moduleName) {
    var client = this.client;
    var req = this.req;
    var res = this.res;

    var id = req.query.id;
    var name = req.query.name;

    var delKey = moduleName + "_" + name + "_" + id;
    client.del(delKey, function (err, reply) {
        if (err) {
            console.error(err);
        }
        if (reply > 0) {
            res.send("data deleted success!");
        }
    });
    client.quit();
};

module.exports = RedisOperator;
