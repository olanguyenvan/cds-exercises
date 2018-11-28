
function computeNewtonValuesByPascalTriangle(n) {
    let newtonValues = {};
    for(let i=0; i <=n; i++){
        newtonValues[i] = {0: 1};
        newtonValues[i][i] = 1
    }

    for(let i=2; i <=n; i++){
        for(let j=1; j <= parseInt(i / 2); j++){
            newtonValues[i][j] = newtonValues[i-1][j - 1] + newtonValues[i-1][j];
            newtonValues[i][i -j] = newtonValues[i-1][j - 1] + newtonValues[i-1][j]
        }
    }
    return newtonValues
}


function bersteinPolynomial(n, i, t, computedNewtonValuesByPascalTriangle){
    return computedNewtonValuesByPascalTriangle[n][i] * Math.pow(t, i) * Math.pow(1 - t, n - i)
}


function computeBezierCurve(numberOfPointsToCompute, controlPoints){
    let numberOfControlPoints = controlPoints.length;
    let newtonValuesByPascalTriangle = computeNewtonValuesByPascalTriangle(4);
    let computedPoints = [];

    for (let i = 0; i <= numberOfPointsToCompute; i+=1) {
        let t = i / numberOfPointsToCompute;
        let computedPoint = {'x': 0, 'y': 0};
        for (let j = 0; j < numberOfControlPoints; j++){
            let bernsteinPolynomialValue = bersteinPolynomial(numberOfControlPoints - 1, j, t, newtonValuesByPascalTriangle);
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
    let newtonValuesByPascalTriangle = computeNewtonValuesByPascalTriangle(4); // 4 because curves will be at most cubic

    for (let chunkIndex = 0; chunkIndex < chunksNumber; chunkIndex++) {
        for (let i = 0; i <= numberOfPointsToComputePerChunk; i+=1) {
            let t = i / numberOfPointsToComputePerChunk;
            let computedPoint = {'x': 0, 'y': 0};
            let controlPoints = controlPointsChunks[chunkIndex];
            let numberOfControlPointsPerChunk = controlPoints.length;

            for (let j = 0; j < numberOfControlPointsPerChunk; j += 1){
                let bernsteinPolynomialValue = bersteinPolynomial(numberOfControlPointsPerChunk - 1, j, t, newtonValuesByPascalTriangle);
                computedPoint.x += bernsteinPolynomialValue * controlPoints[j].x;
                computedPoint.y += bernsteinPolynomialValue * controlPoints[j].y;
            }
            computedPoints.push(computedPoint)
        }
    }

    return computedPoints
}