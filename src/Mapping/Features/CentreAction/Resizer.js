import Overlay from 'ol/Overlay';

export const createResizer = (map, mapCoordinate) =>{
    let element = document.getElementById("resizer")
    let overlayElt = new Overlay({
            position: mapCoordinate,
            element: element,
            stopEvent : false
          })
	//overlayElt.set('feature_type','centre_action')
    map.addOverlay(overlayElt)
	return overlayElt
};

export const displayResizer = (resizerOverlay, mapCoordinate) =>{
	let element = document.getElementById("resizer")
	element.style.display = 'block'
	resizerOverlay.setPosition(mapCoordinate)
	return 
}
export const updateResizer = (resizerOverlay) =>{
    
}