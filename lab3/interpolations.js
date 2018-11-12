

function interpolatePoint(t, controlPoints, tValues){
    let numberOfControlPoints = controlPoints.length;

    let s = {x: 0, y: 0};
    for( let i=0; i < numberOfControlPoints; i++){
        let controlPoint = controlPoints[i];
        let enumerator = 1;
        let denominator = 1;

        for( let j=0; j < numberOfControlPoints; j++) {
            if (j !== i){
                enumerator *= t - tValues[j];
                denominator *= tValues[i] - tValues[j];
            }
        }
        let fraction = enumerator/denominator;
        s.x += fraction * controlPoint.x;
        s.y += fraction * controlPoint.y;
    }
    return s
}


function computeInterpolationCurve(numberOfPointsToCompute, controlPoints, tValues) {
    let computedPoints = [];
    for (let i = 1; i <= numberOfPointsToCompute; i+=1) {
        let t = i / numberOfPointsToCompute;
        computedPoints.push(interpolatePoint(t, controlPoints, tValues))
    }
    return computedPoints

}


function computeInterpolationCurveWithUniformTValues(numberOfPointsToCompute, points){
    let numberOfControlPoints = points.length;
    let tInterval = 1 / (numberOfControlPoints- 1);
    let tValuesUniform = [...Array(numberOfControlPoints).keys()].map(x => x * tInterval);
    return computeInterpolationCurve(numberOfPointsToCompute, points, tValuesUniform)
}

function computeInterpolationCurveWithTValuesProportionalToDistance(numberOfPointsToCompute, points){
    let numberOfControlPoints = points.length;
    function distanceBetweenPoints(point1, point2){
        return Math.sqrt(point1.x * point2.x + point1.y * point2.y)
    }
    let tValuesProportionallytoTheDistance = [0];
    for (let i = 1; i < numberOfControlPoints; i++){
        tValuesProportionallytoTheDistance.push(distanceBetweenPoints(points[i-1], points[i]))
    }

    let sumOfDistances = tValuesProportionallytoTheDistance.reduce((a, b) => a +b);
    let sumOfDistancesSoFar = 0;

    for(let i = 1; i < numberOfControlPoints; i++){
        sumOfDistancesSoFar += tValuesProportionallytoTheDistance[i];
        tValuesProportionallytoTheDistance[i] = sumOfDistancesSoFar/sumOfDistances
    }
    return computeInterpolationCurve(numberOfPointsToCompute, points, tValuesProportionallytoTheDistance)
}
