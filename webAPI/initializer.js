/**
 * Created by wang on 2014/9/3.
 */
var redis=require('redis');
var config = require("./../config.js");
var spawn=require('child_process').spawn;
var initData=require('./initializationData.js');
exports.webDeploy=function(req,res){
    var linuxShell=spawn("/www/wls/restartnodejs");

    linuxShell.on("error",function(err){
        res.send({success:false,message:err.message});
        res.end();
        return;
    });

    linuxShell.on('exit',function(code){
        res.send({success:true,message:code});
        res.end();
        return;
    });

    res.send({success:true,message:"OK"});
};

exports.dataInit=function(req,res){
   var client=redis.createClient(config.redisSettings.port,config.redisSettings.host);

    client.on("error", function (err) {
        console.log("Connection Error:", err);
        client.quit();
        res.send({success: false, message: err.message});
        res.end();
        return;
    });

    client.flushdb(function(err,result){
        if(result&&result==="OK"){
            place_initializer(client);
            beaconDevice_Initializer(client);
            seller_Initializer(client);
            matrix_Initializer(client);
            client.quit();
            res.send({success:true,message:null});
            res.end();
        }else
        {
            client.quit();
            res.send({success:false,message:null});
            res.end();
        }
    });
};

function place_initializer(redisClient){
    var client = redisClient;
    var places = initData.places();
    for (var index in places) {
        var placeData = places[index];
        var tpkey = "place" + "_" + placeData.name + "_" + placeData.id;
        client.set(tpkey, JSON.stringify(placeData));
    }
}

function beaconDevice_Initializer(redisClient){
    var client = redisClient;
    var beaconDevices = initData.beaconDevices();
    for (var index in beaconDevices) {
        var beaconDeviceData = beaconDevices[index];
        var tpkey = "device" + "_" + beaconDeviceData.uuid + "_" + beaconDeviceData.major + "_" + beaconDeviceData.minor;
        client.set(tpkey, JSON.stringify(beaconDeviceData));
    }
}

function seller_Initializer(redisClient){
    var client = redisClient;
    var sellers = initData.sellers();
    for (var index in sellers) {
        var sellerData = sellers[index];
        var tpkey = "seller" + "_" + sellerData.name + "_" + sellerData.id;
        client.set(tpkey, JSON.stringify(sellerData));
    }
}

function matrix_Initializer(redisClient){
    var client = redisClient;
    var matrixData = initData.matrix;
    var matrixKey = 'graph';
    client.set(matrixKey, JSON.stringify(matrixData));
}