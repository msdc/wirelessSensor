/**
 * Created by wang on 2014/8/25.
 */
function MonitorPackageHandler(monitorPackage,beaconPointArray){
    this.monitorPackage=monitorPackage||{};
    this.beaconArray=beaconPointArray;
    this.prefixString='E2C56DB5-DFFB-48D2-B060-D0F5A71096E0_0_';
}

MonitorPackageHandler.prototype.getBeaconDistance=function(beaconIndex){
    var beaconIndex=beaconIndex||0;
    var beaconArray=this.beaconArray;
    var prefixString=this.prefixString;
    var beaconObj=beaconArray[prefixString+String(beaconIndex)];
    if(beaconObj){
        return beaconObj.x;
    }
    return null;
};

MonitorPackageHandler.prototype.getMinorsArray=function(){
    var beaconArray=this.beaconArray;
    var minor=[];

    for(var beacon in beaconArray){
        var beaconIndex=beacon.substr(-1,1);
        minor.push(beaconIndex);
    }

    return minor;
};

MonitorPackageHandler.prototype.getMinorGroups=function(minors){
    var minors=minors;
    var minorGroup=[];
    for(var i=0;i<minors.length;i++){
        for(var j=i+1;j<minors.length;j++){
            var group=[];
            group.push(minors[i]);
            group.push(minors[j]);
            minorGroup.push(group);
        }
    }
    return minorGroup;
};

MonitorPackageHandler.prototype.getAverageDistance=function(monitorPackageHandler,monitorPackage,minors){
    var monitorPackage=monitorPackage||{};
    var monitorPackageHandler=monitorPackageHandler||{};
    var minorGroup=this.getMinorGroups(minors);
    var resultArray=[];
    for(var groupIndex in minorGroup){
        var group=minorGroup[groupIndex];
        resultArray=resultArray.concat(monitorPackageHandler.getFinalDistance(monitorPackageHandler,monitorPackage,group[0],group[1]));
    }

    return resultArray;
};

MonitorPackageHandler.prototype.getAccValue=function(monitorPackage,minorIndex){
    var monitorPackage=monitorPackage||{};
    var accValue=null;
    var minorIndex=Number(minorIndex);
    for(var beaconPkgIndex in monitorPackage){
        var beaconPKG=monitorPackage[beaconPkgIndex].beaconPKG;
        for(var beaconIndex in beaconPKG){
            var beaconObj=beaconPKG[beaconIndex];
            var minorValue=Number(beaconObj.minor);
            if(minorIndex===minorValue){
                accValue=beaconObj.acc;
                break;
            }
        }
    }

    return accValue;
};

MonitorPackageHandler.prototype.getAverageMonitorPackage=function(){
    var monitorPackage=this.monitorPackage;
    var result=[];

    var minors=this.getMinorsArray();

    for(var minorIndex in minors){
        var minor=Number(minors[minorIndex]);
        var sumDistance=0;
        var beaconPkgCounts=0;

        for(var beaconPkgIndex in monitorPackage){
            var beaconPKG=monitorPackage[beaconPkgIndex].beaconPKG;
            for(var beaconIndex in beaconPKG){
                var beaconObj=beaconPKG[beaconIndex];
                var beaconMinor=Number(beaconObj.minor);
                var acc=Number(beaconObj.acc);
                if(beaconMinor===minor){
                    beaconPkgCounts++;//过滤后数据中剩余的每个beacon的样本数量
                    sumDistance+=acc;
                }
            }
        }

        //console.log("sumDistance"+minor+"="+sumDistance);
        //console.log("beaconPkgCounts"+minor+"="+beaconPkgCounts);
        if(beaconPkgCounts===0)continue;
        var accAverage=sumDistance/beaconPkgCounts;
        //console.log("accAverage"+minor+"="+accAverage);
        var averageResult={"major": "0", "minor": ""+minor+"", "uuid": "E2C56DB5-DFFB-48D2-B060-D0F5A71096E0", "beaconBLE": "", "acc": accAverage};
        result.push(averageResult);
    }

//    var sumDistanceBeaconOne=0;
//    var sumDistanceBeaconTwo=0;
//    var sumDistanceBeaconThree=0;
//    var sumDistanceBeaconFour=0;
//    var sumDistanceBeaconFive=0;
//    var sumDistanceBeaconSix=0;
//    var beaconPkgCounts=0;//save counts of the monitorPackage.
//    for(var beaconPkgIndex in monitorPackage){
//        beaconPkgCounts++;
//        var beaconPKG=monitorPackage[beaconPkgIndex].beaconPKG;
//        for(var beaconIndex in beaconPKG){
//            var beaconObj=beaconPKG[beaconIndex];
//
//            var minor=Number(beaconObj.minor);
//            var acc=Number(beaconObj.acc);
//            switch(minor){
//                case 1:
//                    sumDistanceBeaconOne+=acc;
//                    break;
//                case 2:
//                    sumDistanceBeaconTwo+=acc;
//                    break;
//                case 3:
//                    sumDistanceBeaconThree+=acc;
//                    break;
//                case 4:
//                    sumDistanceBeaconFour+=acc;
//                    break;
//                case 5:
//                    sumDistanceBeaconFive+=acc;
//                    break;
//                case 6:
//                    sumDistanceBeaconSix+=acc;
//                    break;
//            }
//        }
//    }
//
//    console.log("sumDistanceBeaconOne="+sumDistanceBeaconOne);
//    console.log("sumDistanceBeaconTwo="+sumDistanceBeaconTwo);
//    console.log("sumDistanceBeaconThree="+sumDistanceBeaconThree);
//    console.log("sumDistanceBeaconFour="+sumDistanceBeaconFour);
//    console.log("sumDistanceBeaconFive="+sumDistanceBeaconFive);
//    console.log("sumDistanceBeaconSix="+sumDistanceBeaconSix);
//    console.log("beaconPkgCounts="+beaconPkgCounts);
//
//    var averageResult={"major": "0", "minor": "1", "uuid": "E2C56DB5-DFFB-48D2-B060-D0F5A71096E0", "beaconBLE": "", "acc": sumDistanceBeaconOne/beaconPkgCounts};
//    result.push(averageResult);
//    averageResult={"major": "0", "minor": "2", "uuid": "E2C56DB5-DFFB-48D2-B060-D0F5A71096E0", "beaconBLE": "", "acc": sumDistanceBeaconTwo/beaconPkgCounts};
//    result.push(averageResult);
//    averageResult={"major": "0", "minor": "3", "uuid": "E2C56DB5-DFFB-48D2-B060-D0F5A71096E0", "beaconBLE": "", "acc": sumDistanceBeaconThree/beaconPkgCounts};
//    result.push(averageResult);
//    averageResult={"major": "0", "minor": "4", "uuid": "E2C56DB5-DFFB-48D2-B060-D0F5A71096E0", "beaconBLE": "", "acc": sumDistanceBeaconFour/beaconPkgCounts};
//    result.push(averageResult);
//    averageResult={"major": "0", "minor": "5", "uuid": "E2C56DB5-DFFB-48D2-B060-D0F5A71096E0", "beaconBLE": "", "acc": sumDistanceBeaconFive/beaconPkgCounts};
//    result.push(averageResult);
//    averageResult={"major": "0", "minor": "6", "uuid": "E2C56DB5-DFFB-48D2-B060-D0F5A71096E0", "beaconBLE": "", "acc": sumDistanceBeaconSix/beaconPkgCounts};
//    result.push(averageResult);

    var lastestCheckPoint=monitorPackage[monitorPackage.length-1].checkPoint;

    var finalResult=[];
    var packageObj={};
    packageObj.checkPoint=lastestCheckPoint;
    packageObj.beaconPKG=result;
    finalResult.push(packageObj);

    return finalResult;
};

/**
 *
 * @参数 indexArg0:第1个beacon的索引   indexArg1:第2个beacon的索引
 * */
MonitorPackageHandler.prototype.getFinalDistance=function(monitorPackageHandler,monitorPackage,indexArg0,indexArg1){
    var resultArray=[];
    var monitorPackageHandler=monitorPackageHandler||{};
    var monitorPackage=monitorPackage||{};
    var firstBeaconIndex=Number(indexArg0)||0;
    var secondBeaconIndex=Number(indexArg1)||0;

    //实际设备到beacon1的距离
    var d1=monitorPackageHandler.getAccValue(monitorPackage,firstBeaconIndex);
    //实际设备到beacon2的距离
    var d2=monitorPackageHandler.getAccValue(monitorPackage,secondBeaconIndex);
    //二元方程中的x平方前的系数
    var factor1=Math.pow((d1/d2-1),2);
    //beacon1点预设的初始距离
    var b1=monitorPackageHandler.getBeaconDistance(firstBeaconIndex);
    //beacon2点预设的初始距离
    var b2=monitorPackageHandler.getBeaconDistance(secondBeaconIndex);
    //二元方程中的x前的系数
    var factor2=2*b1-Math.pow((d1/d2),2)*2*b2;
    //二元方程上的常数
    var factor3=Math.pow((d1/d2),2)*Math.pow(b2,2)-Math.pow(b1,2);

    var result1=(-factor2+Math.sqrt(Math.pow(factor2,2)-4*factor1*factor3))/2*factor1;
    if(result1!==undefined&&!isNaN(result1)&&result1!==null){
        resultArray.push(result1);
    }
    var result2=(-factor2-Math.sqrt(Math.pow(factor2,2)-4*factor1*factor3))/2*factor1;
    if(result2!==undefined&&!isNaN(result2)&&result2!==null){
        resultArray.push(result2);
    }

    return resultArray;
};

MonitorPackageHandler.prototype.getArrayAverageValue=function(arrayObj){
    var array=arrayObj||[];
    var counts=0;
    var sum=0;
    var average=-1;
    for(var arrIndex in array){
        counts++;
        var obj=array[arrIndex];
        if(!isNaN(obj)){
            sum+=Number(obj);
        }
    }

    if(counts!=0){
        average=sum/counts;
    }
    return average;
};

MonitorPackageHandler.prototype.getClosestDistance=function(monitorPackageHandler,monitorPackage,beaconCount){
    var monitorPackageHandler=monitorPackageHandler;
    var result=[];
    var beaconCount=Number(beaconCount);
    if(beaconCount<2){beaconCount=2;}//默认最少两个beacon
    if(monitorPackage.length<0){console.log('该样本数据不符合条件，已排除');return result;}
    var beaconPKG=monitorPackage[0].beaconPKG;
    if(beaconPKG.length<beaconCount){console.log('该样本数据不符合条件，已排除');return result;};
    //按照acc的距离排序
    if(beaconPKG){
        beaconPKG.sort(function(a,b){
            return parseFloat(a.acc)-parseFloat(b.acc);
        });
    }

    for(var i=0;i<beaconCount;i++){
        result.push({beaconName:beaconPKG[i].minor,distance:beaconPKG[i].acc});
    }

    return result;
};

MonitorPackageHandler.prototype.convertDistanceToPoint=function(beaconArray,offset,monitorPackageHandler,originalData){
    var data=originalData;
    if(beaconArray.length!=2){
        return;
    }
    var firstBeaconIndex=beaconArray[0].beaconName;
    var pointX=beaconArray[0].distance+monitorPackageHandler.getBeaconDistance(firstBeaconIndex);
    if(pointX<0){
        console.log('当前点不合条件，已排除!');
        return;
    }
    var pointY;
    if(parseFloat(offset.x)===0){//Y轴有偏移
        pointY=offset.y;//X轴为横轴

    }else if(parseFloat(offset.y)===0){//X轴有偏移
        pointY=pointX;//X横轴转Y轴,此时Y轴为横轴,X轴有偏移量
        pointX=offset.x;
    }

    //换算成像素
    pointX=(pointX*100)/1.05;
    pointY=(pointY*100)/1.05;
    var pointObj={x:pointX,y:pointY,closestBeaconName:firstBeaconIndex};
    var location=[];
    location.push(pointObj);
    var timePoint=(new Date()).getTime();//点计算完成的时间戳
    var resultLocationData={deviceSerial:data.deviceSerial,deviceName:data.deviceName,location:location,timePoint:timePoint};
    console.log('当前点计算完成!');
    return resultLocationData;
};

MonitorPackageHandler.prototype.getDistanceBetweenBeacon=function(beaconIndex1,beaconIndex2){
    var beaconOneDistance=this.getBeaconDistance(beaconIndex1);
    var beaconTwoDistance=this.getAverageDistance(beaconIndex2);
    var betweenDistance=Math.abs(beaconOneDistance-beaconTwoDistance);
    return betweenDistance;
};

MonitorPackageHandler.prototype.getMinBeaconDistance=function(beaconArray){
    var min=0;
    if(beaconArray.length>=2){
        for(var index in beaconArray){
            var beaconObj=beaconArray[index];
            if(beaconObj.distance<min){
                min = beaconObj.distance;
            }
        }
    }
    return min;
};

MonitorPackageHandler.prototype.fixationPointGenerator=function(beaconArray,presetDistance,originalData){
    var data=originalData||{};
    var location=[];
    var resultLocationData=null;
    if(beaconArray.length>=2){
        var firstPointX=this.getMinBeaconDistance(beaconArray);
        var distanceBetweenBeacon=this.getDistanceBetweenBeacon(beaconArray[0],beaconArray[1]);
        var pointX=distanceBetweenBeacon/2+firstPointX;
        var pointY=presetDistance;
        location.push({x:pointX,y:pointY});
        resultLocationData={deviceSerial:data.deviceSerial,deviceName:data.deviceName,location:location};
    }

    return resultLocationData;
};

global.deviceStartTime=null;//全局变量 存储设备进入时间
global.currentLocation=[];//全局变量 存储当前的位置信息

MonitorPackageHandler.prototype.getMappingPoint=function(beaconArray,offset,monitorPackageHandler,originalData){
    var prefixString=this.prefixString;
    var mappingPointArray=this.beaconArray;
    var data=originalData||{};

    var resultLocationData=null;

    if(beaconArray.length>=2){
        var firstBeaconName=prefixString+beaconArray[0].beaconName;
        var pointArr=[];
        for(var point in mappingPointArray){
            if(point.indexOf(firstBeaconName)>-1){
                var pointObj={key:point,location:mappingPointArray[point]};
                pointArr.push(pointObj);
            }
        }

        var location=[];
        var remainTime=null;//停留时间

        //pointArr的长度应该为1或者2
        if(pointArr.length==1){
            location.push(pointArr[0].location);
        }
        else if(pointArr.length==2){//如果有两个点，再根据距离最近的第2个的信息来确定是哪个固定点
            var secondBeaconName=prefixString+beaconArray[1].beaconName;
            for(var point in pointArr){
                if(point.indexOf(secondBeaconName)>-1){
                    location.push(pointArr[point].location);
                }
            }

            //如果点的数据有误，则默认取第一个
            if(location.length==0){
                location.push(pointArr[0].location);
            }

         }

        var timePoint=(new Date()).getTime();//点计算完成的时间戳
        resultLocationData={deviceSerial:data.deviceSerial,deviceName:data.deviceName,location:location,timePoint:timePoint,remainTime:null};

        if(global.currentLocation.toString()!=''){
            if((global.currentLocation[0].x!=location[0].x)&&(global.currentLocation[0].y!=location[0].y)){
                remainTime=parseInt(timePoint-global.deviceStartTime);
                global.deviceStartTime=timePoint;//保存下个位置的起始时间信息
                global.currentLocation=location;
                resultLocationData.remainTime=remainTime;
            }
        }
        //保存不同位置信息和时间信息
        global.currentLocation=location;
        global.deviceStartTime=timePoint;
        console.log('当前点计算完成!');
    }else
    {
        console.log('当前点不合条件，已排除!');
    }

    return resultLocationData;
};

module.exports=MonitorPackageHandler;