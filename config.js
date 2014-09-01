exports.uuidArr = function () {
    var pointSB = [];
    var frontStr = 'E2C56DB5-DFFB-48D2-B060-D0F5A71096E0';
    pointSB[frontStr + '_0_1'] = {x: 0.00, y: 6.00};
    pointSB[frontStr + '_0_2'] = {x: 5.40, y: 0.00};
    pointSB[frontStr + '_0_3'] = {x: 0.00, y: 0.00};
    pointSB[frontStr + '_0_4'] = {x: 5.40, y: 6.00};
    pointSB[frontStr + '_0_5'] = {x: 4.10, y: 2.80};
    pointSB[frontStr + '_0_6'] = {x: -0.32, y: 2.80};//-0.32墙。

    var singleSensorPoint = [];
    singleSensorPoint[frontStr + "_0_7"] = {x: 0.00};
    singleSensorPoint[frontStr + "_0_8"] = {x: 5.00};
    singleSensorPoint[frontStr + "_0_9"] = {x: 10.00};
    singleSensorPoint[frontStr + "_0_10"] = {x: 15.00};

    return pointSB;
};

//模型二：直线模型的beacon距离
exports.singleSensorPointArray = function () {
    var frontStr = 'E2C56DB5-DFFB-48D2-B060-D0F5A71096E0';
    var singleSensorPoint = [];
    singleSensorPoint[frontStr + "_0_3"] = {x: 0.00};
    singleSensorPoint[frontStr + "_0_6"] = {x: 1.50};
    singleSensorPoint[frontStr + "_0_2"] = {x: 5.40};
    singleSensorPoint[frontStr + "_0_9"] = {x: 6.90};
    singleSensorPoint[frontStr + "_0_7"] = {x: 8.40};
    singleSensorPoint[frontStr + "_0_8"] = {x: 11.70};

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
    points[frontStr + "_0_3"+frontStr + "_0_6"]={x:458.09,y:2207.61};
    points[frontStr + "_0_6"+frontStr + "_0_2"]={x:918.09,y:2202.85};
    points[frontStr + "_0_2"+frontStr + "_0_9"]={x:1360.95,y:2200.00};
    points[frontStr + "_0_9"+frontStr + "_0_7"]={x:1728.57,y:2192.38};
    points[frontStr + "_0_7"+frontStr + "_0_8"]={x:2279.04,y:2197.14};

    return points;
};

exports.lineOffset = {
    //var offset = {
        x: 0,
        y: 1.5
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
