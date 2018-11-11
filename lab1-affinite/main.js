/*
    * Part of this code is based on:
        * http://blogs.sitepoint.com/html5-canvas-draw-quadratic-curves/
        * http://blogs.sitepoint.com/html5-canvas-draw-bezier-curves/
    */

var canvas1, canvas2, context1, context2, points, myTransformation, style, styleProjectedVertices, drag = null, draggedPoint;

points = [{ x:-150, y:-200 },{ x:-150, y:-150 },{ x:-50, y:-150 }, { x:-50, y:200 }, { x:0, y:200 },
    { x:0, y:-150 },{ x:100, y:-150 },{ x:100, y:-250 },{ x:-100, y:-250 },{ x:-150, y:-200 }];



function init() {
    myTransformation = function(p){return p}; //Identity transform

    // default styles
    style = {
        curve:	{ width: 6, color: "#333" },
        line:	{ width: 1, color: "#C00" },
        point: { radius: 10, width: 2, color: "#900", fill: "rgba(200,200,200,0.5)", arc1: 0, arc2: 2 * Math.PI }
    };

    styleProjectedVertices = {
        point: { radius: 5, width: 2, color: "blue", fill: "rgba(200,200,200,0.5)", arc1: 0, arc2: 2 * Math.PI }

    };

    // line style defaults
    context1.lineCap = "round";
    context1.lineJoin = "round";

    context2.lineCap = "round";
    context2.lineJoin = "round";

    // Translate origin to center of canvas
    context1.translate(canvas1.width/2,canvas1.height/2);
    context2.translate(canvas2.width/2,canvas2.height/2);

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
    context1.clearRect(-canvas1.width/2, -canvas1.height/2, canvas1.width, canvas1.height);  // Clear canvas
    context2.clearRect(-canvas2.width/2, -canvas2.height/2, canvas2.width, canvas2.height);  // Clear canvas

    // Background grids
    drawGrid(context1,canvas1.width, canvas1.height); // Draw background grid
    drawGrid(context2,canvas2.width, canvas2.height); // Draw background grid

    // Original points and vertices
    drawCurve(context1, style, points); // Draw curve
    drawVertices(context1, style, points); // Draw vertices as circles

    // Transformed points
    drawCurve(context2, style, points, myTransformation); // Draw curve transformed
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

    myContext.fillStyle = "black";
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
    // Reverse translation to canvas1
    var pos = fromCanvasToPointSpace(e);
    var dx, dy;
    for (var i=0; i<points.length;i++) {
        dx = points[i].x - pos.x;
        dy = points[i].y - pos.y;
        if ((dx * dx) + (dy * dy) < style.point.radius * style.point.radius) {
            drag = i;
            draggedPoint = pos;
            canvas1.style.cursor = "move";
            return;
        }
    }
}

// dragging
function dragging(e) {
    if (drag!=null) {
        e = mousePos(e);
        // Reverse translation to canvas1
        var pos = fromCanvasToPointSpace(e);
        points[drag].x += pos.x - draggedPoint.x;
        points[drag].y += pos.y - draggedPoint.y;
        draggedPoint = pos;
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

// Transforms the coordinates of a point in canvas1 to one in the space of points
function fromCanvasToPointSpace(canvasPoint) {
    return {x: canvasPoint.x - canvas1.width/2 , y: canvasPoint.y - canvas1.height/2};
}

/**
 * Start ("main method")
 */

// Assign canvas and context variables
canvas1 = document.getElementById("canvas1");
context1 = canvas1.getContext("2d");
canvas2 = document.getElementById("canvas2");
context2 = canvas2.getContext("2d");

init();

/**
 * Auxiliary functions
 */

var scalingFunction = function (point, scalingXValue, scalingYValue) {
    var matrix = math.matrix([[scalingXValue, 0], [0, scalingYValue]]); //2x2 scaling matrix (for 0.5)
    var pointAsArray = [point.x, point.y];
    var result = math.multiply(matrix,pointAsArray); // result is a matrix!
    var transformedPoint = {x: result.get([0]),y: result.get([1])};
    return transformedPoint;
}

// This is just an example
function doScaling() {
    var scalingXValue = parseFloat(document.getElementById('scalingXValue').value);
    var scalingYValue = parseFloat(document.getElementById('scalingYValue').value);

    myTransformation = function(point){
        return scalingFunction(point, scalingXValue, scalingYValue)
    };
    drawCanvas();
}


function doReset () {
    myTransformation = function(p){return p}; //Identity transform
    drawCanvas()
}

var translateFunction = function (point, translationXValue, translationYValue) {
    var transformedPoint = {x: point.x + translationXValue, y: point.y + translationYValue};
    return transformedPoint;
}

function doTranslate(){
    var translationXValue = parseFloat(document.getElementById('translationXValue').value);
    var translationYValue = parseFloat(document.getElementById('translationYValue').value);

    myTransformation = function(point){
        return translateFunction(point, translationXValue, translationYValue)
    };
    drawCanvas();
}

function getRotatedPoint(point, rotatingAngle){
    var matrix = math.matrix([
        [Math.cos(rotatingAngle), -Math.sin(rotatingAngle)],
        [Math.sin(rotatingAngle), Math.cos(rotatingAngle)]
    ]);
    var pointAsArray = [point.x, point.y];
    var result = math.multiply(matrix, pointAsArray);
    return {x: result.get([0]),y: result.get([1])}

}


function doRotating(){

    var rotatingAngleValue = parseFloat(document.getElementById('rotatingAngleValue').value);

    myTransformation = function(point){
        return getRotatedPoint(point, rotatingAngleValue * Math.PI)
    };
    drawCanvas();
}


var reflectPointOverOX = function (point) {
    return {x: point.x, y: -point.y};
};

function doReflectPointOverOX(){
    myTransformation = reflectPointOverOX;
    drawCanvas();
}


function getRotatedPoint(point, rotatingAngle){
    let matrix = math.matrix([
        [Math.cos(rotatingAngle), -Math.sin(rotatingAngle)],
        [Math.sin(rotatingAngle), Math.cos(rotatingAngle)]
    ]);

    let pointAsArray = [point.x, point.y];
    let result = math.multiply(matrix, pointAsArray);
    return {x: result.get([0]),y: result.get([1])}

}

// problem 2


var translateThenRotate = function (point, translationXValue, translationYValue, rotatingAngleValue) {
    var translatedPoint = {x: point.x + translationXValue, y: point.y  + translationYValue};
    var rotatedAndTranslatedPoint = getRotatedPoint(translatedPoint, rotatingAngleValue)
    return rotatedAndTranslatedPoint;
};

function doTranslateThenRotate(){
    var translationXValue = parseFloat(document.getElementById('translationXValueProblem2').value);
    var translationYValue = parseFloat(document.getElementById('translationYValueProblem2').value);
    var rotatingAngleValue = parseFloat(document.getElementById('rotatingAngleValueProblem2').value);

    myTransformation = function(point){
        return translateThenRotate(point, translationXValue, translationYValue, rotatingAngleValue * Math.PI)
    };
    drawCanvas();
}


var RotateThenTranslate = function (point, translationXValue, translationYValue, rotatingAngleValue) {
    var rotatedPoint = getRotatedPoint(point, rotatingAngleValue)
    var transformedPoint = {x: rotatedPoint.x + translationXValue, y: rotatedPoint.y  + translationYValue};
    return transformedPoint;
}

function doRotateThenTranslate(){
    var translationXValue = parseFloat(document.getElementById('translationXValueProblem2').value);
    var translationYValue = parseFloat(document.getElementById('translationYValueProblem2').value);
    var rotatingAngleValue = parseFloat(document.getElementById('rotatingAngleValueProblem2').value);

    myTransformation = function(point){
        return RotateThenTranslate(point, translationXValue, translationYValue, rotatingAngleValue * Math.PI)
    };
    drawCanvas();
}


var reflectPointOverLine = function (point, a, b, c) {
    let f = -2 / (a*a + b*b);
    let matrix = math.matrix([
        [1 + f * a * a, f * a * b, 0],
        [f * a * b, 1 + f * b * b, 0],
        [f * a * c, f * b * c, 1],
    ]);

    let pointAsArray = [point.x, point.y, 1];
    let result = math.multiply(matrix, pointAsArray);
    return {x: result.get([0]),y: result.get([1])}
};


function doReflectOverLine(){
    var lineACoefficient = parseFloat(document.getElementById('lineACoefficient23').value);
    var lineBCoefficient = parseFloat(document.getElementById('lineBCoefficient23').value);
    var lineCCoefficient = parseFloat(document.getElementById('lineCCoefficient23').value);


    myTransformation = function(point){
        return reflectPointOverLine(point, lineACoefficient, lineBCoefficient, lineCCoefficient)
    };
    drawCanvas();
}

function calculateNewParallelProjectedPoints(vectorX, vectorY, lineCoeffA, lineCoeffB, lineCoeffC, pointsToProject){

    let newProjectedPoints = [];
    let lambdaDenominator = lineCoeffA * vectorX + lineCoeffB * vectorY;

    for (var i = 0; i < pointsToProject.length; i++) {
        let oldX = pointsToProject[i].x;
        let oldY = pointsToProject[i].y;

        let lambda = (-lineCoeffA * oldX - lineCoeffB * oldY -lineCoeffC) / lambdaDenominator;

        let newX = oldX + lambda * vectorX;
        let newY = oldY + lambda * vectorY;
        newProjectedPoints.push({x: newX, y: newY})
    }
    return newProjectedPoints;
}


function doParallelProjection(){
    let vectorXProblem31 = parseFloat(document.getElementById('vectorXProblem31').value);
    let vectorYProblem31 = parseFloat(document.getElementById('vectorYProblem31').value);
    let lineCoeffA = parseFloat(document.getElementById('lineCoeffAProblem31').value);
    let lineCoeffB = parseFloat(document.getElementById('lineCoeffBProblem31').value);
    let lineCoeffC = parseFloat(document.getElementById('lineCoeffCProblem31').value);

    drawCanvas();
    let newProjectedPoints = calculateNewParallelProjectedPoints(vectorXProblem31, vectorYProblem31,
        lineCoeffA, lineCoeffB, lineCoeffC, points);
    drawVertices(context2, style, [{x: 0, y: 0}]); // draw central projection point
    drawVertices(context2, style, [{x: vectorXProblem31, y: vectorYProblem31}]); // draw parallel projection point
    drawCurve(context2, style, [{x: 0, y: 0}, {x: vectorXProblem31, y: vectorYProblem31}]); // draw parallel projection point
    drawVertices(context2, styleProjectedVertices, newProjectedPoints); // draw central projection point

}

function calculateNewCenteredProjectedPoints(centerProjectionPoint, lineCoeffA, lineCoeffB, lineCoeffC, pointsToProject){

    let newProjectedPoints = [];
    for (let i = 0; i < pointsToProject.length; i++) {
        let oldX = pointsToProject[i].x;
        let oldY = pointsToProject[i].y;
        let tDenominator = lineCoeffA * (oldX - centerProjectionPoint.x) + lineCoeffB * (oldY - centerProjectionPoint.y);
        let t = (lineCoeffA * oldX + lineCoeffB * oldY + lineCoeffC) / tDenominator;

        let newX = (1 - t) * oldX + t * centerProjectionPoint.x;
        let newY = (1 - t) * oldY + t * centerProjectionPoint.y;
        newProjectedPoints.push({x: newX, y: newY})
    }

    return newProjectedPoints;
}

function doCentralProjection(){
    let pointXProblem32 = parseFloat(document.getElementById('pointXProblem32').value);
    let pointYProblem32 = parseFloat(document.getElementById('pointYProblem32').value);
    let lineCoeffA = parseFloat(document.getElementById('lineCoeffAProblem32').value);
    let lineCoeffB = parseFloat(document.getElementById('lineCoeffBProblem32').value);
    let lineCoeffC = parseFloat(document.getElementById('lineCoeffCProblem32').value);

    drawCanvas();
    let centerProjectionPoint = {x: pointXProblem32, y: pointYProblem32};
    let newProjectedPoints = calculateNewCenteredProjectedPoints(centerProjectionPoint, lineCoeffA, lineCoeffB, lineCoeffC, points);
    drawVertices(context2, style, [centerProjectionPoint]); // draw central projection point
    drawVertices(context2, styleProjectedVertices, newProjectedPoints); // draw central projection point

}


