import { bezier } from '@turf/turf';
import { Polygon } from 'ol/geom';

export const catGeometryFunction = function (Coordinates) {
	Coordinates.push(Coordinates[0]);
	let line = {
		type: 'Feature',
		properties: {},
		geometry: {
			type: 'LineString',
			coordinates: Coordinates,
		},
	};
	let curved = bezier(line);
	return new Polygon([curved['geometry']['coordinates']]);
};
