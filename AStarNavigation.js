var astarModule=require("./astar.js")();
var easypost = require('easypost');
var redis = require('redis');
var redis_port = 6379,
    redis_host = "127.0.0.1";

exports.findPath=function(req,res){
//    var tpGrid=[
//        [1,1,1,1],
//        [0,1,1,0],
//        [0,0,1,1]
//    ];
    easypost.get(req, res, function (data) {
        if (!data) {
            console.log('data is not defined.');
            res.send(500, "there is no data in the request body");
        }
        var graphMatrix=JSON.parse(data.graphMatrix);
        var    startNode=data.start;
        var    endNode=data.end;
        var astar = astarModule.astar;
        var gp = new astarModule.Graph(graphMatrix);
        var startNode = gp.grid[startNode.x][startNode.y];
        var endNode = gp.grid[endNode.x][endNode.y];
        var result= astar.search(gp, startNode, endNode);
        res.send(result);
        //return astar.search(graphNodes,startNode,endNode);
    });
}

exports.saveGraphMatrix=function(req,res){
    easypost.get(req, res, function (data) {
        if (!data) {
            console.log('data is not defined.');
            res.send(500,"there is no data in the request body");
        }
        else{
            var client = redis.createClient(redis_port, redis_host);
            client.on("error", function (err) {
                if (err) {
                    res.send(500,{result: false, message: err});
                    return;
                }
            });
            var graphKey=data.graphName;
            var graphMatrix=JSON.parse(data.graphMatrix);
            if(graphKey&&graphMatrix) {
                client.set(graphKey, graphMatrix);
                res.send("success saved the matrix");
            }
        }
    });
}
exports.getGraphMatrix=function(req,res){
    var graphID=req.param("graphid");
    var client = redis.createClient(redis_port, redis_host);
    client.on("error", function (err) {
        if (err) {
            res.send(500,{result: false, message: err});
            return;
        }
    });
    client.get(graphID,function(data){
        res.send(data);
    });
}