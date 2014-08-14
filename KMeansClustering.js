/**
 * Created by wang on 2014/8/7.
 */

var data=[];
var means = [];
var assignments = [];
var dataExtremes;
var dataRange;

/**
 * @param beaconCanculatePosition参数信息。
 * @return 返回所有x,y坐标中的最大最小值的范围。
 * @api private
* */
function getDataRanges(extremes) {
    var ranges = [];

    for (var dimension in extremes)
    {
        ranges[dimension] = extremes[dimension].max - extremes[dimension].min;
    }

    return ranges;

}

/**
 * @param points点信息。
 * @return 返回所有x,y坐标中的最大最小值。
 * @api private
 * */
function getDataExtremes(points) {

    var extremes = [];
    var count=-1;
    for (var i in data)
    {
        count++;
        var point = data[i];

        for (var dimension in point)
        {
            //console.log("point_"+count+":"+dimension+"="+point[dimension]+";");
            if ( ! extremes[dimension] )
            {
                extremes[dimension] = {min: 1000, max: 0};
            }
            if(point[dimension]===-Infinity||point[dimension]===Infinity||point[dimension]===NaN||point[dimension]===undefined)
            {
                console.log("第"+count+"个点，"+dimension+"="+point[dimension]+"，坐标数据异常，已排除此点");
                continue;
            }

            if (point[dimension] < extremes[dimension].min)
            {
                extremes[dimension].min = point[dimension];
            }

            if (point[dimension] > extremes[dimension].max)
            {
                extremes[dimension].max = point[dimension];
            }

            //console.log(dimension+".min="+extremes[dimension].min+";"+dimension+".max="+extremes[dimension].max);
        }
    }

    return extremes;

}

/**
 * @param K-means中的k参数
 * @return 返回初始类聚点。
 * @api private
 * */
function initMeans(k) {

    if ( ! k )
    {
        k = 3;
    }

    while (k--)
    {
        var mean = [];

        for (var dimension in dataExtremes)
        {
            mean[dimension] = dataExtremes[dimension].min + ( Math.random() * dataRange[dimension] );
        }

        means.push(mean);
    }

    return means;

};

/**
 * @param 无
 * @说明：点分组
 * @api private
 * */
function makeAssignments() {

    for (var i in data)
    {
        var point = data[i];
        var distances = [];

        for (var j in means)
        {
            var mean = means[j];
            var sum = 0;

            for (var dimension in point)
            {
                var difference = point[dimension] - mean[dimension];
                difference *= difference;
                sum += difference;
            }

            distances[j] = Math.sqrt(sum);
        }

        assignments[i] = distances.indexOf( Math.min.apply(null, distances) );
    }

}

/**
 * @param
 * @说明：确定类聚点
 * @api private
 * */
function moveMeans() {

    makeAssignments();

    var sums = Array( means.length );
    var counts = Array( means.length );
    var moved = false;

    for (var j in means)
    {
        counts[j] = 0;
        sums[j] = Array( means[j].length );
        for (var dimension in means[j])
        {
            sums[j][dimension] = 0;
        }
    }

    for (var point_index in assignments)
    {
        var mean_index = assignments[point_index];
        var point = data[point_index];
        var mean = means[mean_index];

        counts[mean_index]++;

        for (var dimension in mean)
        {
            sums[mean_index][dimension] += point[dimension];
        }
    }

    for (var mean_index in sums)
    {
        //console.log(counts[mean_index]);
        if ( 0 === counts[mean_index] )
        {
            sums[mean_index] = means[mean_index];
            //console.log("Mean with no points");
            //console.log(sums[mean_index]);

            for (var dimension in dataExtremes)
            {
                sums[mean_index][dimension] = dataExtremes[dimension].min + ( Math.random() * dataRange[dimension] );
            }
            continue;
        }

        for (var dimension in sums[mean_index])
        {
            sums[mean_index][dimension] /= counts[mean_index];
        }
    }

    if (means.toString() !== sums.toString())
    {
        moved = true;
    }

    means = sums;

    return moved;

}

/**
 * @param
 * @api private
 * */
function getMobilePostion() {

    var moved = moveMeans();

    if (moved)
    {
        getMobilePostion();
    }
}

/**
 * @参数：包含手持设备坐标地址数组信息的对象
 * 参数示例:
 * {
    "deviceID": "mobile1",
    "timePoint": "2013-12-23 00:00:00:0001",
    "beaconCanculatePosition": [
        {
            "x": 0.58,
            "y": 2.34
        },
        {
            "x": 1.25,
            "y": 2.88
        }
    ]
   }

 *
 * @返回值: 手持设备当前坐标地址
 * 返回值示例：{x:5,y:5}
 * @api public
 */
exports.GetFinallySensorData=function(calculatedSensorData,next){
    data=calculatedSensorData.beaconCanculatePosition;
    dataExtremes = getDataExtremes(data);
    dataRange = getDataRanges(dataExtremes);
    means = initMeans(1);

    makeAssignments();
    getMobilePostion();

    var mobilePosition={deviceID:calculatedSensorData.deviceID,deviceSerial:calculatedSensorData.deviceSerial,timePoint:calculatedSensorData.timePoint,beaconCanculatePosition:[{x:means[0].x,y:means[0].y}]};

    //reset global variable.
    means=[];
    assignments = [];
    data = [];

    next(mobilePosition);
};

/**
* @参数：手持设备坐标地址，iBeacon设备坐标地址数组。
* 手持设备坐标示例：{x:1,y:1}
* iBeacon设备坐标地址数组示例： [{x:1,y:1}，{x:2,y:2}，{x:3,y:3}]
*
* @返回值: 标有手持设备和iBeacon设备坐标地址的矢量图
* @api:public
*/
exports.GetVectorGraph=function(mobileLocation,locationArray){

};


/*
 * Res.js调用mobileLocation.js的方法步骤
 * 1.引用对应的js文件  var mobileLocation=require('./mobileLocation');
 * 2.需要修改Res.js中的传递的数据格式  bCPos.push({x:x,y:y});
 * 3.如果是多个设备，则需要循环调用得到最终的坐标点，代码格式如下所示：
         var Cal = new Calculation();
         var result=Cal.result();
         for(var r in result)
         {
            var obj =mobileLocation.GetMobileCurrentLocation(result[r]);
            console.log(obj);
         }
 *
 * */