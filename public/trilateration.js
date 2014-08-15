var width;
var height;
var boxesX = 20;
var boxesY = 20;
var vp;
var vpc;
var recHeight;
var recWidth;
var p1 = {x: 5, y: 3};
var p2 = {x: 15, y: 4};
var p3 = {x: 10, y: 18};
var punknown = {x: 10, y: 12};
function init(e) {
    vp = document.getElementById("viewport");
    vpc = vp.getContext("2d");
    width = vp.width;
    height = vp.height;
    recHeight = height / boxesY;
    recWidth = width / boxesX;
    for (var x = 0; x < width; x += recWidth) {
        for (var y = 0; y < height; y += recHeight) {
            vpc.strokeRect(x, y, recWidth, recHeight);
        }
    }
    p1.x = getRandom(1, boxesX / 2);
    p1.y = getRandom(1, boxesY / 2);
    drawOpaque(p1);
    $("refPt1").innerHTML = "X: " + p1.x + " Y: " + p1.y;
    p2.x = getRandom(boxesX / 2, boxesX);
    p2.y = getRandom(boxesY / 2, boxesY);
    drawOpaque(p2);
    $("refPt2").innerHTML = "X: " + p2.x + " Y: " + p2.y;
    p3.x = getRandom(1, boxesX);
    p3.y = getRandom(1, boxesY);
    drawOpaque(p3);
    $("refPt3").innerHTML = "X: " + p3.x + " Y: " + p3.y;
    punknown.x = getRandom(1, boxesX);
    punknown.y = getRandom(1, boxesY);
    $("refUnknown").innerHTML = "X: " + punknown.x + " Y: " + punknown.y;
    var distanceFromP1 = getEuclidean(punknown, p1);
    var distanceFromP2 = getEuclidean(punknown, p2);
    var distanceFromP3 = getEuclidean(punknown, p3);
    drawCircle(p1, distanceFromP1 * recHeight, "red");
    drawCircle(p2, distanceFromP2 * recHeight, "green");
    drawCircle(p3, distanceFromP3 * recHeight, "blue");
    debug("Distance from P1: " + distanceFromP1);
    debug("Distance from P2: " + distanceFromP2);
    debug("Distance from P3: " + distanceFromP3);
    var calculatedPos = getTrilateration(p1, p2, p3, distanceFromP1, distanceFromP2, distanceFromP3);
    debug("Found position: X: " + calculatedPos.x + " Y: " + calculatedPos.y);
    vpc.fillStyle = "red";
    drawOpaque(calculatedPos);
    //Event.observe(vp, "click", vpClick);
    //Event.observe(vp, "mousemove", vpMove);
}
function vpClick(e) {
    var mousePos = getMouseOffsetPos(e, vp);
    var gridPos = getGridPos(mousePos);
    $("clickX").innerHTML = gridPos.x;
    $("clickY").innerHTML = gridPos.y;
    drawOpaque(gridPos);
}
function vpMove(e) {
    var mousePos = getMouseOffsetPos(e, vp);
    var gridPos = getGridPos(mousePos);
    $("mouseX").innerHTML = mousePos.x;
    $("mouseY").innerHTML = mousePos.y;
    $("gridX").innerHTML = gridPos.x;
    $("gridY").innerHTML = gridPos.y;
}
function getMouseOffsetPos(pointerEvent, elPos) {
    var offset = Position.cumulativeOffset(elPos);
    var x = Event.pointerX(pointerEvent);
    var y = Event.pointerY(pointerEvent);
    x -= offset.left;
    y -= offset.top;
    var mouseOffsetPos = {};
    mouseOffsetPos.x = x;
    mouseOffsetPos.y = y;
    return mouseOffsetPos;
}
function getGridPos(position) {
    var xBoxOffset = position.x / recWidth;
    var yBoxOffset = position.y / recHeight;
    xBoxOffset = Math.ceil(xBoxOffset);
    yBoxOffset = Math.ceil(yBoxOffset);
    var gridPosition = {};
    gridPosition.x = xBoxOffset;
    gridPosition.y = yBoxOffset
    return gridPosition;
}
function getBoxActualPos(position) {
    var actX = (--position.x) * recWidth;
    var actY = (--position.y) * recHeight;
    var actPos = {};
    actPos.x = actX;
    actPos.y = actY;
    return actPos;
}
function drawOpaque(position) {
    var boxActPos = getBoxActualPos(position);
    vpc.fillRect(boxActPos.x, boxActPos.y, recWidth, recHeight);
}
function drawStroke(position) {
    var boxActPos = getBoxActualPos(position);
    vpc.strokeRect(boxActPos.x, boxActPos.y, recWidth, recHeight);
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
function getRandom(offset, max) {
    var rand = Math.random();
    var diff = max - offset;
    diff *= rand;
    var res = diff + offset;
    return Math.ceil(Math.floor(res), offset);
}
function getEuclidean(position1, position2) {
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
    return position;
}
function debug(message) {
    $("freeflowdebug").innerHTML = message + "<br />" + $("freeflowdebug").innerHTML;
}
/**
 * Created by wang on 2014/8/15.
 */
