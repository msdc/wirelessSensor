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
            res.send(500, "there is no data in the request body");
            res.end();
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
                        res.send(500, {result: false, message: err});
                        res.end();
                        return;
                    }
                });
                client.get(graphID, function (err, data) {
                    if (err) {
                        res.send(500, {result: false, message: err});
                        res.end();
                        return;
                    }
                    graphMatrix = JSON.parse(data);
                    var astar = astarModule.astar;
                    var gp = new astarModule.Graph(graphMatrix, { diagonal: false });
                    var start = gp.grid[parseInt(startNode.x)][parseInt(startNode.y)];
                    var end = gp.grid[parseInt(endNode.x)][parseInt(endNode.y)];
                    var result = astar.search(gp, start, end, opt);
                    res.send(result);
                    res.end();
                });
                client.quit();
            }
            else {
                var astar = astarModule.astar;
                var gp = new astarModule.Graph(graphMatrix, { diagonal: false });
                var start = gp.grid[parseInt(startNode.x)][parseInt(startNode.y)];
                var end = gp.grid[parseInt(endNode.x)][parseInt(endNode.y)];
                var result = astar.search(gp, start, end, opt);
                res.send(result);
                res.end();
            }
        }
    });
}

exports.saveGraphMatrix = function (req, res) {
    easypost.get(req, res, function (data) {
        if (!data) {
            console.log('data is not defined.');
            res.send(500, "there is no data in the request body");
            res.end();
            return;
        }
        else {
            data = typeof (data) == "object" ? data : JSON.parse(data);
            var client = redis.createClient(config.redisSettings.port, config.redisSettings.host);
            client.on("error", function (err) {
                if (err) {
                    res.send(500, {result: false, message: err});
                    res.end();
                    return;
                }
            });
            var graphKey = data.graphName;
            var graphMatrix = data.graphMatrix;
            if (graphKey && graphMatrix) {
                client.set(graphKey, JSON.stringify(graphMatrix));
                res.send({result: "success saved the matrix"});
                res.end();
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
            res.send(500, {result: false, message: err});
            res.end();
            return;
        }
    });
    client.get(graphID, function (err, data) {
        res.send(JSON.parse(data));
        res.end();
    });
    client.quit();
}