import { Draw, Modify, Select } from 'ol/interaction';
import { Stroke, Style, Fill } from 'ol/style';
import { arc } from './ArcGeometry';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import CircleStyle from 'ol/style/Circle';
import { MultiPoint } from 'ol/geom';
import { doubleClick, never } from 'ol/events/condition';

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

export const cloudVectorLayer = () => {
	return new VectorLayer({
		title: 'Clouds Layer',
		source: new VectorSource(),
	});
};

export const modifyCloud = (select) => {
	return new Modify({
		features: select.getFeatures(),
		insertVertexCondition: never,
		removePoint: never,
		pixelTolerance: 10,
	});
};

export const selectCloud = (vectorLayer) => {
	return new Select({
		layers: [vectorLayer],
		hitTolerance: 10,
		condition: doubleClick,
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

export const cloudDrawingStartEvent = new CustomEvent('cloud_drawing:start');
