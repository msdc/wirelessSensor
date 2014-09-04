exports.uuidArr = function () {
    var pointSB = [];
    var frontStr = 'E2C56DB5-DFFB-48D2-B060-D0F5A71096E0';
    pointSB[frontStr + "_0_3"] = {x: 3.87, y: 24.20};
    pointSB[frontStr + "_0_6"] = {x: 8.20, y: 24.23};
    pointSB[frontStr + "_0_2"] = {x: 11.35, y: 24.28};
    pointSB[frontStr + "_0_9"] = {x: 15.58, y: 24.23};
    pointSB[frontStr + "_0_7"] = {x: 2.58, y: 20.90};
    pointSB[frontStr + "_0_8"] = {x: 24.69, y: 24.23};//-0.32墙。

    return pointSB;
};

//模型二：直线模型的beacon距离
exports.singleSensorPointArray = function () {
    var frontStr = 'E2C56DB5-DFFB-48D2-B060-D0F5A71096E0';
    var singleSensorPoint = [];
    singleSensorPoint[frontStr + "_0_3"] = {x: 3.87};
    singleSensorPoint[frontStr + "_0_6"] = {x: 8.20};
    singleSensorPoint[frontStr + "_0_2"] = {x: 11.35};
    singleSensorPoint[frontStr + "_0_9"] = {x: 15.58};
    singleSensorPoint[frontStr + "_0_7"] = {x: 20.58};
    singleSensorPoint[frontStr + "_0_8"] = {x: 24.69};

    return singleSensorPoint;
};

exports.redisSettings = {
//    var obj = {
//        host: "192.168.1.120",
//        port: 6379
//    };
    //var obj = {
    host: "127.0.0.1",
    port: 6379
}

//模型三：固定点与beacon点的映射表
exports.pointsMappingArray=function(){
    var frontStr='E2C56DB5-DFFB-48D2-B060-D0F5A71096E0';
    var points=[];
    points[frontStr + "_0_1"+frontStr + "_0_5"]={x:340.00,y:1977.00};
    points[frontStr + "_0_5"+frontStr + "_0_4"]={x:340.00,y:2022.00};
    points[frontStr + "_0_3"+frontStr + "_0_6"]={x:450.00,y:2225.00};
    points[frontStr + "_0_6"+frontStr + "_0_2"]={x:900.00,y:2225.00};
    points[frontStr + "_0_2"+frontStr + "_0_9"]={x:1350.00,y:2225.00};
    points[frontStr + "_0_9"+frontStr + "_0_8"]={x:1725.00,y:2225.00};
    points[frontStr + "_0_7"+frontStr + "_0_8"]={x:2725.00,y:2150.00};

    return points;
};
//单位为米
exports.lineOffset = {
    //var offset = {
        x: 0,
        y: 24.23
    //};//实际的偏移量
    //return offset;
};

//默认过滤指定acc的距离配置
exports.defaultBeaconDistance=5;

//各个模型所对应方法的名称
exports.methodName={
    trilateration:"trilateration",
    singleLine:"singleLine",
    mapping:"mapping"
};

/**
 var uuidArr=[//测试数据(固定值，设备坐标)
 {pointSB:'E2C56DB5-DFFB-48D2-B060-D0F5A71096E0_0_1',x:0.00,y:5.00},
 {pointSB:'E2C56DB5-DFFB-48D2-B060-D0F5A71096E0_0_2',x:5.00,y:0.00},
 {pointSB:'E2C56DB5-DFFB-48D2-B060-D0F5A71096E0_0_3',x:0.00,y:5.00},
 {pointSB:'E2C56DB5-DFFB-48D2-B060-D0F5A71096E0_0_4',x:5.00,y:5.00},
 {pointSB:'E2C56DB5-DFFB-48D2-B060-D0F5A71096E0_0_5',x:2.50,y:2.30},
 {pointSB:'E2C56DB5-DFFB-48D2-B060-D0F5A71096E0_0_6',x:10.00,y:5.00}
 ];
 var uuidArr_L=uuidArr.length;config.uuidArr()
 **/

/**uuidArr = [{pointSB:'a0',x:2,y:2},{pointSB:'a1',x:20,y:30}];格式。。//,Cacc:'FE添加的mpgAjax中每个距离acc'
 * 坐标系X----向右; Y----向下
 * pointSB:uuid+“_”+major+"_"+"minor"
 * x: cell y:cell   distance: rate,, realX==cell*rate.
 * **/

/**测试数据的格式【后台返的】
 var mpgAjax = [
 {"deviceSerial": "F2LJMKYDDTWD", "deviceName": "Ning’s iPhone", "monitorPackage": [
     {"checkPoint": "2014-08-13 03:27:25:7930", "beaconPKG": [
         {"major": "0", "minor": "2", "uuid": "E2C56DB5-DFFB-48D2-B060-D0F5A71096E0", "beaconBLE": "", "acc": "3.84"},
         {"major": "0", "minor": "4", "uuid": "E2C56DB5-DFFB-48D2-B060-D0F5A71096E0", "beaconBLE": "", "acc": "10.79"},
         {"major": "0", "minor": "5", "uuid": "E2C56DB5-DFFB-48D2-B060-D0F5A71096E0", "beaconBLE": "", "acc": "11.50"},
         {"major": "0", "minor": "6", "uuid": "E2C56DB5-DFFB-48D2-B060-D0F5A71096E0", "beaconBLE": "", "acc": "39.23"}
     ]},
     {"checkPoint": "2014-08-13 03:27:26:2930", "beaconPKG": [
         {"major": "0", "minor": "2", "uuid": "E2C56DB5-DFFB-48D2-B060-D0F5A71096E0", "beaconBLE": "", "acc": "3.84"},
         {"major": "0", "minor": "4", "uuid": "E2C56DB5-DFFB-48D2-B060-D0F5A71096E0", "beaconBLE": "", "acc": "10.79"},
         {"major": "0", "minor": "5", "uuid": "E2C56DB5-DFFB-48D2-B060-D0F5A71096E0", "beaconBLE": "", "acc": "11.50"}
     ]}
 ]}
 ];
 **/
/**提交的数据格式
 var kTjFormat={
    "deviceID": "mobile1",deviceSerial:'1141',"timePoint": "2013-12-23 00:00:00:0001","beaconCalculatePosition": [{"x": "0.813","y": "2.88624"},{"x": "1.86","y": "2.88"}]
};
 **/
