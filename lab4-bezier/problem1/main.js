var canvas1, context1, controlPoints, myTransformation, style, styleForBezierCurve, drag = null, draggedPoint;
let numberOfPointsToCompute = 10;

controlPoints = [{ x:100, y:300 },{ x:200, y:300 },{ x:300, y:300 },{ x:400, y:300 }];

function init() {

    myTransformation = function(p){return p}; //Identity transform

    style = {
        curve:	{ width: 3, color: "#E6B3B3" },
        line:	{ width: 1, color: "#C00" },
        point: { radius: 10, width: 2, color: "#900", fill: "rgba(200,200,200,0.5)", arc1: 0, arc2: 2 * Math.PI }
    };

    styleForBezierCurve = {
        curve:	{ width: 3, color: "#6a65e6" },
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

    // Curve through controlPoints and vertices
    drawCurve(context1, style, controlPoints); // Draw curve
    drawVertices(context1, style, controlPoints); // Draw vertices as circles
    drawCurveConnectingPoints(context1, styleForBezierCurve, computeBezierCurve(numberOfPointsToCompute, controlPoints));


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

// Draws a polygonal curve connecting the controlPoints, after applying the given transformation
function drawCurve(ctx, style, controlPoints, transformation) {
    // The transformation is optional. If none provided, use identity transform
    if (transformation===undefined) {
        transformation = function(p){return p}; //Identity transform
    }

    // Draw curve
    ctx.lineWidth = style.curve.width;
    ctx.strokeStyle = style.curve.color;
    ctx.beginPath();
    var firstPoint = transformation(controlPoints[0]);
    var currentPoint;
    ctx.moveTo(firstPoint.x, firstPoint.y);
    for (var i = 0; i < controlPoints.length; i++) {
        currentPoint =  transformation(controlPoints[i]);
        ctx.lineTo(currentPoint.x, currentPoint.y);
        ctx.moveTo(currentPoint.x, currentPoint.y);
    }
    ctx.stroke();
}

// Draw circles around vertices to facilitate drag and drop
function drawVertices (ctx, style, controlPoints) {
    for (var i = 0; i < controlPoints.length; i++) {
        var p = controlPoints[i];
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
    for (var i=0; i<controlPoints.length;i++) {
        dx = controlPoints[i].x - e.x;
        dy = controlPoints[i].y - e.y;
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
        controlPoints[drag].x += e.x - draggedPoint.x;
        controlPoints[drag].y += e.y - draggedPoint.y;
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
