import * as turf from '@turf/turf';
import { D3WindBarb, ConversionFactors } from "d3-wind-barbs";
import { Point } from 'ol/geom';
import { fromLonLat, transform , toLonLat} from 'ol/proj';
import {
	Stroke,
	Style,
	Fill,
	RegularShape,
	Icon,
	Text as olText,
} from 'ol/style';

const fill = new Fill({ color: '#0000FF', opacity: 1 });
const stroke = new Stroke({
	color: '#0000FF',
	width: 4,
});

function createWindBarb(speed , fl, orientation){
    const windBarb = new D3WindBarb(speed,fl,{
      triangle: {
        fill: "#0000FF",
        stroke: "#0000FF",
        className: "wind-barb-triangle"
      },  bar: {
        fullBarClassName: "",
        shortBarClassName: "",
        stroke: "#0000FF",
      },  
    }).draw()

    windBarb.setAttribute('xmlns',  "http://www.w3.org/2000/svg")
    windBarb.setAttribute('overflow', "visible")
    windBarb.setAttribute('viewBox', "0 0 80 45")
    //let zoom = map.getView().getZoom()
    //let h = (zoomMap != 0) ? ((zoomMap * 75) / 4) : 75
    let h =  75
    windBarb.setAttribute('height', Math.round(h))
    //let w = (zoomMap != 0) ? ((zoomMap * 50) / 4) : 50
    let w = 50
    windBarb.setAttribute('width', Math.round(w))
    let x = windBarb.firstChild.getAttribute("transform")
    windBarb.firstChild.setAttribute("transform","scale(-1,1)translate(0, 0)rotate(90)")
    if(speed != 0){
        const line = windBarb.getElementsByClassName("wind-barb-root")[0]
        const old = (windBarb.firstChild).firstChild
        if(old){
          old.parentElement.removeChild(old)}
          }
   
    return windBarb
}

function calculateCos(center, point){
  let cos = 0;
  let a = Math.abs(center[0] - point[0]);
  let b = Math.sqrt(Math.pow(point[1]-center[1],2) + Math.pow(point[0]-center[0],2));
  cos = a/b;
  return cos;
}

//calculate the tangante
function calculateTan(point1, point2){
   return ((point1[1]-point2[1])/(point1[0]-point2[0]))
}

export const addFlecheVent = (feature, point, vitesse, type) =>{
  if(!feature) return
    let start, end = null
    let p1 = transform(feature.getGeometry().getCoordinates()[0],'EPSG:3857', 'EPSG:4326')
    let p2 = transform(point,'EPSG:3857', 'EPSG:4326')
    let newCoor = []
    feature.getGeometry().getCoordinates().forEach(point => {
      newCoor.push(transform(point,'EPSG:3857', 'EPSG:4326'))
    })
    let line1 = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: newCoor
        }
      }
    let line2 = turf.bezierSpline(line1);
    if(p1[0]===p2[0] && p1[1]===p2[1]){
        start = point
        let myPoint1 = turf.along(line2, 10);
        let myPoint2 = turf.along(line2, 20);
        point = transform(myPoint1.geometry.coordinates,'EPSG:4326', 'EPSG:3857')
        end = transform(myPoint2.geometry.coordinates,'EPSG:4326', 'EPSG:3857')
    }else{
        let d = turf.distance(p1, p2 );
        let myPoint1 = turf.along(line2, d+10);
        let myPoint2 = turf.along(line2, d-10);
        start = transform(myPoint2.geometry.coordinates,'EPSG:4326', 'EPSG:3857')
        end = transform(myPoint1.geometry.coordinates,'EPSG:4326', 'EPSG:3857')
    }
    let cos = calculateCos(point,end)
    let tan = calculateTan( end, start)
    let x   = end[0] - start[0]
    let y   = end[1] - start[1]
    let orientation = true
    if(( x < 0 && y < 0) || (x < 0 && y > 0)){
      orientation = false
    }
    let deg = 0
    if(tan > 0){
      deg = - Math.acos(cos) ;
    }else{
      if(tan !=  0){
      deg =  Math.acos(cos) ;
    }else{
      deg = 0;
    }
    }

    if(!orientation){
      deg = deg + Math.PI
    }
    const windBarb = createWindBarb(vitesse,90,orientation)  
    const style = new Style({
			geometry: new Point(point),
			text : new olText({
			font: 'bold 16px/1 bold Arial',
			text: 'FL / ' ,
			rotation: deg,
			offsetY  : 30,
			fill: new Fill({
				color: 'black' // change it after
			}),
			}),
			image: new Icon (({
			rotation:  deg+ (Math.PI/2),
			anchor :  [0.48, 0.85] ,
			src: 'data:image/svg+xml;charset=utf-8,' + escape(windBarb.outerHTML), 
				}))
			})

    return style
}
export const deleteFlecheVent = () =>{
    return
}

