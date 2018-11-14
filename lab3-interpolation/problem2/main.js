/*
* Part of this code is based on:
    * http://blogs.sitepoint.com/html5-canvas-draw-quadratic-curves/
    * http://blogs.sitepoint.com/html5-canvas-draw-bezier-curves/
*/

var canvas1, context1, myTransformation, style, styleForInterpolatedCurve, styleForRealCurve;
let numberOfPointsToCompute= 100;


function init() {

    myTransformation = function(p){return p}; //Identity transform

    style = {
        point: { radius: 2, width: 2, color: "0", fill: "rgba(0,0,200,0.5)", arc1: 0, arc2: 2 * Math.PI }
    };

    styleForInterpolatedCurve = {
        curve:	{ width: 3, color: "#E6B3B3" },
    };

    styleForRealCurve = {
        curve:	{ width: 3, color: "#6680B3" },
    };

    // line style defaults
    context1.lineCap = "round";
    context1.lineJoin = "round";

    context1.translate(canvas1.width/2,canvas1.height/2);
    drawCanvas();
}


/**
 Basic drawing methods
 **/


function sampleFunction(x){
    return 50 / (1 + 25 * x*x)
}

// draw canvas
function drawCanvas() {
    // Clear everything
    context1.clearRect(0, 0, canvas1.width, canvas1.height);  // Clear canvas

    // Background grids
    drawGrid(context1,canvas1.width, canvas1.height); // Draw background grid
    let numberOfPoints = parseInt(document.getElementById('valueOfN').value) || 0;
    let controlPoints = [];
    for (let i=0; i<numberOfPoints + 1; i++){
        let x = 2 * i / numberOfPoints - 1;
        let y = sampleFunction(x);
        controlPoints.push({x: x, y:y});
    }

    drawVertices(context1, style, controlPoints); // Draw vertices as circles

    let realPoints = [];
    for(let i=0; i<= numberOfPointsToCompute; i++){
        let x = 2 * i / numberOfPointsToCompute - 1;
        realPoints.push({x: x, y: sampleFunction(x)})
    }

    drawCurveConnectingPoints(context1, styleForRealCurve, realPoints);
    drawCurveConnectingPoints(context1, styleForInterpolatedCurve,
        // computeInterpolationCurveWithTValuesProportionalToDistance(numberOfPointsToCompute, controlPoints));
        computeInterpolationCurveWithUniformTValues(numberOfPointsToCompute, controlPoints));
}


// Draw a background grid
function drawGrid(myContext,bw,bh){
    var delta = 50; // grid cell size

    for (var x = -bw/2; x <= bw/2; x += delta) {
        myContext.moveTo(x, -bh/2);
        myContext.lineTo(x, bh/2);
    }

    for (var y = -bh/2; y <= bh/2; y += delta) {
        myContext.moveTo(- bw/2, y);
        myContext.lineTo(bw/2, y);
    }

    myContext.lineWidth = 1;
    myContext.strokeStyle = "lightgray";
    myContext.stroke();

    myContext.strokeStyle = "black";
    myContext.font = "12px Arial";
    myContext.fillText("(0,0)",2,12);

}

function drawCurveConnectingPoints(ctx, style, points){
    ctx.lineWidth = style.curve.width;
    ctx.strokeStyle = style.curve.color;
    ctx.beginPath();
    let firstPoint = points[0];
    let currentPoint;
    ctx.moveTo(firstPoint.x * 200, firstPoint.y * 4);
    for (let i = 0; i < points.length; i+=1) {
        currentPoint = points[i];
        ctx.lineTo(currentPoint.x * 200, currentPoint.y * 4);
        ctx.moveTo(currentPoint.x * 200, currentPoint.y * 4);
    }
    ctx.stroke();
}


// Draw circles around vertices to facilitate drag and drop
function drawVertices (ctx, style, points) {
    for (var i = 0; i < points.length; i++) {
        var p = points[i];
        ctx.lineWidth = style.point.width;
        ctx.strokeStyle = style.point.color;
        ctx.fillStyle = style.point.fill;
        ctx.beginPath();
        ctx.arc(p.x * 200, p.y * 4, style.point.radius, style.point.arc1, style.point.arc2, true);
        ctx.fill();
        ctx.stroke();
    }
}


// Assign canvas and context variables
canvas1 = document.getElementById("canvas1");
context1 = canvas1.getContext("2d");

init();


