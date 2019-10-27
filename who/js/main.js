//init data
brithday="20180522"
weights = [
    { x: 337.0, y: 2526.0, ke: 4080, weight: "4.080", addtime: "20191026", tooktime: "20180522", note: "非常顺利顺产的哟！妈妈超级厉害！" },
    { x: 349.0, y: 2552.14, ke: 3800, weight: "3.80", addtime: "20191026", tooktime: "20180529", note: "一周后落剽了" },
    { x: 1467.17, y: 1768.84, ke: 10400, weight: "10.4", addtime: "20191026", tooktime: "20191023", note: "穿着鞋子称有21斤了" },
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
        dists.push({ dist: CalcDistance(w.mousePos, imgbox.toBoxPos(weights[i])), dot: imgbox.toBoxPos(weights[i]) });
    }
    //length
    for (var i = 0; i < lengths.length; i++) {
        dists.push({ dist: CalcDistance(w.mousePos, imgbox.toBoxPos(lengths[i])), dot: imgbox.toBoxPos(lengths[i]) });
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
    ctx.fillRect(pos.x+imgbox.x - r / 2, pos.y+imgbox.y - r / 2, r, r);
}
function mousePosInfo() {

    var infoPos={x:w.mousePos.x + 30, y:w.mousePos.y + 30}
    ctx.fillStyle = "#535353cc";
    var margin=10
    ctx.fillRect(infoPos.x-margin,infoPos.y-margin,280,100);
    ctx.fillStyle = "#00ff00ff";
    ctx.font = "32px Helvetica";

    var weiP={x:(w.mousePos.x-imgbox.x) / scale,y:(w.mousePos.y-imgbox.y) / scale}
    weiP=weightbox.toWeightBoxPos(weiP)
    ctx.fillText("x:" + ((w.mousePos.x-imgbox.x) / scale).toFixed(0) + ",y:" + ((w.mousePos.y-imgbox.y) / scale).toFixed(0), infoPos.x,infoPos.y)
    ctx.fillText("" + weiP.x.toFixed(2)+ " m," +weiP.y.toFixed(2)+" kg", infoPos.x,infoPos.y+40)

}
function outputDbgInfo() {

    ctx.fillStyle = "white";
    ctx.font = "32px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    debugInfo = "renderTimes:" + renderTimes + " updateTimes:" + updateTimes + " r-u:" + (renderTimes - updateTimes) + " curDelta:" + curDelta * 1000 + " ms"
    ctx.fillText(debugInfo, 10, 10);
}
function drawCross() {
    ctx.strokeStyle = "#00ff00ff";
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
        ctx.drawImage(bgImage, imgbox.x, imgbox.y, scaleWidth, scaleHeight)
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

//imgbox to control the position draw start
var imgbox={
    x:0,
    y:0,
    beGrag:false,
    drag:{x:0,y:0},
    toBoxPos:function(pos)
    {
        return {
            x:pos.x+imgbox.x,
            y:pos.y+imgbox.y
        }
    }
}

//weightbox for coordinate mapping
var weightbox={
    weightPoint1:{x:0,y:1.4},
    imagePoint1:{x:336,y:2852},

    weightPoint2:{x:3.0,y:3.0},
    imagePoint2:{x:536,y:2653},

    weightPointOriginBase:{x:0,y:0},

    toWeightBoxPos:function(ipos)
    {
        var wx=Math.abs(this.weightPoint1.x-this.weightPoint2.x);
        var ix=Math.abs(this.imagePoint1.x-this.imagePoint2.x);

        var wy=Math.abs(this.weightPoint1.y-this.weightPoint2.y);
        var iy=Math.abs(this.imagePoint1.y-this.imagePoint2.y);
        var wiscale={ x:wx/ix, y:wy/iy}
        this.weightPointOriginBase.x=this.imagePoint1.x-this.weightPoint1.x/wiscale.x;
        this.weightPointOriginBase.y=this.imagePoint1.y+this.weightPoint1.y/wiscale.y;
        return {
            x:(ipos.x-this.weightPointOriginBase.x)*wiscale.x,
            y:(ipos.y-this.weightPointOriginBase.y)*wiscale.y*-1 //-1 for reverse y
        }
    }
}

//lenghtBox for coordinate mapping
var lenghtbox={
    lenghtPoint1:{},
    imagePoint1:{},
    lenghtPoint2:{},
    imagePoint2:{},
}
canvas.addEventListener('mousemove', function (evt) {
    w.mousePos = getMousePos(canvas, evt);
    if(imgbox.beGrag)
    {
        imgbox.x=evt.clientX+imgbox.drag.x;
        imgbox.y=evt.clientY+imgbox.drag.y;
    }
}, false);


//mousedown and mouseup to detecte the drag
window.addEventListener("mousedown",function(evt)
{
    imgbox.beGrag=true;
    imgbox.drag.x=imgbox.x-mousePos.x;
    imgbox.drag.y=imgbox.y-mousePos.y;
    console.log("mousedown:"+evt);
});
window.addEventListener("mouseup",function(evt)
{
    imgbox.beGrag=false;
    console.log("mouseup:"+evt);
});

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