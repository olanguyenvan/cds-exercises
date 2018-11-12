
/*
* Part of this code is based on:
    * http://blogs.sitepoint.com/html5-canvas-draw-quadratic-curves/
    * http://blogs.sitepoint.com/html5-canvas-draw-bezier-curves/
*/

var canvas1, context1, points, myTransformation, style, drag = null, draggedPoint;
let numberOfPointsToCompute= 100;

points = [{ x:300, y:300 },{ x:200, y:200 },{ x:400, y:300 },{ x:500, y:300 }];

function init() {

    myTransformation = function(p){return p}; //Identity transform

    // default styles
    style = {
        curve:	{ width: 3, color: "#E6B3B3" },
        line:	{ width: 1, color: "#C00" },
        point: { radius: 5, width: 2, color: "#900", fill: "rgba(200,200,200,0.5)", arc1: 0, arc2: 2 * Math.PI }
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


    let point0x = parseFloat(document.getElementById('point0x').value) || 200;
    let point0y = parseFloat(document.getElementById('point0y').value) || 200;

    let point1x = parseFloat(document.getElementById('point1x').value) || 400;
    let point1y = parseFloat(document.getElementById('point1y').value) || 300;

    let tangentAtPoint0x = parseFloat(document.getElementById('tangentAtPoint0x').value) || 100;
    let tangentAtPoint0y = parseFloat(document.getElementById('tangentAtPoint0y').value) || 100;

    let tangentAtPoint1x = parseFloat(document.getElementById('tangentAtPoint1x').value) || 100;
    let tangentAtPoint1y = parseFloat(document.getElementById('tangentAtPoint1y').value) || 0;

    let point0 = {x: point0x, y: point0y};
    let point1 = {x: point1x, y: point1y};
    let tangentAtPoint0 = {x: tangentAtPoint0x, y: tangentAtPoint0y};
    let tangentAtPoint1 = {x: tangentAtPoint1x, y: tangentAtPoint1y};

    drawVertices(context1, style, [point0, point1]); // Draw vertices as circles

    drawCurveConnectingPoints(context1, style,
        computeCubicHermiteInterpolationCurveFor2Points(
            numberOfPointsToCompute, point0, point1, tangentAtPoint0, tangentAtPoint1));

    let markValueForHalfwayT = document.getElementById('markValueForHalfwayT').checked;
    if (markValueForHalfwayT){
        let pointInTheMiddleT = cubicHermiteInterpolationPoint(0.5, point0, point1, tangentAtPoint0, tangentAtPoint1);
        drawVertices(context1, style, [pointInTheMiddleT])
    }
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

    myContext.fillStyle = "black";
    myContext.font = "12px Arial";
    myContext.fillText("(0,0)",2,12);

}


function drawCurveConnectingPoints(ctx, style, points){
    ctx.lineWidth = style.curve.width;
    ctx.strokeStyle = style.curve.color;
    ctx.beginPath();
    let firstPoint = points[0];
    let currentPoint;
    ctx.moveTo(firstPoint.x, firstPoint.y);
    for (let i = 0; i < points.length; i+=1) {
        currentPoint = points[i];
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

/**
 * Start ("main method")
 */

// Assign canvas and context variables
canvas1 = document.getElementById("canvas1");
context1 = canvas1.getContext("2d");

init();

/**
 * Auxiliary functions
 */


