/*
* Part of this code is based on:
    * http://blogs.sitepoint.com/html5-canvas-draw-quadratic-curves/
    * http://blogs.sitepoint.com/html5-canvas-draw-bezier-curves/
*/

var canvas1, context1, points, myTransformation, style, drag = null, draggedPoint;
let numberOfRays = 10;
let aCoefficientForParabola = 1/200;
var colors = ['#FF6633', '#FFB399',  '#00B3E6',
    '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
    '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
    '#FF99E6', '#FF1A66', '#E6331A', '#33FFCC',
    '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
    '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
    '#E666B3', '#33991A', '#CC9999', '#B3B31A',
    '#4D8066', '#809980', '#999933',
    '#FF3380', '#4D80CC', '#9900B3',
    '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

// TODO replace these points but those of the corresponding conic function (on-the-fly)
points = [];

function conicFunction (x){
    return aCoefficientForParabola * x * x ;
}

function computeConicPoints(){
    for (let i = -300; i < 300; i++) {
        points.push({x: i, y: conicFunction(i)})
    }

}

function init() {

    myTransformation = function(p){return p}; //Identity transform

    // default styles
    style = {
        curve:	{ width: 2, color: "#333" },
        line:	{ width: 2, color: "#C00" },
        point: { radius: 10, width: 2, color: "#900", fill: "rgba(200,200,200,0.5)", arc1: 0, arc2: 2 * Math.PI }
    };

    computeConicPoints();

    // line style defaults
    context1.lineCap = "round";
    context1.lineJoin = "round";

    // Translate origin to center of canvas
    context1.translate(canvas1.width/2, canvas1.height/2);

    // Flip y-axis, so it looks like in standard math axes
    context1.scale(1,-1) // Reversed y-axis

    drawCanvas();

}

// draw canvas
function drawCanvas() {
    // Clear everything
    context1.clearRect(0, 0, canvas1.width, canvas1.height);  // Clear canvas

    // Background grids
    drawGrid(context1,canvas1.width, canvas1.height); // Draw background grid

    // Original points and vertices
    drawCurve(context1, style, points); // Draw curve
    // drawVertices(context1, style, points); // Draw vertices as circles

}


// Draw a background grid
function drawGrid(myContext,bw,bh){
    var delta = 50; // grid cell size

    var half_width = bw/2;
    var half_height = bh/2;
    for (var x = -half_width; x <= half_width; x += delta) {
        myContext.moveTo(x, -half_height);
        myContext.lineTo(x, half_height);
    }
    for (var y = -half_height; y <= half_height; y += delta) {
        myContext.moveTo(-half_width, y);
        myContext.lineTo(half_width , y);
    }

    myContext.lineWidth = 1;
    myContext.strokeStyle = "lightgray";
    myContext.stroke();

    myContext.strokeStyle = "black";
    myContext.font = "12px Arial";
    myContext.fillText("(0,0)",2,12);

}

// Draws a polygonal curve connecting the points, after applying the given transformation
function drawCurve(ctx, style, points, transformation) {
    // The transformation is optional. If none provided, use identity transform
    if (transformation===undefined) {
        transformation = function(p){return p}; //Identity transform
    }

    // Draw curve
    ctx.lineWidth = style.curve.width;
    ctx.strokeStyle = style.curve.color;
    ctx.beginPath();
    var firstPoint = transformation(points[0]);
    var currentPoint;
    ctx.moveTo(firstPoint.x, firstPoint.y);
    for (var i = 0; i < points.length; i++) {
        currentPoint =  transformation(points[i]);
        ctx.lineTo(currentPoint.x, currentPoint.y);
        ctx.moveTo(currentPoint.x, currentPoint.y);
    }
    ctx.stroke();
}


function drawSegment(ctx, style, color, pointFrom, pointTo){
    ctx.lineWidth = style.line.width;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(pointFrom.x, pointFrom.y);

    ctx.lineTo(pointTo.x, pointTo.y);
    ctx.moveTo(pointTo.x, pointTo.y);
    // }
    ctx.stroke();
}
// Assign canvas and context variables
canvas1 = document.getElementById("canvas1");
context1 = canvas1.getContext("2d");

init();
drawVerticalLines();


function drawVerticalLines(){
    let focusPoint = {x: 0, y:1/ (4 * aCoefficientForParabola)};
    for(let i=0; i < numberOfRays; i++){
        let randomXValue = Math.floor(Math.random() * 600) - 300;
        let conicValue = conicFunction(randomXValue);
        let color = colors[Math.floor(Math.random() * colors.length)];
        drawSegment(context1, style, color, {x: randomXValue, y: 300}, {x: randomXValue, y: conicValue})
        drawSegment(context1, style, color, {x: randomXValue, y: conicValue}, focusPoint)
    }

}

function doReset () {
    myTransformation = function(p){return p}; //Identity transform
    drawCanvas();
}


