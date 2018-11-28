let storedFactorials = [];

function factorial(n) {
    if (n === 0 || n === 1)
        return 1;
    if (storedFactorials[n] > 0)
        return storedFactorials[n];
    return storedFactorials[n] = factorial(n-1) * n;
}


function computeNewtonValues(n) {
    let newtonValues = new Array(n);
    for (let i = 0; i < n; i++){
        newtonValues[i] = factorial(n) / (factorial(i) * factorial(n - i));
        newtonValues[n - i] = factorial(n) / (factorial(i) * factorial(n - i))
    }
    return newtonValues
}


function bersteinPolynomial(n, i, t, computedNewtonValues){
    return computedNewtonValues[i] * Math.pow(t, i) * Math.pow(1 - t, n - i)
}



function computeBezierCurve(numberOfPointsToCompute, controlPoints){
    let numberOfControlPoints = controlPoints.length;
    let newtonValues = computeNewtonValues(numberOfControlPoints - 1);
    let computedPoints = [];

    for (let i = 0; i <= numberOfPointsToCompute; i+=1) {
        let t = i / numberOfPointsToCompute;
        let computedPoint = {'x': 0, 'y': 0};
        for (let j = 0; j < numberOfControlPoints; j++){
            let bernsteinPolynomialValue = bersteinPolynomial(numberOfControlPoints - 1, j, t, newtonValues);
            computedPoint.x += bernsteinPolynomialValue * controlPoints[j].x;
            computedPoint.y += bernsteinPolynomialValue * controlPoints[j].y;

        }
        computedPoints.push(computedPoint)
    }
    return computedPoints
}

function computeMidPoint(pointEnd, pointStart, n, m){
    return {
        x: (n * pointEnd.x + m * pointStart.x) / (n + m),
        y: (n * pointEnd.y + m * pointStart.y) / (n + m),
    };
}


function computeComposedBezierCurve(numberOfPointsToCompute, controlPoints){
    let numberOfAllControlPoints = controlPoints.length;
    let controlPointsChunks;
    if (numberOfAllControlPoints <= 4){
        controlPointsChunks = [controlPoints]
    }
    else {
        //compute chunks
        controlPointsChunks = [
            [controlPoints[0]]
        ];

        let tmpMidPoint;
        for (let i = 1; i + 2 < numberOfAllControlPoints; i += 2) { // this chunk and next needs to fit
            tmpMidPoint = computeMidPoint(controlPoints[i + 1], controlPoints[i + 2], 3, 3);

            controlPointsChunks[controlPointsChunks.length - 1].push( // push to the last row
                controlPoints[i], controlPoints[i + 1], tmpMidPoint
            );
            controlPointsChunks.push([tmpMidPoint]) // add new row
        }

        let chunksNumber = controlPointsChunks.length;
        let numberOfPointsInChunksAlready = 3 + (chunksNumber - 2) * 2;
        controlPointsChunks[chunksNumber - 1] = controlPointsChunks[chunksNumber - 1].concat(
            controlPoints.slice(numberOfPointsInChunksAlready)
        );
    }


    let chunksNumber = controlPointsChunks.length;
    let computedPoints = [];
    let numberOfPointsToComputePerChunk = parseInt(numberOfPointsToCompute/chunksNumber, 10);

    for (let chunkIndex = 0; chunkIndex < chunksNumber; chunkIndex++) {
        for (let i = 0; i <= numberOfPointsToComputePerChunk; i+=1) {
            let t = i / numberOfPointsToComputePerChunk;
            let computedPoint = {'x': 0, 'y': 0};
            let controlPoints = controlPointsChunks[chunkIndex];
            let numberOfControlPointsPerChunk = controlPoints.length;
            let newtonValues = computeNewtonValues(numberOfControlPointsPerChunk - 1);

            for (let j = 0; j < numberOfControlPointsPerChunk; j += 1){
                let bernsteinPolynomialValue = bersteinPolynomial(numberOfControlPointsPerChunk - 1, j, t, newtonValues);
                computedPoint.x += bernsteinPolynomialValue * controlPoints[j].x;
                computedPoint.y += bernsteinPolynomialValue * controlPoints[j].y;
            }
            computedPoints.push(computedPoint)
        }
    }

    return computedPoints
}
