let storedFactorials = [];

function factorial(n) {
    if (n === 0 || n === 1)
        return 1;
    if (storedFactorials[n] > 0)
        return storedFactorials[n];
    return storedFactorials[n] = factorial(n-1) * n;
}


function newton(n, i) {
    return factorial(n) / (factorial(i) * factorial(n - i))
}


function bersteinPolynomial(n, i, t){
    let a,b,c;
    return newton(n, i) * Math.pow(t, i) * Math.pow(1 - t, n - i)
}



function computeBezierCurve(numberOfPointsToCompute, controlPoints){
    let numberOfControlPoints = controlPoints.length;
    let computedPoints = [];
    for (let i = 0; i <= numberOfPointsToCompute; i+=1) {
        let t = i / numberOfPointsToCompute;
        let computedPoint = {'x': 0, 'y': 0};
        for (let j = 0; j < numberOfControlPoints; j++){
            let bernsteinPolynomialValue = bersteinPolynomial(numberOfControlPoints - 1, j, t);
            computedPoint.x += bernsteinPolynomialValue * controlPoints[j].x;
            computedPoint.y += bernsteinPolynomialValue * controlPoints[j].y;
            console.log(bernsteinPolynomialValue);

        }
        computedPoints.push(computedPoint)
    }
    console.log(controlPoints);
    return computedPoints
}
