import { Draw, Modify, Select, Translate } from 'ol/interaction';
import { Stroke, Style, Fill, RegularShape, Circle} from 'ol/style';
import { arc } from './JetGeometry';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import CircleStyle from 'ol/style/Circle';
import { Point, MultiPoint, LineString, SimpleGeometry } from 'ol/geom';
import {
	altKeyOnly,
	click,
	shiftKeyOnly,
	doubleClick,
} from 'ol/events/condition';
import { distance } from 'ol/coordinate';
import { addFlecheVent, createCassure } from './FlecheVent';
import { api } from 'axiosConfig';
import { transform } from 'ol/proj';
import { adjustCoords } from 'Helpers/Function';
import Feature from 'ol/Feature';
import { selectType } from 'Helpers/Function';
import  "ol-ext/render/Cspline"
import {getArea, getLength} from 'ol/sphere';

const fill = new Fill({ color: '#0000FF', opacity: 1 });

const stroke = new Stroke({
	color: '#0000FF',
	width: 4,
});

function stylefun(feature) {
    var geom = feature.getGeometry();
    var csp = geom.cspline({ tension: 0.5, pointsPerSeg: 15 });
    var lineStyle = new Style({
      stroke: new Stroke({
        color: feature.get("line_color"),
        width: feature.get("line_width")
      }),
      geometry: csp
    });
    var point1 = new Style({
      image: new Circle({
        stroke: new Stroke({ color: "blue", width: 1 }),
        radius: 1
      }),
      geometry: new MultiPoint(csp.getCoordinates())
    });
    var point2 = new Style({
      image: new Circle({
        stroke: new Stroke({ color: "red", width: 4 }),
        radius: 2
      }),
      geometry: new MultiPoint(geom.getCoordinates())
    });
    return [lineStyle, point1, point2];
  }

export const jetVectorLayer = (map) => {
	return new VectorLayer({
		title: 'Jet',
		source: new VectorSource(),
		style: (feature)=>{
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
			let geom = feature.getGeometry();
			let csp = geom.cspline({ tension: 0.5, pointsPerSeg: 15 });
			geom.forEachSegment((start, end) => {
				const indexStart = csp.getCoordinates().findIndex((coord)=>((coord[0]===start[0])&&(coord[1]===start[1]) ))
				const indexEnd = csp.getCoordinates().findIndex((coord)=>((coord[0]===end[0])&&(coord[1]===end[1]) ))
				const startLongLat = transform(start, 'EPSG:3857', 'EPSG:4326');
				const endLongLat = transform(end, 'EPSG:3857', 'EPSG:4326');
				if(feature.get('fleches')){
					const indexFlecheStart = feature.get('fleches').findIndex(
						(fleche) => fleche.longitudeFV.toFixed(2) === startLongLat[0].toFixed(2) && fleche.latitudeFV.toFixed(2) === startLongLat[1].toFixed(2)
					);	
					const indexFlecheEnd = feature.get('fleches').findIndex(
						(fleche) => fleche.longitudeFV.toFixed(2) === endLongLat[0].toFixed(2) && fleche.latitudeFV.toFixed(2) === endLongLat[1].toFixed(2)
					);	
					const segment = csp.getCoordinates().slice(indexStart, indexEnd+1)
					const tempGeom = new LineString(segment)
					const lengthSegment = Math.round((tempGeom.getLength()/ 1000) * 100) / 100 //en km
					
					if(indexFlecheStart !==-1 && indexFlecheEnd !==-1){
						feature.get('fleches')[indexFlecheStart].espace=  lengthSegment
					}
			}
				
			})
			return csp;
		},
	});
	const styles4 = [];
	feature.get('fleches').forEach((fleche, id) => {
			const point = feature.getGeometry().getCoordinates()[fleche.index];
			const longLat = transform(point, 'EPSG:3857', 'EPSG:4326');
			fleche.latitudeFV = longLat[1];
			fleche.longitudeFV = longLat[0];
			feature.get('fleches')[id] = fleche;

			styles4.push(
				addFlecheVent(
					map,
					feature,
					point,
					fleche
				)
			);
	
	});
	return [styles2, styles].concat(styles4);
		},
	});
};

export const drawJet = (vectorSource) => {
	return new Draw({
		source: vectorSource,
		type: 'LineString',
		style: (feature) => {
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
					let geom = feature.getGeometry();
    				let csp = geom.cspline({ tension: 0.5, pointsPerSeg: 15 });
					return csp;
				},

			});

			return [styles2, styles];
		},
	});
};

export const modifyJet = (select) => {
	return new Modify({
		features: select.getFeatures(),
		insertVertexCondition: shiftKeyOnly,
		removePoint: altKeyOnly,
	});
};

export const selectJet = (map, vectorLayer) => {
	return new Select({
		layers: [vectorLayer],
		condition: selectType,
		style: (feature) => {
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
					let geom = feature.getGeometry();
					let csp = geom.cspline({ tension: 0.5, pointsPerSeg: 15 });
					geom.forEachSegment((start, end) => {
						const indexStart = csp.getCoordinates().findIndex((coord)=>((coord[0]===start[0])&&(coord[1]===start[1]) ))
						const indexEnd = csp.getCoordinates().findIndex((coord)=>((coord[0]===end[0])&&(coord[1]===end[1]) ))
						const startLongLat = transform(start, 'EPSG:3857', 'EPSG:4326');
						const endLongLat = transform(end, 'EPSG:3857', 'EPSG:4326');
						if(feature.get('fleches')){
							const indexFlecheStart = feature.get('fleches').findIndex(
								(fleche) => fleche.longitudeFV.toFixed(2) === startLongLat[0].toFixed(2) && fleche.latitudeFV.toFixed(2) === startLongLat[1].toFixed(2)
							);	
							const indexFlecheEnd = feature.get('fleches').findIndex(
								(fleche) => fleche.longitudeFV.toFixed(2) === endLongLat[0].toFixed(2) && fleche.latitudeFV.toFixed(2) === endLongLat[1].toFixed(2)
							);	
							const segment = csp.getCoordinates().slice(indexStart, indexEnd+1)
							const tempGeom = new LineString(segment)
							const lengthSegment = Math.round((tempGeom.getLength()/ 1000) * 100) / 100 //en km
							if(indexFlecheStart !==-1 && indexFlecheEnd !==-1){
								console.log(lengthSegment)
								feature.get('fleches')[indexFlecheStart].espace=  lengthSegment
							}
					}
						
					})
			return csp;
				},
			});

			//styles4 c'est le style des fleches de vent
			const styles4 = [];
			feature.get('fleches').forEach((fleche, id) => {
					
				const point = feature.getGeometry().getCoordinates()[fleche.index];
				const longLat = transform(point, 'EPSG:3857', 'EPSG:4326');
				fleche.latitudeFV = longLat[1];
				fleche.longitudeFV = longLat[0];
				feature.get('fleches')[id] = fleche;
				styles4.push(
					addFlecheVent(
						map,
						feature,
						point,
						fleche
					)
				);
					
			});

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
					let coordinates = feature.getGeometry().getCoordinates();
					let fleches = feature.get('fleches');
					let flechesInd = [];
					fleches.forEach((elt) => {
						flechesInd.push(elt.index);
					});
					let newCoords = coordinates.filter((value, index) => {
						return !flechesInd.includes(index);
					});
					newCoords.pop();
					return new MultiPoint(newCoords);
				},
			});
			return [styles3, styles2, styles1].concat(styles4);
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
	let fleches = feature.get('fleches');
	if (fleches) {
		fleches.forEach((fleche, index) => {
			const fLongLat = transform(
				[fleche.longitudeFV, fleche.latitudeFV],
				'EPSG:4326',
				'EPSG:3857'
			);
			let i = newCoordinates.findIndex(
				(elt) => fLongLat[0].toFixed(2) === elt[0].toFixed(2) && fLongLat[1].toFixed(2) === elt[1].toFixed(2)
			);
			if (i !== -1) {
				fleches[index].index = i;
			}
		});
		feature.set('fleches', fleches);
	}
	feature.getGeometry().setCoordinates(newCoordinates);
};

export const deleteJetAHandle = (point, feature) => {
	let newCoordinates = [];
	feature
		.getGeometry()
		.getCoordinates()
		.forEach((coord) => {
			if (distance(point, coord) >= 350000) {
				newCoordinates.push(coord);
			}
		});

	//change the position of fleches-Vent
	let fleches = feature.get('fleches');
	let newFleches = [];
	if (fleches) {
		fleches.forEach((fleche, index) => {
			const fLongLat = transform(
				[fleche.longitudeFV, fleche.latitudeFV],
				'EPSG:4326',
				'EPSG:3857'
			);
			let i = newCoordinates.findIndex(
				(elt) => fLongLat[0].toFixed(2) === elt[0].toFixed(2) && fLongLat[1].toFixed(2) === elt[1].toFixed(2)
			);
			console.log(i)
			if (i !== -1) {
				fleche.index = i;
				newFleches.push(fleche);
			}
		});
		feature.set('fleches', newFleches);
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

export const saveJet = (feature, cardid) => {
	let LongLatCoords = [];
	feature
		.getGeometry()
		.getCoordinates()
		.forEach((coord) => {
			const longLat = transform(coord, 'EPSG:3857', 'EPSG:4326');
			LongLatCoords.push(longLat);
		});
	const dataToSend = {
		carte_produite: cardid,
		poignees: LongLatCoords,
	};
	api
		.post('objet/jet/', dataToSend)
		.then((res) => {
			feature.set('featureID', res.data.idObjet);
			console.log(res);
		})
		.catch((err) => {
			console.log(err);
		});
};


//calculate the distance between two points
function distance1(p1, p2) {
	let a = p1[0] - p2[0];
	let b = p1[1] - p2[1];
	return Math.sqrt( Math.pow(a,2) + Math.pow(b,2));
  }

export const getJet = (map,jets, vectorLayer) => {

	jets.forEach((jet) => {
		let XYCoords = [];
		let aj = jet.poignees;
		let flechePrec = null;
		
		aj.forEach((poignee) => {
			XYCoords = [...XYCoords, transform(poignee, 'EPSG:4326', 'EPSG:3857')];
		});

		jet.fleches_vent.forEach((fleche , id) => {
			let dis = 0
			if((jet.fleches_vent.length-1) >= id+1){
				dis = distance1([jet.fleches_vent[id+1].longitudeFV,jet.fleches_vent[id+1].latitudeFV], [fleche.longitudeFV,fleche.latitudeFV])
			}
			if(flechePrec && dis>0 && dis<((fleche.vitesse*5)/50)){
			if((Math.trunc(flechePrec.vitesse) === Math.trunc(fleche.vitesse-20)) || (Math.trunc(flechePrec.vitesse) === Math.trunc(fleche.vitesse+20))){
				//fleche.affichage = 'cassure'
				//console.log(dis)

			}
		}
			fleche.index = jet.poignees.findIndex((elt) =>elt[0] === fleche.longitudeFV && elt[1] === fleche.latitudeFV);
			fleche.flecheID = fleche.idObjet
			fleche.espace = null
			flechePrec = fleche
		});
		let geometry2 = new LineString(XYCoords);
		const newFeature = new Feature();
		newFeature.set('feature_type', 'jet');
		const geom = new LineString(XYCoords)
		newFeature.setGeometry(geom);
		newFeature.set('fleches',  jet.fleches_vent);
		newFeature.set('featureID', jet.idObjet);
		vectorLayer.getSource().addFeature(newFeature);
	});
};

export const updateJet = (feature, cardid) => {
	let LongLatCoords = [];
	feature
		.getGeometry()
		.getCoordinates()
		.forEach((coord) => {
			const longLat = transform(coord, 'EPSG:3857', 'EPSG:4326');
			LongLatCoords.push(longLat);
		});
	const dataToSend = {
		carte_produite: cardid,
		poignees: LongLatCoords,
	};
	api
		.put(`objet/jet/${feature.get('featureID')}/`, dataToSend)
		.then((res) => {
			console.log(res);
		})
		.catch((err) => {
			console.log(err);
		});
};

export const deleteJet = (feature, layer) => {
	api
		.delete(`objet/jet/${feature.get('featureID')}/`)
		.then((res) => {
			console.log(res);
			layer.getSource().removeFeature(feature);
		})
		.catch((err) => {
			console.log(err);
		});
};



export const saveFlecheVent = (feature, cardid, fleche) => {
  const dataToSend = {
	  carte_produite: cardid,
	  latitudeFV: fleche.latitudeFV,
	  longitudeFV: fleche.longitudeFV,
	  vitesse: fleche.vitesse,
	  niveau: fleche.flightLevel,
	  affichage: fleche.affich,
	  epaisseur_inf: fleche.epInf,
	  epaisseur_sup: fleche.epSup,
	  affichage_epaisseur: fleche.affichEp,
	  jet: feature.get('featureID')
	  };
	
	  api
		  .post('objet/flecheVent/', dataToSend)
		  .then((res) => {
	
            const i = feature.get('fleches').findIndex(
				(elt) => fleche.longitudeFV === elt.longitudeFV && fleche.latitudeFV === elt.latitudeFV
			);
		   	feature.get('fleches')[i].flecheID = res.data.idObjet
			  //feature.set('featureID', res.data.idObjet);
			  console.log(res);
		  })
		  .catch((err) => {
			  console.log(err);
		  });
  };
  
  
  export const updateFlecheVent = (feature,flecheid,fleche_data) => {
	api
	.put(`objet/flecheVent/${flecheid}/`, fleche_data)
	.then((res) => {
	  console.log(res);
	})
	.catch((err) => {
	  console.log(err);
	});
  
  };
  
  
