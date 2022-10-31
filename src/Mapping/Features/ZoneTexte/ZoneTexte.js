import { Draw, Modify, Select, Translate } from 'ol/interaction';
import {
    Circle,
	Stroke,
	Style,
	Fill,
	Icon,
    RegularShape,
	Text as olText,
} from 'ol/style';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import CircleStyle from 'ol/style/Circle';
import { Point, MultiPoint, LineString, Polygon, GeometryCollection} from 'ol/geom';
import { style } from '@mui/system';
import * as turf from '@turf/turf';
import {
	never,
	altKeyOnly,
	click,
	shiftKeyOnly,
	doubleClick,
} from 'ol/events/condition';
import Overlay from 'ol/Overlay';   

export const zoneTexteVectorLayer = () => {
	return new VectorLayer({
		title: 'Zone de Texte',
		source: new VectorSource(),
        // style :  (feature) => {
        //     return (
        //         new Style({
        //                   text: new olText({
        //                     font: 'bold 16px/1 bold Arial',
        //                     text: feature.get('size').toString(),
        //                     offsetY  : 0,
        //                     fill: new Fill({
        //                       color: 'black'
        //                     }),
        //                  })
        //     })
        //     )
        // }
  
	});
};

export const drawZoneTexte = (vectorSource) => {
	return new Draw({
		source: vectorSource,
		type: 'Point',
	});
};

export const selectZoneTexte = (vectorLayer) => {
	return new Select();
};

export const translateZoneTexte = (vectorLayer) => {
	return new Translate({
		layers: [vectorLayer],
		hitTolerance: 10,
	});
};

export const createEditorText = (map, feature) =>{
    let div = document.createElement("div");  
    div.contentEditable = "true";
    div.innerHTML = '';
    div.style.borderStyle = "solid"; //delete it and see the diffrence
    div.style.outline = '0.2px dashed #000000';
    div.style.borderWidth = "0px"; //delete it and see the diffrence
    div.style.minWidth = "40px";
    div.id = "text";
    div.style.resize= "vertical";
    div.style.overflow = "auto";
    div.style.whiteSpace= "nowrap";
    div.oninput = (e) => {feature.set('text',(e.currentTarget.innerHTML))};  
    const editorOverlay = new Overlay({
                  id: feature.ol_uid,
                  position: feature.getGeometry().getCoordinates(),
                  element: div,
                  stopEvent: false,
                  dragging: false
                });
    map.addOverlay(editorOverlay);
    }


export const zoneTexteDrawingON = (map) => {
	map.getInteractions().forEach((interaction) => {
		if (interaction.get('title') === 'zone_texte:draw') {
			interaction.setActive(true);
		}
	});
};
