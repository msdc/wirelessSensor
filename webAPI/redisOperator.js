/**
 * Created by wang on 2014/8/25.
 */
var easypost = require('easypost');

function RedisOperator(redisPool,req,res){
    this.pool=redisPool||{};
    this.req=req||{};
    this.res=res||{};
}

RedisOperator.prototype.Add=function(moduleName){
    var redisPool=this.pool;
    var req=this.req;
    var res=this.res;

    redisPool.acquire(function (err, client) {
        easypost.get(req, res, function (data) {
            if (data) {
                var dataObj=JSON.parse(data);
                var tpkey = moduleName+"_" + dataObj.name + "_" + dataObj.id;
                client.set(tpkey, data);
                res.send("success");
            }
            else {
                res.send(500, "data format error");
            }
            redisPool.release();
        });
    });
};

RedisOperator.prototype.Get=function(moduleName){
    var redisPool=this.pool;
    var req=this.req;
    var res=this.res;

    redisPool.acquire(function (err, client) {
        var result = [];
        var keyPart=moduleName+"_*";
        client.keys(keyPart, function (list) {
            for (var index in list) {
                client.get(list[index], function (item) {
                    result.push(item);
                });
            }
        });
        res.send(result);
        redisPool.release();
    });
};

RedisOperator.prototype.Del=function(moduleName){
    var redisPool=this.pool;
    var req=this.req;
    var res=this.res;

    var id = req.query.id;
    var name = req.query.name;
    redisPool.acquire(function (err, client) {
        client.del(moduleName+"_" + name + "_" + id);
        redisPool.release();
    });
};

module.exports=RedisOperator;
