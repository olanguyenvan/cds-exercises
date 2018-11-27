var canvas1, context1, curvesDefinitions, myTransformation, style, styleForBezierCurve, dragCurve = null, drag = null, draggedPoint;
let numberOfPointsToCompute = 20;

curvesDefinitions = [[{x:114,y:71},{x:258,y:55},{x:422,y:65},{x:530,y:143},{x:530,y:297},{x:400,y:342}]];
let letter = 'V'; // Your letter goes here

function init() {

    myTransformation = function(p){return p}; //Identity transform

    style = {
        curve:	{ width: 3, color: "#E6B3B3" },
        line:	{ width: 1, color: "#C00" },
        point: { radius: 5, width: 2, color: "#900", fill: "rgba(200,200,200,0.5)", arc1: 0, arc2: 2 * Math.PI }
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
    showPointsInformation();
}



function showPointsInformation(){
    var divWithPoints = document.getElementById("pointsInfo");
    divWithPoints.innerHTML = "<h1>Curves and control points information</h1>";

    for(let i = 0; i < curvesDefinitions.length; i++){
        let controlPoints = curvesDefinitions[i];
        divWithPoints.innerHTML += "Curve no " + (i + 1);
        divWithPoints.innerHTML += "<ol>";
        for (let j = 0; j < controlPoints.length; j++){
            divWithPoints.innerHTML += '<li>' + j + ':   [' + controlPoints[j].x + ',' + controlPoints[j].y + '] ' +
                '<button type="button" onclick="deleteControlPoint(' + i + ',' +  j +')">delete Point</button>'
                + '</li>';
        }
        divWithPoints.innerHTML += "</ol></br>";
    }
}

// draw canvas
function drawCanvas() {
    // Clear everything
    context1.clearRect(0, 0, canvas1.width, canvas1.height);  // Clear canvas

    // Background grids
    drawGrid(context1,canvas1.width, canvas1.height); // Draw background grid

    // Background letter
    context1.fillStyle = "lightgray";
    context1.font = "800px Times";
    context1.fillText(letter,100,600);

    // Curve through control points and vertices
    for(let i = 0; i < curvesDefinitions.length; i++){
        drawCurve(context1, style, curvesDefinitions[i]); // Draw curve
        drawVertices(context1, style, curvesDefinitions[i]); // Draw vertices as circles
        drawCurveConnectingPoints(context1, styleForBezierCurve, computeBezierCurve(numberOfPointsToCompute, curvesDefinitions[i]));

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

// Draws a polygonal curve connecting the curvesDefinitions[i], after applying the given transformation
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
    for (var j=0; j< curvesDefinitions.length; j++){
        let controlPoints = curvesDefinitions[j]
        for (var i=0; i<controlPoints.length;i++) {
            dx = controlPoints[i].x - e.x;
            dy = controlPoints[i].y - e.y;
            if ((dx * dx) + (dy * dy) < style.point.radius * style.point.radius) {
                dragCurve = j;
                drag = i;
                draggedPoint = e;
                canvas1.style.cursor = "move";
                return;
            }
        }
    }

}

// dragging
function dragging(e) {
    if (drag!=null) {
        e = mousePos(e);
        curvesDefinitions[dragCurve][drag].x += e.x - draggedPoint.x;
        curvesDefinitions[dragCurve][drag].y += e.y - draggedPoint.y;
        draggedPoint = e;
        drawCanvas();
    }
}

// end dragging
function dragEnd(e) {
    drag = null;
    dragCurve = null;
    canvas1.style.cursor = "default";
    drawCanvas();
    showPointsInformation();
}

// event parser
function mousePos(event) {
    event = (event ? event : window.event);
    return {
        x: event.pageX - canvas1.offsetLeft,
        y: event.pageY - canvas1.offsetTop
    }
}


function addControlPoint(){
    let newPointXValue = parseFloat(document.getElementById('newPointXValue').value);
    let newPointYValue = parseFloat(document.getElementById('newPointYValue').value);
    let curveIndex = parseInt(document.getElementById('curveIndex').value) || 1;
    let pointIndex = parseInt(document.getElementById('pointIndex').value) || 0;
    if (curveIndex> curvesDefinitions.length){
        curvesDefinitions.push([{x: newPointXValue, y: newPointYValue}]);
    }
    else {
        if (pointIndex > curvesDefinitions[curveIndex - 1].length){
            curvesDefinitions[curveIndex - 1].push({x: newPointXValue, y: newPointYValue});
        }
        else {
            curvesDefinitions[curveIndex - 1].splice(pointIndex, 0, {x: newPointXValue, y: newPointYValue})
        }
    }

    drawCanvas();
    showPointsInformation();
}


function deleteControlPoint(curveIndex, pointIndex){
    curvesDefinitions[curveIndex].splice(pointIndex, 1);
    if (curvesDefinitions[curveIndex].length === 0) {
        curvesDefinitions.splice(curveIndex, 1);
    }
    drawCanvas();
    showPointsInformation();
}

// Assign canvas and context variables
canvas1 = document.getElementById("canvas1");
context1 = canvas1.getContext("2d");

init();

function saveToFile(text, name, type) {
    var a = document.createElement("a");
    var file = new Blob([text], {type: type});
    a.href = URL.createObjectURL(file);
    a.download = name;
    a.click();
}


function doSave() {
    saveToFile(JSON.stringify(curvesDefinitions), 'control_points.txt', 'text/plain');
}

function readSingleFile(e) {
    var file = e.target.files[0];
    if (!file) {
        return;
    }

    var reader = new FileReader();
    reader.onload = function(e) {
        var contents = e.target.result;
        updateContents(contents);
    };
    reader.readAsText(file);
}

function updateContents(contents) {
    curvesDefinitions= JSON.parse(contents);
    drawCanvas();
    showPointsInformation();
}

document.getElementById('file-input')
    .addEventListener('change', readSingleFile, false);
