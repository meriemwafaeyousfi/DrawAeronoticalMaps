import { MultiPoint, Point } from 'ol/geom';
import { Draw, Modify, Select, Translate } from 'ol/interaction';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Fill, Stroke, Style, Text } from 'ol/style';
import { never, altKeyOnly } from 'ol/events/condition';
import CircleStyle from 'ol/style/Circle';
import { catGeometryFunction } from './CATGeometry';
import { getCenter } from 'ol/extent';

export const CATVectorLayer = () => {
	return new VectorLayer({
		title: 'CAT Layer',
		source: new VectorSource(),
		style: (feature) => {
			if (feature.getGeometry().getType() === 'Polygon') {
				return [
					new Style({
						stroke: new Stroke({
							color: '#ff0000',
							width: 2,
							lineDash: [8],
						}),
						geometry: catGeometryFunction(
							feature.getGeometry().getCoordinates()
						),
					}),
					new Style({
						geometry: new Point(getCenter(feature.getGeometry().getExtent())),
						text: new Text({
							text: feature.get('numCat').toString(),
							font: '24px "Roboto", Helvetica Neue, Helvetica, Arial, sans-serif',
							fill: new Fill({ color: 'black' }),
							stroke: new Stroke({ color: 'white', width: 2 }),
							backgroundFill: new Fill({ color: 'white' }),
							backgroundStroke: new Stroke({ color: 'black', width: 2 }),
						}),
					}),
				];
			}
		},
	});
};

export const drawCAT = (vectorSource) => {
	return new Draw({
		source: vectorSource,
		type: 'Polygon',
		style: (feature) => {
			if (feature.getGeometry().getType() === 'Polygon') {
				return [
					new Style({
						stroke: new Stroke({
							color: '#ff0000',
							width: 2,
							lineDash: [8],
						}),
						geometry: catGeometryFunction(
							feature.getGeometry().getCoordinates()
						),
					}),
				];
			}
		},
	});
};

export const modifyCAT = (select) => {
	return new Modify({
		features: select.getFeatures(),
		insertVertexCondition: never,
		removePoint: altKeyOnly,
		pixelTolerance: 10,
	});
};

export const selectCAT = (vectorLayer) => {
	return new Select({
		layers: [vectorLayer],
		hitTolerance: 10,
		style: (feature) => {
			if (feature.getGeometry().getType() === 'Polygon') {
				return [
					new Style({
						stroke: new Stroke({
							color: '#ff0000',
							width: 2,
							lineDash: [8],
						}),
						geometry: catGeometryFunction(
							feature.getGeometry().getCoordinates()
						),
					}),
					new Style({
						geometry: new Point(getCenter(feature.getGeometry().getExtent())),
						text: new Text({
							text: feature.get('numCat').toString(),
							font: '24px "Roboto", Helvetica Neue, Helvetica, Arial, sans-serif',
							fill: new Fill({ color: 'black' }),
							stroke: new Stroke({ color: 'white', width: 2 }),
							backgroundFill: new Fill({ color: 'white' }),
							backgroundStroke: new Stroke({ color: 'black', width: 2 }),
						}),
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
							const coordinates = feature.getGeometry().getCoordinates()[0];
							return new MultiPoint(coordinates);
						},
					}),
				];
			}
		},
	});
};

export const translateCAT = (vectorLayer) => {
	return new Translate({
		layers: [vectorLayer],
		hitTolerance: 10,
	});
};

export const CATDrawingON = (map) => {
	console.log('called');
	map.getInteractions().forEach((interaction) => {
		if (interaction.get('title') === 'CAT:draw') {
			console.log('found');
			interaction.setActive(true);
		}
	});
};
