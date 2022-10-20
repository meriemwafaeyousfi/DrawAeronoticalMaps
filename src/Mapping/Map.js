import { View, Map } from 'ol';
import { fromLonLat } from 'ol/proj';
import BlankMap from './Layers/BlankMap';
import * as extent from 'ol/extent';
import { distance } from 'ol/coordinate';
import { DragPan, Draw, Select, Translate } from 'ol/interaction';

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

export const endDrawing = (map) => {
	map.getInteractions().forEach((interaction) => {
		if (interaction instanceof Draw) {
			interaction.setActive(false);
		}
	});
};

export const selectOn = (map) => {
	console.log('selecton')
	map.getInteractions().forEach((interaction) => {
		if (interaction instanceof Select) {
			interaction.setActive(true);
		}
	});
};

export const selectOff = (map) => {
	console.log('selectoff')
	map.getInteractions().forEach((interaction) => {
		if (interaction instanceof Select) {
			interaction.setActive(false);
		}
	});
};

export const translateOn = (map) => {
	map.getInteractions().forEach((interaction) => {
		if (interaction instanceof Translate) {
			interaction.setActive(true);
		}
	});
};

export const translateOff = (map) => {
	map.getInteractions().forEach((interaction) => {
		if (interaction instanceof Translate) {
			interaction.setActive(false);
		}
	});
};

export const dragPanOff = (map) => {
	map.getInteractions().forEach((interaction) => {
		if (interaction instanceof DragPan) {
			interaction.setActive(false);
		}
	});
};
export const dragPanOn = (map) => {
	map.getInteractions().forEach((interaction) => {
		if (interaction instanceof DragPan) {
			interaction.setActive(true);
		}
	});
};

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

export const save = (map) => {
	map.getLayers().forEach((layer) => {
		console.log(layer.get('title'));
	});
};
