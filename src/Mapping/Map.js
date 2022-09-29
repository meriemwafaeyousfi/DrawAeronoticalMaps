import { View, Map } from 'ol';
import { fromLonLat } from 'ol/proj';
import BlankMap from './Layers/BlankMap';
import * as extent from 'ol/extent';
import { distance } from 'ol/coordinate';

export const createBlankMap = (target) => {
	return new Promise((resolve, rejecte) => {
		const map = new Map({
			target: target,
			interactions: [],
			layers: [BlankMap],
			view: new View({
				projection: 'EPSG:3857',
				center: fromLonLat([-1.15, 35.08]),
				zoom: 3,
			}),
			controls: [],
		});
		if (map) {
			resolve(map);
		} else {
			rejecte('fail to generate map');
		}
	});
};

export const zoomingInAndCenter = (event) => {
	event.map.getView().animate({
		center: event.coordinate,
		zoom: event.map.getView().getZoom() + 1,
		duration: 300,
	});
};

export const zoomingOutAndCenter = (event) => {
	event.map.getView().animate({
		center: event.coordinate,
		zoom: event.map.getView().getZoom() - 1,
		duration: 300,
	});
};

export const clearAllInteractions = (map) => {
	map.getInteractions().forEach((inter) => {
		inter.setActive(false);
	});
};

export const copyFeature = (map, feature) => {
	map.set('feature_copiee', feature);
	map.set('feature_coupee', null);
};

export const cutFeature = (map, feature) => {
	map.set('feature_coupee', feature);
	map.set('feature_copiee', null);
};

export const pastFeature = (map, layer, destination) => {
	let feature = null;
	if (map.get('feature_copiee')) {
		feature = map.get('feature_copiee').clone();
	}
	if (map.get('feature_coupee')) {
		feature = map.get('feature_coupee');
	}
	const source = extent.getCenter(feature.getGeometry().getExtent());
	const translationVector = [
		destination[0] - source[0],
		destination[1] - source[1],
	];
	let newCoords = [];
	feature
		.getGeometry()
		.getCoordinates()
		.forEach((Coord) => {
			newCoords = [
				...newCoords,
				[Coord[0] + translationVector[0], Coord[1] + translationVector[1]],
			];
		});
	feature.getGeometry().setCoordinates(newCoords);
	layer.getSource().removeFeature(feature);
	layer.getSource().addFeature(feature);
};

export const endDrawing = new CustomEvent('drawing:end');

export const selectOn = new CustomEvent('select:on');

export const selectOff = new CustomEvent('select:off');

export const translateOn = new CustomEvent('translate:on');

export const translateOff = new CustomEvent('translate:off');

export const verticesCheck = (point, feature) => {
	let vertex = false;
	feature
		.getGeometry()
		.getCoordinates()
		.forEach((coord) => {
			if (distance(coord, point) <= 350000) {
				vertex = true;
			}
		});
	return vertex;
};
