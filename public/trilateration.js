var width,height;//存放画布大小
var boxesX = 20,boxesY = 20;//横向20个，纵向20个
var vp;
var vpc;//画布
var recHeight;//纵向每个格子的宽度
var recWidth;//横向每个格子的宽度
var p1 = {x: 5, y: 3};
var p2 = {x: 15, y: 4};
var p3 = {x: 10, y: 18};
var punknown = {x: 10, y: 12};
var resArr=[];

function init(e) {
    vp = document.getElementById("viewport");
    vpc = vp.getContext("2d");
    width = vp.width;
    height = vp.height;
    recHeight = height / boxesY;
    recWidth = width / boxesX;
	console.log('recWH ',recHeight,recWidth);// 24 32 
	
    for (var x = 0; x < width; x += recWidth) {//24 32...横向20，纵向20.。。。。每个格子大小
        for (var y = 0; y < height; y += recHeight) {
            vpc.strokeRect(x, y, recWidth, recHeight);//画矩形
        }
    }//画格子
	
    p1.x = getRandom(1, boxesX / 2);
    p1.y = getRandom(1, boxesY / 2);//随机产生的xy 在
    drawOpaque(p1);
    $("#refPt1").html( "X: " + p1.x + " Y: " + p1.y);
	
    p2.x = getRandom(boxesX / 2, boxesX);
    p2.y = getRandom(boxesY / 2, boxesY);
    drawOpaque(p2);
    $("#refPt2").html( "X: " + p2.x + " Y: " + p2.y);
	
    p3.x = getRandom(1, boxesX);
    p3.y = getRandom(1, boxesY);
    drawOpaque(p3);
    $("#refPt3").html("X: " + p3.x + " Y: " + p3.y);
	
    punknown.x = getRandom(1, boxesX);
    punknown.y = getRandom(1, boxesY);
    $("#refUnknown").html ("X: " + punknown.x + " Y: " + punknown.y);
	
	/**已知refUnknown为最终要求的点。和它距离每个圆半径的距离。。然后根据每个圆的坐标和距离，求这个已知的refUnknown（去验证它）**/
	/**
	用一个已知的第4点坐标 punknown。。去计算距离p1 p2 p3之间的距离。。然后反过来用p1 p2 p3坐标 disP1 disP2 disP3求求第四点。
	
	**/
	
    var distanceFromP1 = getEuclidean(punknown, p1);
    var distanceFromP2 = getEuclidean(punknown, p2);
    var distanceFromP3 = getEuclidean(punknown, p3);
	
    drawCircle(p1, distanceFromP1 * recHeight, "red");//距离*每个格子的高度。。eg：距离3个格子的高度
    drawCircle(p2, distanceFromP2 * recHeight, "green");
    drawCircle(p3, distanceFromP3 * recHeight, "blue");
    
	debug("Distance from P1: " + distanceFromP1);//相当于提示信息
    debug("Distance from P2: " + distanceFromP2);
    debug("Distance from P3: " + distanceFromP3);
    
	var calculatedPos = getTrilateration(p1, p2, p3, distanceFromP1, distanceFromP2, distanceFromP3);
    debug("Found position: X: " + calculatedPos.x + " Y: " + calculatedPos.y);
    vpc.fillStyle = "#ff7300";
    drawOpaque(calculatedPos);
}



function getBoxActualPos(position) {
    var actX = (--position.x) * recWidth;
    var actY = (--position.y) * recHeight;
    var actPos = {};
    actPos.x = actX;
    actPos.y = actY;
	console.log('actPos',actPos)
    return actPos;
}
function drawOpaque(position) {
    var boxActPos = getBoxActualPos(position);
    vpc.fillRect(boxActPos.x, boxActPos.y, recWidth, recHeight);
}

function drawCircle(position, radius, color) {
    var boxActPos = getBoxActualPos(position);
    vpc.strokeStyle = color;
    vpc.lineWidth = 6;
    vpc.beginPath();
    vpc.arc(boxActPos.x + 40, boxActPos.y + 30, radius, 0, 2 * Math.PI, false);
    vpc.stroke();
    vpc.closePath();
}
function getRandom(offset, max) {//1 10
    console.log('start')
    var rand = Math.random();
	console.log('rand',rand)
    var diff = max - offset;//9
	console.log('diff',diff)
    diff *= rand;//0-9
	console.log('diff2',diff)
    var res = diff + offset;
	console.log('res',res,'fan:',Math.ceil(Math.floor(res), offset))
	 console.log('end')
    return Math.ceil(Math.floor(res), offset);
}
function getEuclidean(position1, position2) {//a平方+b平方=c平方
    return Math.sqrt(Math.pow(position2.x - position1.x, 2) + Math.pow(position2.y - position1.y, 2));
}
function getTrilateration(position1, position2, position3, distToPos1, distToPos2, distToPos3) {
	
    var xa = position1.x;
    var ya = position1.y
    var xb = position2.x;
    var yb = position2.y;
    var xc = position3.x;
    var yc = position3.y;
    var ra = distToPos1;
    var rb = distToPos2;
    var rc = distToPos3;
    S = (Math.pow(xc, 2.) - Math.pow(xb, 2.) + Math.pow(yc, 2.) - Math.pow(yb, 2.) + Math.pow(rb, 2.) - Math.pow(rc, 2.)) / 2.0;
    T = (Math.pow(xa, 2.) - Math.pow(xb, 2.) + Math.pow(ya, 2.) - Math.pow(yb, 2.) + Math.pow(rb, 2.) - Math.pow(ra, 2.)) / 2.0;
    y = ((T * (xb - xc)) - (S * (xb - xa))) / (((ya - yb) * (xb - xc)) - ((yc - yb) * (xb - xa)));
    x = ((y * (ya - yb)) - T) / (xb - xa);
    var position = {x: 0, y: 0, z: 0};
    position.x = x;
    position.y = y;
	console.log('com:',position1, position2, position3, distToPos1, distToPos2, distToPos3,position)
	resArr.push({p1:position1, p2:position2, p3:position3,dtp1:distToPos1,dtp2: distToPos2, dt3:distToPos3,res:position});
	console.log('resArr:',resArr)
    return position;
}

function debug(message) {
    $("#freeflowdebug").html('<p style="margin-bottom:10px;background:#ff7300">'+message + "<br />" + $("#freeflowdebug").html()+'</p>');
}


