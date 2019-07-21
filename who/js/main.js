console.log("main init.")
// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 1080;
canvas.height = 1920;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};

bgImage.src = "images/whobg.png";

var w=window;
requestAnimationFrame=w.requestAnimationFrame||w.webkitRequestAnimationFrame||w.msRequestAnimationFrame||w.mozRequestAnimationFrame;


var updateTimes=0;
var curDelta=0;
var update=function(modifier)
{
    curDelta=modifier;
    updateTimes++;
}

var renderTimes=0;
var render=function()
{
    renderTimes++;
    if(bgReady)
    {
        ctx.drawImage(bgImage,0,0,1080,1920)
    }

    // debug info
	ctx.fillStyle = "rgb(255, 0, 0)";
	ctx.font = "9px Helvetica";
	ctx.textAlign = "left";
    ctx.textBaseline = "top";
    
    debugInfo="renderTimes:"+ renderTimes+" updateTimes:"+updateTimes+" r-u:"+(renderTimes-updateTimes)+" curDelta:"+curDelta*1000+" ms"
	ctx.fillText(debugInfo, 10, 10);

}

var main=function()
{
    var now=Date.now();
    var delta=now-then;
    update(delta/1000);
    render();
    then=now;
    requestAnimationFrame(main);

}

var reset=function()
{
    console.log("reset..");
}

var then=Date.now();
reset();
main();