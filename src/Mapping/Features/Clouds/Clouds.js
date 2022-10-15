import { Draw, Modify, Select, Translate } from 'ol/interaction';
import { Stroke, Style, Fill } from 'ol/style';
import { arc } from './ArcGeometry';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import CircleStyle from 'ol/style/Circle';
import { MultiPoint, LineString } from 'ol/geom';
import { never } from 'ol/events/condition';
import { distance } from 'ol/coordinate';

export const cloudVectorLayer = () => {
	return new VectorLayer({
		title: 'Zones_Nuageuses',
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

export const modifyCloud = (select) => {
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
		filter: (feature) => {
			if (feature.get('title') === 'feature_overlay_link') {
				return false;
			}
			return true;
		},
	});
};

export const addAHandle = (point, feature) => {
	const pointOnFeature = feature.getGeometry().getClosestPoint(point);
	let newCoordinates = [feature.getGeometry().getCoordinates()[0]];
	feature.getGeometry().forEachSegment((start, end) => {
		const segement = new LineString([start, end]);
		const pointOnSegement = segement.getClosestPoint(point);
		const distanceBetweenTheTwoPoint = distance(
			pointOnFeature,
			pointOnSegement
		);
		if (distanceBetweenTheTwoPoint === 0) {
			newCoordinates.push(pointOnFeature);
			newCoordinates.push(end);
		} else {
			newCoordinates.push(end);
		}
	});
	feature.getGeometry().setCoordinates(newCoordinates);
};

export const deleteAHandle = (point, feature) => {
	let newCoordinates = [];
	feature
		.getGeometry()
		.getCoordinates()
		.forEach((coord) => {
			if (distance(point, coord) >= 350000) {
				newCoordinates.push(coord);
			}
		});
	feature.getGeometry().setCoordinates(newCoordinates);
};

export const inverseFeature = (feature) => {
	feature
		.getGeometry()
		.setCoordinates(feature.getGeometry().getCoordinates().reverse());
};

export const cloudDrawingON = (map) => {
	map.getInteractions().forEach((interaction) => {
		if (interaction.get('title') === 'zone_nuageuse:draw') {
			interaction.setActive(true);
		}
	});
};

export const deleteCloudFeature = (map, layer, feature) => {
	map.removeOverlay(map.getOverlayById(feature.ol_uid));
	layer
		.getSource()
		.removeFeature(layer.getSource().getFeatureById(feature.ol_uid));
	layer.getSource().removeFeature(feature);
};
