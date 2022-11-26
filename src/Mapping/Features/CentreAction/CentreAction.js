import { Draw, Modify, Select, Translate } from 'ol/interaction';
import {
	Stroke,
	Style,
	Fill,
	RegularShape,
	Icon,
	Text as olText,
} from 'ol/style';
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
import { feature } from '@turf/turf';
import Overlay from 'ol/Overlay';
import { setSelectedFeature , setModal, setMapCoordinate} from '../../../Pages/Production/CardDrawingTools/redux/actions'



export const centreActionVectorLayer = () => {
	return new VectorLayer({
		title: 'Centre Action',
		source: new VectorSource()
	})
}
    
export const createCentreAction = (map,mapCoordinate,overlay,dispatch) => { 
        const resizer = document.getElementById("resizer")
		resizer.style.display = 'none'
		let c = document.getElementById('mnode').firstChild
		let cc = c.cloneNode(true)
		cc.className = "Resizer"
		cc.firstChild.className = "varbox content2"  
		let element = cc
		//changer la position de ce overlay and set it in selectedFeature
		overlay.setElement(element)
		overlay.setPosition(mapCoordinate)
		overlay.set('coordinates', mapCoordinate)
		let clickTimes = 0
		let timer = null
		clearTimeout(timer)
		element.onclick = (e) =>{
		//on single click
		timer = setTimeout(() => { 
			if(clickTimes === 1){
				dispatch(setSelectedFeature(overlay))
				clearTimeout(timer)
				clickTimes = 0
			}
		}, 200)
		clickTimes++
		//on double click
			if (clickTimes === 2) {
				//ask about this is it okay to dispatch values from here..?
				dispatch(setSelectedFeature(overlay))
				dispatch(setModal('centre_action'))
				dispatch(setMapCoordinate(mapCoordinate))
				clearTimeout(timer)
				clickTimes = 0
			}
		}
		map.addOverlay(overlay)
		return
};


export const modifyCentreAction = () => {
	return 
}

export const selectCentreAction = (map,overlay, resizer) => {
	map.removeOverlay(overlay)
	let element = document.getElementById("resizer")
    element.style.display = 'block'
	resizer.setPosition(overlay.get('coordinates'))
	return 
}

export const deselectCentreAction = (map,mapCoordinate,overlay,dispatch) => {
	let element = document.getElementById("resizer")
    element.style.display = "none"
	createCentreAction(map,mapCoordinate,overlay,dispatch)
	return 
}

export const centreActionDrawingON = (map) => {};

