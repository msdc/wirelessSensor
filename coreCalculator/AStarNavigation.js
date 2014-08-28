var astarModule = require("./AStar.js")();
var easypost = require('easypost');
var redis = require('redis');
var config = require("./../config.js");
//var redis_port = 6379,
//    redis_host = "127.0.0.1";

exports.findPath = function (req, res) {
    easypost.get(req, res, function (data) {
        if (!data) {
            console.log('data is not defined.');
            res.end(500, "there is no data in the request body");
            return;
        }
        else {
            data = typeof (data) == "object" ? data : JSON.parse(data);
            var graphMatrix = data.graphMatrix;
            var startNode = data.start;
            var endNode = data.end;
            var graphID = data.graphID;
            var opt = {closest: true};
            if (!graphMatrix && graphID) {
                var client = redis.createClient(config.redisSettings.port, config.redisSettings.host);
                client.on("error", function (err) {
                    if (err) {
                        res.end(500, {result: false, message: err});
                        return;
                    }
                });
                client.get(graphID, function (err, data) {
                    if (err) {
                        res.end(500, {result: false, message: err});
                        return;
                    }
                    graphMatrix = JSON.parse(data);
                    var astar = astarModule.astar;
                    var gp = new astarModule.Graph(graphMatrix, { diagonal: false });
                    var start = gp.grid[startNode.x][startNode.y];
                    var end = gp.grid[endNode.x][endNode.y];
                    var result = astar.search(gp, start, end, opt);
                    res.send(result);
                });
                client.quit();
            }
            else {
                var astar = astarModule.astar;
                var gp = new astarModule.Graph(graphMatrix, { diagonal: false });
                var start = gp.grid[startNode.x][startNode.y];
                var end = gp.grid[endNode.x][endNode.y];
                var result = astar.search(gp, start, end, opt);
                res.send(result);
            }
        }
    });
}

exports.saveGraphMatrix = function (req, res) {
    easypost.get(req, res, function (data) {
        if (!data) {
            console.log('data is not defined.');
            res.end(500, "there is no data in the request body");
            return;
        }
        else {
            data = typeof (data) == "object" ? data : JSON.parse(data);
            var client = redis.createClient(config.redisSettings.port, config.redisSettings.host);
            client.on("error", function (err) {
                if (err) {
                    res.end(500, {result: false, message: err});
                    return;
                }
            });
            var graphKey = data.graphName;
            var graphMatrix = data.graphMatrix;
            if (graphKey && graphMatrix) {
                client.set(graphKey, JSON.stringify(graphMatrix));
                res.send({result: "success saved the matrix"});
            }
            client.quit();
        }
    });
}

exports.getGraphMatrix = function (req, res) {
    var graphID = req.param("graphid");
    var client = redis.createClient(config.redisSettings.port, config.redisSettings.host);
    client.on("error", function (err) {
        if (err) {
            res.end(500, {result: false, message: err});
            return;
        }
    });
    client.get(graphID, function (err, data) {
        res.send(JSON.parse(data));
    });
    client.quit();
}