import { Draw, Modify, Select, Translate } from 'ol/interaction';
import { Stroke, Style, Fill } from 'ol/style';
import { arc } from './ArcGeometry';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import CircleStyle from 'ol/style/Circle';
import { MultiPoint, LineString } from 'ol/geom';
import { never } from 'ol/events/condition';
import Point from 'ol/geom/Point';

export const cloudVectorLayer = () => {
	return new VectorLayer({
		title: 'Clouds Layer',
		source: new VectorSource(),
	});
};
export const drawCloud = (vectorSource) => {
	return new Draw({
		source: vectorSource,
		type: 'LineString',
		style: (feature) => {
			feature.setStyle(function () {
				if (feature.getGeometry().getType() === 'LineString') {
					return [
						new Style({
							stroke: new Stroke({
								color: feature.get('color') || '#000000',
								width: feature.get('width') || 2,
							}),
							geometry: (feature) => {
								return arc(feature.getGeometry().getCoordinates());
							},
						}),
					];
				}
			});
		},
	});
};

export const modifyCloud = (select, cvl) => {
	return new Modify({
		features: select.getFeatures(),
		insertVertexCondition: never,
		removePoint: never,
	});
};

export const selectCloud = (vectorLayer) => {
	return new Select({
		layers: [vectorLayer],
		hitTolerance: 10,
		style: (feature) => {
			if (feature.getGeometry().getType() === 'LineString') {
				return [
					new Style({
						stroke: new Stroke({
							color: feature.get('color') || '#000000',
							width: feature.get('width') || 2,
						}),
						geometry: (f) => {
							return arc(f.getGeometry().getCoordinates());
						},
					}),
					new Style({
						image: new CircleStyle({
							radius: 5,
							fill: new Fill({
								color: '#f59e0b',
							}),
							stroke: new Stroke({
								color: '#000000',
								width: 2,
							}),
						}),
						geometry: function (feature) {
							const coordinates = feature.getGeometry().getCoordinates();
							return new MultiPoint(coordinates);
						},
					}),
				];
			}
		},
	});
};

export const translateCloud = (vectorLayer) => {
	return new Translate({
		layers: [vectorLayer],
		hitTolerance: 10,
	});
};

export const addAHandle = (point, feature) => {
	const ls = new LineString(feature.getGeometry().getCoordinates());
	const pt = ls.getClosestPoint(point);
};

export const cloudDrawingStartEvent = new CustomEvent('cloud_drawing:start');
