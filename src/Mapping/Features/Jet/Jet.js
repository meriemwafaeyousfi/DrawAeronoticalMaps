import { Draw, Modify, Select, Translate } from 'ol/interaction';
import {
	Stroke,
	Style,
	Fill,
	RegularShape,
	Icon,
	Text as olText,
} from 'ol/style';
import { arc } from './JetGeometry';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import CircleStyle from 'ol/style/Circle';
import { Point, MultiPoint, LineString } from 'ol/geom';
import {
	never,
	altKeyOnly,
	click,
	shiftKeyOnly,
	doubleClick,
} from 'ol/events/condition';
import { distance } from 'ol/coordinate';
import { feature } from '@turf/turf';

const fill = new Fill({ color: '#0000FF', opacity: 1 });
const stroke = new Stroke({
	color: '#0000FF',
	width: 4,
});
const styleFunction = function (feature) {
	const geometry = feature.getGeometry();
	let coords = feature.getGeometry().getCoordinates();
	let end = coords[coords.length - 1];
	let start = coords[coords.length - 2];
	const dx = end[0] - start[0];
	const dy = end[1] - start[1];
	const rotation = -Math.atan2(dy, dx);

	const styles = new Style({
		geometry: new Point(end),
		image: new RegularShape({
			fill: fill,
			stroke: stroke,
			points: 3,
			radius: 7,
			rotation: rotation,
			rotateWithView: true,
			angle: 100,
		}),
	});
	const styles2 = new Style({
		stroke: new Stroke({
			color: '#0000FF',
			width: 4.5,
		}),
		geometry: (feature) => {
			return arc(feature.getGeometry().getCoordinates());
		},
	});
	return [styles2, styles];
};

const selectType = (mapBrowserEvent) => {
	return (
		click(mapBrowserEvent) ||
		doubleClick(mapBrowserEvent) ||
		mapBrowserEvent.type === 'contextmenu'
	);
};

const selectStyleFunction = function (feature) {
	let coords = feature.getGeometry().getCoordinates();
	let end = coords[coords.length - 1];
	let start = coords[coords.length - 2];
	const dx = end[0] - start[0];
	const dy = end[1] - start[1];
	const rotation = -Math.atan2(dy, dx);

	const styles1 = new Style({
		geometry: new Point(end),
		image: new RegularShape({
			fill: fill,
			stroke: stroke,
			points: 3,
			radius: 7,
			rotation: rotation,
			rotateWithView: true,
			angle: 100,
		}),
	});
	const styles2 = new Style({
		stroke: new Stroke({
			color: '#0000FF',
			width: 4.5,
		}),
		geometry: (feature) => {
			return arc(feature.getGeometry().getCoordinates())
		},
	});
	const styles3 = new Style({
		image: new CircleStyle({
			radius: 5,
			fill: new Fill({
				color: '#0000FF',
			}),
		}), 
		geometry: function (feature) {
			let coordinates = feature.getGeometry().getCoordinates()
			coordinates.pop()
			return new MultiPoint(coordinates)
		},
		
	});
	return [styles3, styles2, styles1];
};

export const jetVectorLayer = () => {
	return new VectorLayer({
		title: 'Jet',
		source: new VectorSource(),
		style: styleFunction,
	});
};

export const drawJet = (vectorSource) => {
	return new Draw({
		source: vectorSource,
		type: 'LineString',
		style: styleFunction,
	});
};

export const modifyJet = (select) => {
	return new Modify({
		features: select.getFeatures(),
		insertVertexCondition: shiftKeyOnly,
		removePoint: altKeyOnly,
	});
};

export const selectJet = (vectorLayer) => {
	return new Select({
		condition: selectType,
		style: (feature) => {
			return selectStyleFunction(feature);
		},
		filter: function (feature) {
			return feature.get('feature_type') === 'jet';
		},
	});
};

export const jetDrawingON = (map) => {
	map.getInteractions().forEach((interaction) => {
		if (interaction.get('title') === 'jet:draw') {
			interaction.setActive(true);
		}
	});
};

export const translateJet = (vectorLayer) => {
	return new Translate({
		layers: [vectorLayer],
		hitTolerance: 10,
	});
};
