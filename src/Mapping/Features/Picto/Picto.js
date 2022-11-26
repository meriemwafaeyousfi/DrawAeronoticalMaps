import { Point } from 'ol/geom';
import { Draw, Modify, Select, Translate } from 'ol/interaction';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Style } from 'ol/style';
import { never, altKeyOnly } from 'ol/events/condition';
import Icon from 'ol/style/Icon';
import { pictoGeometryFunction } from './PictoGeometry';
import { fromLonLat, toLonLat } from 'ol/proj';
import { api } from 'axiosConfig';
import { Feature } from 'ol';

export const pictoVectorLayer = () => {
	return new VectorLayer({
		title: 'picto Layer',
		source: new VectorSource(),
		style: (feature) => {
			if (feature.getGeometry().getType() === 'Point') {
				return [
					new Style({
						image: new Icon({
							scale: feature.get('scale') || 1,
							src: '/Icons/Pictos/' + feature.get('name_picto') + '.png',
						}),
						geometry: pictoGeometryFunction(
							feature.getGeometry().getCoordinates()
						),
					}),
				];
			}
		},
	});
};

export const drawPicto = (vectorSource) => {
	return new Draw({
		source: vectorSource,
		type: 'Point',
		style: (feature) => {
			if (feature.getGeometry().getType() === 'Point') {
				return [
					new Style({
						geometry: pictoGeometryFunction(
							feature.getGeometry().getCoordinates()
						),
					}),
				];
			}
		},
	});
};

export const modifyPicto = (select) => {
	return new Modify({
		features: select.getFeatures(),
		insertVertexCondition: never,
		removePoint: altKeyOnly,
		pixelTolerance: 10,
	});
};
export const selectPicto = (vectorLayer) => {
	return new Select({
		layers: [vectorLayer],
		hitTolerance: 10,
		style: (feature) => {
			if (feature.getGeometry().getType() === 'Point') {
				return [
					new Style({
						image: new Icon({
							scale: feature.get('scale') || 1,
							src: '/Icons/Pictos/' + feature.get('name_picto') + '.png',
						}),
						geometry: pictoGeometryFunction(
							feature.getGeometry().getCoordinates()
						),
					}),
				];
			}
		},
	});
};

export const translatePicto = (vectorLayer) => {
	return new Translate({
		layers: [vectorLayer],
		hitTolerance: 10,
	});
};

export const pictoDrawingON = (map) => {
	map.getInteractions().forEach((interaction) => {
		if (interaction.get('title') === 'picto:draw') {
			interaction.setActive(true);
		}
	});
};

export const savePicto = (feature, cardid) => {
	let LongLatCoords = toLonLat(feature.getGeometry().getCoordinates());

	const DataToSend = {
		typeSymboleTemsi: feature.get('name_picto'),
		scale: feature.get('scale'),
		longitudeSymbole: LongLatCoords[0],
		latitudeSymbole: LongLatCoords[1],
		carte_produite: cardid,
	};
	api
		.post('objet/symboleTemsi/', DataToSend)
		.then((res) => {
			feature.set('featureID', res.data.idObjet);
			console.log(res);
		})
		.catch((err) => {
			console.log(err);
		});
};

export const getPictos = (pictos, vectorLayer) => {
	pictos.forEach((picto) => {
		const XYCoords = fromLonLat([
			picto.longitudeSymbole,
			picto.latitudeSymbole,
		]);
		const newFeature = new Feature();
		newFeature.set('feature_type', 'picto');
		newFeature.set('name_picto', picto.typeSymboleTemsi);
		newFeature.set('scale', picto.scale);
		newFeature.setGeometry(new Point(XYCoords));
		vectorLayer.getSource().addFeature(newFeature);
	});
};

export const updateLine = (feature, cardid) => {};

export const deleteLine = (feature, layer) => {
	api
		.delete(`objet/zonenuageuse/${feature.get('featureID')}/`)
		.then((res) => {
			console.log(res);
			layer.getSource().removeFeature(feature);
		})
		.catch((err) => {
			console.log(err);
		});
};
