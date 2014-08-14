/**
 * Created by wang on 2014/8/12.
 */
var redis=require('redis');
var easypost=require('easypost');
var trilateration=require("./Trilateration.js");
var kmeans=require("./KMeansClustering.js");
/**
 * @说明 获取手机端post数据的api接口
 * @api public
 * */
exports.GetSensorDataFromMobile=function(req,res){
    client = redis.createClient();
    client.on("error", function (err) {
        if(err){SendError(err, res);}
    });

//// test data.
//    var data = {
//        "deviceName": "mobile1",
//        "deviceSerial": "f2ljmkdotwo",
//        "monitorPackage": [
//            {
//                "checkPoint": "2011-12-11 00:00:00:0000",
//                "beaconPKG": [
//                    {
//                        "uuid": "qweqe-123ff-123f-sarqr1",
//                        "major": "0",
//                        "minor": "4",
//                        "beaconBLE": "qweqe-123ff-123f-sarq23",
//                        "acc": "5.74"
//                    },
//                    {
//                        "uuid": "qweqe-123ff-123f-sarqr2",
//                        "major": "0",
//                        "minor": "4",
//                        "beaconBLE": "qweqe-123ff-123f-sarq23",
//                        "acc": "6.24"
//                    },
//                    {
//                        "uuid": "qweqe-123ff-123f-sarqr3",
//                        "major": "0",
//                        "minor": "4",
//                        "beaconBLE": "qweqe-123ff-123f-sarq23",
//                        "acc": "3.74"
//                    },
//                    {
//                        "uuid": "qweqe-123ff-123f-sarqr4",
//                        "major": "0",
//                        "minor": "4",
//                        "beaconBLE": "qweqe-123ff-123f-sarq23",
//                        "acc": "3.48"
//                    }
//                ]
//            },
//            {
//                "checkPoint": "2011-12-11 00:00:12:5600",
//                "beaconPKG": [
//                    {
//                        "uuid": "qweqe-123ff-123f-sarqr1",
//                        "major": "0",
//                        "minor": "4",
//                        "beaconBLE": "qweqe-123ff-123f-sarq23",
//                        "acc": "5.74"
//                    },
//                    {
//                        "uuid": "qweqe-123ff-123f-sarqr2",
//                        "major": "0",
//                        "minor": "3",
//                        "beaconBLE": "qweqe-123ff-123f-sarq23",
//                        "acc": "6.24"
//                    },
//                    {
//                        "uuid": "qweqe-123ff-123f-sarqr3",
//                        "major": "0",
//                        "minor": "2",
//                        "beaconBLE": "qweqe-123ff-123f-sarq23",
//                        "acc": "3.74"
//                    },
//                    {
//                        "uuid": "qweqe-123ff-123f-sarqr4",
//                        "major": "0",
//                        "minor": "1",
//                        "beaconBLE": "qweqe-123ff-123f-sarq23",
//                        "acc": "3.48"
//                    }
//                ]
//            }
//        ]
//    };

    easypost.get(req, res, function (data) {
        if(!data.monitorPackage){
            res.send({result:false,message:"数据格式错误！monitorPackage未指定！"});
        }

        var serializeJsonData=JSON.stringify(data);
        var timespan=new Date().getUTCMilliseconds();
        client.set(data.deviceSerial+"_"+timespan, serializeJsonData);
        var tpNDataArray=[];
        tpNDataArray.push(data);
//        var trlCal=new trilateration(tpNDataArray);
//
//        trlCal.delKeyZero(function (pointDt) {
//            kmeans.GetMobileCurrentLocation(pointDt,function(finalPoint){
//                res.send(finalPoint);
//                console.log("deviceID="+finalPoint.deviceID);
//                console.log("timePoint="+finalPoint.timePoint);
//                console.log("beaconCanculatePosition="+finalPoint.beaconCanculatePosition.toString());
//                //todo write back info the redis and trigger postback event using websocket
//                var resultPointKeyName=finalPoint.deviceID+"_"+new Date().getUTCMilliseconds()+"_"+"Calculated";
//                client.set(resultPointKeyName,finalPoint);
//            });
//        });
        client.quit();
    });
};

/**
 * @param
 * @说明 向客户端发送错误信息，并向控制台输出该错误信息。
 * @api private.
 * */
function SendError(err, res) {
    console.error(err);
    res.send({result: false, message:err});
}

exports.getSampleData=function(req,res){
    client = redis.createClient();
    client.on("error", function (err) {
        console.log("Error " + err);
    });

    client.get('F2LJMKYDDTWD_173',function(err,reply){

        var tpNDataArray = [];
        tpNDataArray.push(JSON.parse(reply));
        var trlCal = new trilateration(tpNDataArray);

        trlCal.delKeyZero(function (pointDt) {
            for (var point in pointDt) {
                kmeans.GetMobileCurrentLocation(pointDt[point], function (finalPoint) {
                    res.send(finalPoint);
                    console.log("deviceID=" + finalPoint.deviceID);
                    console.log("timePoint=" + finalPoint.timePoint);
                    console.log("beaconCanculatePosition=" + finalPoint.beaconCanculatePosition.toString());
                    //todo write back info the redis and trigger postback event using websocket
                });
            }
        });

        client.quit();
    });
};

/**
 * @param:[key]:deviceName设备名称  [callback] 回调函数，有两个参数 err,reply
 * reply中包含获取的数据信息，err 返回redis错误信息。
 * @api public
 * */
exports.GetSensorDataFromRedis=function(key,callback){
    client = redis.createClient();
    client.on("error", function (err) {
        console.log("Error " + err);
    });

    client.get(key,function(err,reply){
        callback(err, reply);
        client.quit();
    });
};
