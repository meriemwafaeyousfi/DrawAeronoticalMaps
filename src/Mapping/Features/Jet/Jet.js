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
import { feature, point } from '@turf/turf';
import { addFlecheVent } from "./FlecheVent"

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
	const styles4 = []
	if(feature.get('fleches')){
		feature.get('fleches').forEach((elt)=> { 
			styles4.push(addFlecheVent(feature, feature.getGeometry().getCoordinates()[elt.index], elt.vitesse, 'fleche'))
		})
	}
	return [styles2, styles].concat(styles4);
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
    //styles1 c'est le style de fleche d'orientation
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
	//styles2 c'est le style de JET
	const styles2 = new Style({
		stroke: new Stroke({
			color: '#0000FF',
			width: 4.5,
		}),
		geometry: (feature) => {
			return arc(feature.getGeometry().getCoordinates())
		},
	});

	//styles4 c'est le style des fleches de vent
	const styles4 = []
	feature.get('fleches').forEach((elt)=> { 
		styles4.push(addFlecheVent(feature, feature.getGeometry().getCoordinates()[elt.index], elt.vitesse, 'fleche'))
    })

	//styles3 c'est le styles des poingnés
	const styles3 = new Style({
		image: new CircleStyle({
			radius: 5,
			fill: new Fill({
				color: '#0000FF',
			}),
		}), 
		geometry: function (feature) {
			// in the coordinates delete those which are fleches de vent
			let coordinates = feature.getGeometry().getCoordinates()
			let fleches = feature.get('fleches')
			let flechesInd = []
			fleches.forEach((elt)=>{
				flechesInd.push(elt.index)

			})
			let newCoords = coordinates.filter((value, index) => {
				return !flechesInd.includes(index)
			})
			newCoords.pop()
			return new MultiPoint(newCoords)
		},
	})
	
	return [styles3, styles2, styles1].concat(styles4);
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

export const addJetAHandle = (point, feature) => {
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
	//change the position of fleches-Vent
	let fleches = feature.get('fleches')
    if(fleches){
		newCoordinates.forEach((elt, index)=>{
			let i = fleches.findIndex(fleche => ((fleche.point[0] ===  elt[0] ) && (fleche.point[1] ===  elt[1])))
			if(i != -1){
				fleches[i].index = index
			}
		})
	feature.set('fleches', fleches)
	}
	feature.getGeometry().setCoordinates(newCoordinates);
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
