import { Draw, Modify, Select, Translate } from 'ol/interaction';
import { Stroke, Style, Fill, RegularShape,Icon, Text as olText  } from 'ol/style'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import CircleStyle from 'ol/style/Circle'
import { Point,MultiPoint, LineString } from 'ol/geom'
import { never,altKeyOnly, click, shiftKeyOnly, doubleClick } from 'ol/events/condition'
import { distance } from 'ol/coordinate'
import { feature } from '@turf/turf';
import Overlay from 'ol/Overlay';

export const centreActionVectorLayer = () => {
	return new VectorLayer({
		title: 'Centre Action',
		source: new VectorSource()
	});
};
    
export const drawCentreAction = (vectorSource) => { 
	return 
};

export const modifyCentreAction = (select, cvl) => {
	return 
};

export const selectCentreAction = (vectorLayer) => {
	return 
};

export const centreActionDrawingON = (map) => {
	let element = document.getElementById("resizer")
    let overlayElt = new Overlay({
          //  position: props.mapCoord,
            element: element,
            stopEvent : false
          })
    map.addOverlay(overlayElt)
};