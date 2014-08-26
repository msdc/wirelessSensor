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
        if(err){
            console.error(err);
        }

        easypost.get(req, res, function (data) {
            if (data) {
                var dataObj=typeof (data)=="object"?data:JSON.parse(data);
                var dataStr=typeof (data)=="string"?data:JSON.stringify(data);
                var tpkey = moduleName+"_" + dataObj.name + "_" + dataObj.id;
                client.set(tpkey, dataStr);
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
        if(err){
            console.error(err);
        }
        var result = [];
        var keyPart=moduleName+"_*";
        if(req.query.id&&req.query.name){
            keyPart=moduleName+"_"+req.query.name+"_"+req.query.id;
        }
        var count=0;
        client.keys(keyPart, function (err,list) {
            if(err){
                console.error(err);
            }

            if(list.length===0){
                res.send(result);
                redisPool.release();
                return;
            }

            for (var index in list) {
                count++;
                client.get(list[index], function (err,item) {
                    if(err){
                        console.error(err);
                    }
                    result.push(item);
                    if(count==list.length){
                        res.send(result);
                        redisPool.release();
                    }
                });
            }
        });
    });
};

RedisOperator.prototype.Del=function(moduleName){
    var redisPool=this.pool;
    var req=this.req;
    var res=this.res;

    var id = req.query.id;
    var name = req.query.name;
    redisPool.acquire(function (err, client) {
        if(err){
            console.error(err);
        }
        var delKey=moduleName+"_" + name + "_" + id;
        client.del(delKey,function(err,reply){
            if(err){
                console.error(err);
            }
            if(reply>0){
                res.send("data deleted success!");
            }
            redisPool.release();
        });

    });
};

module.exports=RedisOperator;
