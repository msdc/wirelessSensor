/**
 * Created by wang on 2014/8/21.
 */
var redis=require('redis');
var redis_port = 6379,
    redis_host = "127.0.0.1";

function StaticData(){};

StaticData.prototype.ErrorHandler=function(redis_client){
    var client=redis_client;
    client.on("error",function(err){
        client.quit();
        console.log("Error " + err);
    });
};

/**
*
 * 设备列表静态数据源.数据源中的数据对象字段说明:
 id:设备id, deviceName:设备名称, addTime:添加时间, nextMaintain:下一次维护时间, state:设置状态
* */
StaticData.prototype.AddDeviceListData=function(){
    var client=redis.createClient(redis_port,redis_host);

    this.ErrorHandler(client);

//    client.zadd('deviceList',function(err, reply){
//         if(err)
//    });

    var deviceList=[];

    var prefixString='E2C56DB5-DFFB-48D2-B060-D0F5A71096E0_0_';

    var currentDate=new Date();

    for(var i=0;i<100;i++){
        deviceList.push({id:i+1,deviceName:prefixString+String(i+1),addTime:currentDate.setDate(i+3),nextMaintain:currentDate.setDate(i+15),state:0});
    }

    return deviceList;
};

/**
 *
 * 设备信息
 *  场所名称：xxxxx 设备名称：deviceName+major+minor  设备编号：deviceSerial 标注状态（该设备是否已在该场所标注）
 * */
StaticData.prototype.deviceInformation=function(){};





