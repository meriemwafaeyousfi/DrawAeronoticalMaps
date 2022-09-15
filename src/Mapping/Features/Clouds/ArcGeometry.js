import LineString from 'ol/geom/LineString';
import { transform } from 'ol/proj';
import {
	distance,
	lineString,
	along,
	bearing,
	destination,
	lineArc,
	point,
} from '@turf/turf';

let drawOneHalfCircle = (P1, P2) => {
	var p1LonLat = [P1['x'], P1['y']];
	var p2LonLat = [P2['x'], P2['y']];

	var line = lineString([p1LonLat, p2LonLat]);
	var d = distance(p1LonLat, p2LonLat);
	var pMid = along(line, d / 2);

	var lineBearing = bearing(p1LonLat, p2LonLat);
	var centerPoint = destination(pMid, 0.08 * d, lineBearing - 90);

	var r = d / 2;
	var bear1 = bearing(centerPoint, point(p2LonLat));
	var bear2 = bearing(centerPoint, point(p1LonLat));
	var arc2 = lineArc(centerPoint, r, bear1, bear2, { steps: 200 });

	return arc2['geometry']['coordinates'];
};

//calcilate the coordinates the next point where the arc should end
let calculateP3 = (P1, P2, d) => {
	var P1Distn = [P1['x'], P1['y']];
	var P2Distn = [P2['x'], P2['y']];
	let D = distance(P1Distn, P2Distn);
	if (d > D) {
		return P2;
	}
	let P3 = {};
	P3['x'] = P1['x'] + (d / D) * (P2['x'] - P1['x']);
	P3['y'] = P1['y'] + (d / D) * (P2['y'] - P1['y']);
	return P3;
};

let drawHalfCircles = (P2, P1) => {
	let distanceBetweenTwoPoints = 200;
	let P3;
	let HalfCircles = [];
	let myHalfCircleArray;
	do {
		P3 = calculateP3(P1, P2, distanceBetweenTwoPoints);
		myHalfCircleArray = drawOneHalfCircle(P1, P3);
		myHalfCircleArray.reverse();
		HalfCircles = HalfCircles.concat(myHalfCircleArray);
		P1 = P3;
	} while (P3 !== P2);
	HalfCircles.reverse();
	return HalfCircles;
};

let drawHalfCirclesBetweenPoints = (myCoordinates) => {
	let halfCirclesArray = [];

	for (let i = 0; i < myCoordinates.length - 1; i++) {
		var p1LonLat = transform(myCoordinates[i], 'EPSG:3857', 'EPSG:4326');
		var p2LonLat = transform(myCoordinates[i + 1], 'EPSG:3857', 'EPSG:4326');
		p1LonLat = { x: p1LonLat[0], y: p1LonLat[1] };
		p2LonLat = { x: p2LonLat[0], y: p2LonLat[1] };
		halfCirclesArray = halfCirclesArray.concat(
			drawHalfCircles(p1LonLat, p2LonLat)
		);
	}
	return halfCirclesArray;
};
export const arc = (coordinates) => {
	let geometry = new LineString(drawHalfCirclesBetweenPoints(coordinates));
	geometry.transform('EPSG:4326', 'EPSG:3857');
	return geometry;
};
