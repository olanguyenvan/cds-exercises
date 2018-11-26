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


