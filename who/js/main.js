//init data
weights = [
    { x: 337.0, y: 2526.0, ke: 4080, weight: "4.080kg", addtime: "20191026", tooktime: "20180522", note: "非常顺利顺产的哟！妈妈超厉害！" },
    { x: 349.0, y: 2552.14, ke: 3800, weight: "3.80kg", addtime: "20191026", tooktime: "20180529", note: "一周后落剽啦" },
    { x: 1467.17, y: 1768.84, ke: 10400, weight: "10.4kg", addtime: "20191026", tooktime: "20191023", note: "穿着鞋子称有21斤了" },
]
lengths = [
    { x: 1470, y: 729.00, cm: 82, addtime: "20191026", tooktime: "20191026", note: "小靖好帅" }
]
//init some globals
var w = window;

console.log("main init.")
// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
    console.log("image loaded.")
    bgReady = true;
};
bgImage.src = "images/whobg.png";

//init mouse
w.mousePos = { x: 0, y: 0 }
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

canvas.addEventListener('mousemove', function (evt) {
    w.mousePos = getMousePos(canvas, evt);
}, false);




//for diffrience browser
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

//update func
var updateTimes = 0;
var curDelta = 0;
var update = function (modifier) {
    curDelta = modifier;
    updateTimes++;
}

function CalcDistance(p1, p2) {
    var dx = Math.abs(p2.x - p1.x);
    var dy = Math.abs(p2.y - p1.y);
    return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
}

function drawInfoAround(dot) {
    var r = 50
    var l = 15
    ctx.strokeStyle = "red";
    ctx.lineWidth = 4
    ctx.beginPath();
    var ex = dot.dot.x
    var ey = dot.dot.y
    ctx.moveTo(ex - r / 2 + l, ey - r / 2)
    ctx.lineTo(ex - r / 2, ey - r / 2)
    ctx.lineTo(ex - r / 2, ey - r / 2 + l)

    ctx.moveTo(ex + r / 2, ey + r / 2 - l)
    ctx.lineTo(ex + r / 2, ey + r / 2)
    ctx.lineTo(ex + r / 2 - l, ey + r / 2)

    ctx.moveTo(ex + r / 2 - l, ey - r / 2)
    ctx.lineTo(ex + r / 2, ey - r / 2)
    ctx.lineTo(ex + r / 2, ey - r / 2 + l)

    ctx.moveTo(ex - r / 2, ey + r / 2 - l)
    ctx.lineTo(ex - r / 2, ey + r / 2)
    ctx.lineTo(ex - r / 2 + l, ey + r / 2)

    ctx.stroke();
}

//drawInfo
function drawInfo() {
    //check if mouse position is close to a dot enough
    var min_close_dist = 50;
    //get all  distance for each dot
    var dists = [];
    //weight
    for (var i = 0; i < weights.length; i++) {
        dists.push({ dist: CalcDistance(w.mousePos, weights[i]), dot: weights[i] });
    }
    //length
    for (var i = 0; i < lengths.length; i++) {
        dists.push({ dist: CalcDistance(w.mousePos, lengths[i]), dot: lengths[i] });
    }

    //get min dists
    min_dist = dists[0];
    for (var i = 1; i < dists.length; i++) {
        if (min_dist.dist > dists[i].dist) {
            min_dist = dists[i]
        }
    }

    //draw the info around the min dist dot
    if (min_dist.dist < min_close_dist) {
        drawInfoAround(min_dist)
    }

}
//drawDot
function drawDot(pos, r, color) {
    ctx.fillStyle = color;
    ctx.fillRect(pos.x - r / 2, pos.y - r / 2, r, r);
}
function mousePosInfo() {

    var infoPos={x:w.mousePos.x + 30, y:w.mousePos.y + 30}
    ctx.fillStyle = "#535353cc";
    var margin=10
    ctx.fillRect(infoPos.x-margin,infoPos.y-margin,280,50);
    ctx.fillStyle = "#00ff00ff";
    ctx.font = "32px Helvetica";
    ctx.fillText("x:" + (w.mousePos.x / scale).toFixed(2) + ",y:" + (w.mousePos.y / scale).toFixed(2), infoPos.x,infoPos.y)

}
function outputDbgInfo() {

    ctx.fillStyle = "green";
    ctx.font = "12px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    debugInfo = "renderTimes:" + renderTimes + " updateTimes:" + updateTimes + " r-u:" + (renderTimes - updateTimes) + " curDelta:" + curDelta * 1000 + " ms"
    ctx.fillText(debugInfo, 10, 10);
}
function drawCross() {
    ctx.strokeStyle = "green";
    ctx.lineWidth = 1.5
    ctx.beginPath();
    ctx.moveTo(w.mousePos.x, 0)
    ctx.lineTo(w.mousePos.x, canvas.height)
    ctx.moveTo(0, w.mousePos.y)
    ctx.lineTo(canvas.width, w.mousePos.y)
    ctx.stroke();
}
function drawBG()
{
    //bk color
    ctx.fillStyle = '#000000ff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
   
    //bk image
    if (bgReady) //ensure the image has been loaded
    {
        scaleWidth = scale * bgImage.width
        scaleHeight = scale * bgImage.height
        ctx.drawImage(bgImage, 0, 0, scaleWidth, scaleHeight)
    }
}
function drawTagDot()
{
    //weight
    for (var i = 0; i < weights.length; i++) {
        drawDot(weights[i], 8, "red");
    }
    //length
    for (var i = 0; i < lengths.length; i++) {
        drawDot(lengths[i], 8, "red");
    }
}
//render func

//scale
// scale = hh / bgImage.height
var scale = 1

var renderTimes = 0;
var render = function () {
    renderTimes++;

    canvas.width = w.innerWidth - 10;
    canvas.height = w.innerHeight - 20;
    

    drawBG();
    outputDbgInfo();
    mousePosInfo();
    drawCross();
    drawTagDot();
    //draw info if near a dot
    drawInfo();

}

//main loop func
var main = function () {
    var now = Date.now();
    var delta = now - then;
    update(delta / 1000);
    render();
    then = now;

    //use requestAnimationFrame to loop main
    requestAnimationFrame(main);

}

//reset fun
var reset = function () {
    console.log("reset..");
}

//go
var then = Date.now();
reset();
main();