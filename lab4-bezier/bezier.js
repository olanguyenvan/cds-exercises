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
        newtonValues[i] = factorial(n) / (factorial(i) * factorial(n - i))
        newtonValues[n - i] = factorial(n) / (factorial(i) * factorial(n - i))
    }
    return newtonValues

}


function bersteinPolynomial(n, i, t, computerNewtonValues){
    return computerNewtonValues[i] * Math.pow(t, i) * Math.pow(1 - t, n - i)
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
