
/*
* Part of this code is based on:
    * http://blogs.sitepoint.com/html5-canvas-draw-quadratic-curves/
    * http://blogs.sitepoint.com/html5-canvas-draw-bezier-curves/
*/

var canvas1, context1, points, myTransformation, style, styleForUniformCurve, styleForDistanceProportionalCurve, drag = null, draggedPoint;
let numberOfComputedPoints = 100;
points = [{ x:100, y:100 },{ x:200, y:300 },{ x:350, y:200 }, { x:600, y:350 }];

function init() {

    myTransformation = function(p){return p}; //Identity transform

    // default styles
    style = {
        curve:	{ width: 2, color: "#333" },
        line:	{ width: 1, color: "#C00" },
        point: { radius: 7, width: 1, color: "#900", fill: "rgba(200,200,200,0.5)", arc1: 0, arc2: 2 * Math.PI }
    };

    styleForUniformCurve = {
        curve:	{ width: 3, color: "#E6B3B3" },
    };

    styleForDistanceProportionalCurve = {
        curve:	{ width: 3, color: "#6680B3" },
    };

    // line style defaults
    context1.lineCap = "round";
    context1.lineJoin = "round";

    // event handlers (only canvas1)
    canvas1.onmousedown = dragStart;
    canvas1.onmousemove = dragging;
    canvas1.onmouseup = canvas1.onmouseout = dragEnd;

    drawCanvas();
}


/**
 Basic drawing methods
 **/


// draw canvas
function drawCanvas() {
    // Clear everything
    context1.clearRect(0, 0, canvas1.width, canvas1.height);  // Clear canvas

    // Background grids
    drawGrid(context1,canvas1.width, canvas1.height); // Draw background grid

    // Curve through points and vertices
    drawVertices(context1, style, points); // Draw vertices as circles


    // uniForm t Values
    let numberOfControlPoints = points.length;
    let tInterval = 1 / (numberOfControlPoints- 1);
    let tValuesUniform = [...Array(numberOfControlPoints).keys()].map(x => x * tInterval);
    drawInterpolationCurve(context1, styleForUniformCurve, points, tValuesUniform)

    // t Values proportional to the distance between points
    function distanceBetweenPoints(point1, point2){
        return Math.sqrt(point1.x * point2.x + point1.y * point2.y)
    }
    let tValuesProportionallytoTheDistance = [0];
    for (let i = 1; i < numberOfControlPoints; i++){
        tValuesProportionallytoTheDistance.push(distanceBetweenPoints(points[i-1], points[i]))
    }

    let sumOfDistances = tValuesProportionallytoTheDistance.reduce((a, b) => a +b);
    let sumOfDistancesSoFar = 0;

    for(let i = 1; i < numberOfControlPoints; i++){
        sumOfDistancesSoFar += tValuesProportionallytoTheDistance[i];
        tValuesProportionallytoTheDistance[i] = sumOfDistancesSoFar/sumOfDistances
    }
    drawInterpolationCurve(context1, styleForDistanceProportionalCurve, points, tValuesProportionallytoTheDistance)

}


// Draw a background grid
function drawGrid(myContext,bw,bh){
    var delta = 50; // grid cell size

    for (var x = 0; x <= bw; x += delta) {
        myContext.moveTo(x, 0);
        myContext.lineTo(x, bh);
    }

    for (var y = 0; y <= bh; y += delta) {
        myContext.moveTo(0, y);
        myContext.lineTo(bw , y);
    }

    myContext.lineWidth = 1;
    myContext.strokeStyle = "lightgray";
    myContext.stroke();

    myContext.strokeStyle = "black";
    myContext.font = "12px Arial";
    myContext.fillText("(0,0)",2,12);

}



function interpolatePoint(t, controlPoints, tValues){
    let numberOfControlPoints = controlPoints.length;

    let s = {x: 0, y: 0};
    for( let i=0; i < numberOfControlPoints; i++){
        let controlPoint = controlPoints[i];
        let enumerator = 1;
        let denominator = 1;

        for( let j=0; j < numberOfControlPoints; j++) {
            if (j !== i){
                enumerator *= t - tValues[j];
                denominator *= tValues[i] - tValues[j];
            }
        }
        let fraction = enumerator/denominator;
        s.x += fraction * controlPoint.x;
        s.y += fraction * controlPoint.y;
        // console.log(s)
    }
    return s
}


function drawInterpolationCurve(ctx, style, controlPoints, tValues) {

    ctx.lineWidth = style.curve.width;
    ctx.strokeStyle = style.curve.color;
    ctx.beginPath();
    var firstPoint = points[0];
    var currentPoint;
    ctx.moveTo(firstPoint.x, firstPoint.y);

    for (let i = 1; i <= numberOfComputedPoints; i+=1) {
        let t = i/numberOfComputedPoints;
        currentPoint = interpolatePoint(t, controlPoints, tValues);
        ctx.lineTo(currentPoint.x, currentPoint.y);
        ctx.moveTo(currentPoint.x, currentPoint.y);
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
        ctx.arc(p.x, p.y, style.point.radius, style.point.arc1, style.point.arc2, true);
        ctx.fill();
        ctx.stroke();
    }
}

/**
 Methods to allow dragging transformedPoints around
 **/

// start dragging
function dragStart(e) {
    e = mousePos(e);
    var dx, dy;
    for (var i=0; i<points.length;i++) {
        dx = points[i].x - e.x;
        dy = points[i].y - e.y;
        if ((dx * dx) + (dy * dy) < style.point.radius * style.point.radius) {
            drag = i;
            draggedPoint = e;
            canvas1.style.cursor = "move";
            return;
        }
    }
}

// dragging
function dragging(e) {
    if (drag!=null) {
        e = mousePos(e);
        points[drag].x += e.x - draggedPoint.x;
        points[drag].y += e.y - draggedPoint.y;
        draggedPoint = e;
        drawCanvas();
    }
}

// end dragging
function dragEnd(e) {
    drag = null;
    canvas1.style.cursor = "default";
    drawCanvas();
}

// event parser
function mousePos(event) {
    event = (event ? event : window.event);
    return {
        x: event.pageX - canvas1.offsetLeft,
        y: event.pageY - canvas1.offsetTop
    }
}

// Assign canvas and context variables
canvas1 = document.getElementById("canvas1");
context1 = canvas1.getContext("2d");

init();

/**
 * Auxiliary functions
 */


