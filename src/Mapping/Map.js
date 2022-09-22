import { View, Map } from 'ol';
import { fromLonLat } from 'ol/proj';
import BlankMap from './Layers/BlankMap';
import * as extent from 'ol/extent';

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
	map.set('feature_copiee', feature.clone());
};
export const pastFeature = (map, layer, destination) => {
	console.log(
		extent.getCenter(map.get('feature_copiee').getGeometry().getExtent())
	);
	const source = extent.getCenter(
		map.get('feature_copiee').getGeometry().getExtent()
	);
	map.get('feature_copiee').getGeometry().transform(source, destination);
	layer.getSource().addFeature(map.get('feature_copiee'));
};

export const endDrawing = new CustomEvent('drawing:end');

export const selectOn = new CustomEvent('select:on');

export const selectOff = new CustomEvent('select:off');

export const translateOn = new CustomEvent('translate:on');

export const translateOff = new CustomEvent('translate:off');
