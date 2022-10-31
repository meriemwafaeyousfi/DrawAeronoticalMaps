import * as turf from '@turf/turf';
import { D3WindBarb} from "d3-wind-barbs";
import { Point } from 'ol/geom';
import {transform} from 'ol/proj';
import {
	Style,
	Fill,
	Icon,
	Text as olText,
} from 'ol/style';



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
    windBarb.firstChild.setAttribute("transform","scale(-1,1)translate(0, 0)rotate(90)")
    if(speed !== 0){
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

export const addFlecheVent = (feature, point, vitesse, flightLevel, epaisseurSup, epaisseurInf, affich, affichEp, type) =>{
  if(!feature) return
    let start, end = null
    let p1 = transform(feature.getGeometry().getCoordinates()[0],'EPSG:3857', 'EPSG:4326')
    let p2 = transform(point,'EPSG:3857', 'EPSG:4326')
    let newCoor = []
    let c = feature.getGeometry().getCoordinates()
        let i =  c.findIndex(elt => ((elt[0] ===  point[0] ) && (elt[1] ===  point[1])))
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
    console.log(line2)
    if(p1[0]===p2[0] && p1[1]===p2[1]){
        start = point
        let myPoint1 = turf.along(line2, 10);
        let myPoint2 = turf.along(line2, 20);
        point = transform(myPoint1.geometry.coordinates,'EPSG:4326', 'EPSG:3857')
        end = transform(myPoint2.geometry.coordinates,'EPSG:4326', 'EPSG:3857')
    }else{ 
        let b2 = transform(c[c.length-1],'EPSG:3857', 'EPSG:4326')
        let ll1 = {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: [p2,b2]
            }
          }
        let tt1 = turf.bezierSpline(ll1);
        let myPoint1 = turf.along(tt1,100);
        end = transform(myPoint1.geometry.coordinates,'EPSG:4326', 'EPSG:3857')
        
    }
    let cos = calculateCos(point,end)
    let tan = calculateTan( c[i+1] , c[i-1])
    let x   = c[i+1][0] - c[i-1][0]
    let y   = c[i+1][1] - c[i-1][1]
    let orientation = true
    if(( x < 0 && y < 0) || (x < 0 && y > 0)){
      orientation = false
    }
    let deg = 0
    if(tan > 0){
      deg = - Math.acos(cos) ;
    }else{
      if(tan !==  0){
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
			text: 'FL ' + flightLevel.toString() + '\n'+ (((affichEp !== 'cache') && (epaisseurInf>0 || epaisseurSup>0)) ?  epaisseurInf+ '/'+ epaisseurSup : '')  ,
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

