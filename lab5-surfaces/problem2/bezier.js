
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


getBezierSurfaceEquation = function(controlPoints){
    let n = controlPoints.length - 1;
    let m = controlPoints[0].length - 1;
    console.log(n, m);
    let newtonValuesByPascalTriangleForN = computeNewtonValuesByPascalTriangle(n);
    let newtonValuesByPascalTriangleForM = computeNewtonValuesByPascalTriangle(m);

    return function(u, v) {

        let computedPointX = 0;
        let computedPointY = 0;
        let computedPointZ = 0;
        for (let i = 0; i <= n; i++){
            for (let j = 0; j <= m; j++) {
                let bernsteinPolynomialValueForN = bersteinPolynomial(n, i, u, newtonValuesByPascalTriangleForN);
                let bernsteinPolynomialValueForM = bersteinPolynomial(m, j, v, newtonValuesByPascalTriangleForM);
                let bernsteinPolynomialMultiplied = bernsteinPolynomialValueForN * bernsteinPolynomialValueForM;

                computedPointX += bernsteinPolynomialMultiplied * controlPoints[i][j].x;
                computedPointY += bernsteinPolynomialMultiplied * controlPoints[i][j].y;
                computedPointZ += bernsteinPolynomialMultiplied * controlPoints[i][j].z;
            }
        }

        return new THREE.Vector3(computedPointX, computedPointY, computedPointZ);
    }
};

