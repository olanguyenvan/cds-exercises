


var canvas1, context1, points, style, drag = null, draggedPoint;

points = [{ x:0, y:0 }];

function init() {

    style = {
        curve:	{ width: 3, color: "#333" },
        line:	{ width: 1, color: "#C00" },
        point: { radius: 10, width: 2, color: "#900", fill: "rgba(200,200,200,0.5)", arc1: 0, arc2: 2 * Math.PI }
    };

    // line style defaults
    context1.lineCap = "round";
    context1.lineJoin = "round";

    // Translate origin to center of canvas
    context1.translate(100,canvas1.height/2);
    context1.scale(1,-1) // Reversed y-axis

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


    // Original points and vertices // In principle there are no vertices to draw here
    drawCurve(context1, style, points); // Draw curve
    //drawVertices(context1, style, points); // Draw vertices as circles
}


// Draw a background grid
function drawGrid(myContext,bw,bh){
    var delta = 50; // grid cell size

    var half_width = bw/2;
    var half_height = bh/2;
    for (let x = -half_width; x <= 2*half_width; x += delta) {
        myContext.moveTo(x, -half_height);
        myContext.lineTo(x, half_height);
    }

    for (let y = -half_height; y <= half_height; y += delta) {
        myContext.moveTo(-half_width, y);
        myContext.lineTo(2* half_width , y);
    }

    myContext.lineWidth = 1;
    myContext.strokeStyle = "lightgray";
    myContext.stroke();

    myContext.strokeStyle = "black";
    myContext.font = "12px Arial";
    myContext.fillText("(0,0)",2,12);

}

// Draws a polygonal curve
function drawCurve(ctx, style, points) {

    ctx.lineWidth = style.curve.width;
    ctx.strokeStyle = style.curve.color;
    ctx.beginPath();
    var firstPoint = points[0];
    var currentPoint;
    ctx.moveTo(firstPoint.x, firstPoint.y);
    let radius = 30;
    for (let i = 0; i <  10*Math.PI; i=i+0.2) {
        currentPoint =  {x: radius * Math.sin(-i) + i * radius, y:radius * (1 - Math.cos(-i))};

        ctx.lineTo(currentPoint.x, currentPoint.y);
        ctx.moveTo(currentPoint.x, currentPoint.y);
    }
    ctx.stroke();

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


