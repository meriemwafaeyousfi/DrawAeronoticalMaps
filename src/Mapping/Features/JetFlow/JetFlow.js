import { LineString, MultiPoint } from 'ol/geom';
import { Draw, Modify, Select, Translate } from 'ol/interaction';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Fill, Stroke, Style } from 'ol/style';
import { getCoords, bezierSpline, lineString } from '@turf/turf';
import { never, altKeyOnly } from 'ol/events/condition';
import CircleStyle from 'ol/style/Circle';

export const jetFlowDrawingStartEvent = new CustomEvent('courant_jet:start');

export const jetFlowVectorLayer = () => {
	return new VectorLayer({
		title: 'Jet Flow Layer',
		source: new VectorSource(),
	});
};

export const drawJetFlow = (vectorSource) => {
	return new Draw({
		source: vectorSource,
		type: 'LineString',
		style: (feature) => {
			feature.setStyle([
				new Style({
					stroke: new Stroke({
						color: 'black',
						width: 7,
					}),
					geometry: () => {
						return new LineString(
							getCoords(
								bezierSpline(lineString(feature.getGeometry().getCoordinates()))
							)
						);
					},
				}),
				new Style({
					stroke: new Stroke({
						color: 'white',
						width: 4,
					}),
					geometry: () => {
						return new LineString(
							getCoords(
								bezierSpline(lineString(feature.getGeometry().getCoordinates()))
							)
						);
					},
				}),
			]);
		},
	});
};

export const modifyJetFlow = (select) => {
	return new Modify({
		features: select.getFeatures(),
		insertVertexCondition: never,
		removePoint: altKeyOnly,
		pixelTolerance: 10,
	});
};

export const selectJetFlow = (vectorLayer) => {
	return new Select({
		layers: [vectorLayer],
		hitTolerance: 10,
		style: (feature) => {
			if (feature.getGeometry().getType() === 'LineString') {
				return [
					new Style({
						stroke: new Stroke({
							color: 'black',
							width: 2,
						}),
						geometry: () => {
							return new LineString(
								getCoords(
									bezierSpline(
										lineString(feature.getGeometry().getCoordinates())
									)
								)
							);
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

export const translateJetFlow = (vectorLayer) => {
	return new Translate({
		layers: [vectorLayer],
		hitTolerance: 10,
	});
};

export const jetFlowDrawingON = (map) => {
	map.getInteractions().forEach((interaction) => {
		if (interaction.get('title') === 'courant_jet:draw') {
			interaction.setActive(true);
		}
	});
};
