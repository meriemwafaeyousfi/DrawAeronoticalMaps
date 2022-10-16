import { bezier } from '@turf/turf';
import { Polygon } from 'ol/geom';

export const catGeometryFunction = function (Coordinates) {
	let line = {
		type: 'Feature',
		properties: {},
		geometry: {
			type: 'LineString',
			coordinates: Coordinates[0],
		},
	};
	let curved = bezier(line);
	return new Polygon([curved['geometry']['coordinates']]);
};
