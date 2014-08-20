var sensorCalculator=require(".././SensorCalculator.js");
var fs=require("fs");

fs.readFile('../sampleData/data3.txt',{encoding:"UTF8",flag:"r"}, function (err, data) {
    if (err) throw err;
    //console.log(data);
    var tpObj=JSON.parse(data);
    var result= sensorCalculator.processCalculate(data);//sensorCalculator.filterDataByAcc(tpObj,"20");
    console.log(result);
});
