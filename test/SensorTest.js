var sensorCalculator=require(".././SensorCalculator.js");
var fs=require("fs");
//var findPath=require(".././AStarNavigation.js");
//
//var tpGraph=[];
//
//findPath.findPath(tpGraph,{x:0,y:0},{x:3,y:4});

fs.readFile('../sampleData/data3.txt',{encoding:"UTF8",flag:"r"}, function (err, data) {
    if (err) throw err;
    //console.log(data);
    var tpObj=JSON.parse(data);
    //var result= sensorCalculator.processCalculate(data);//
    sensorCalculator.filterDataByAcc(tpObj,"5");
    console.log(result);
});
