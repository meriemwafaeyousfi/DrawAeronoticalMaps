import * as turf from '@turf/turf';
import { D3WindBarb} from "d3-wind-barbs";
import { Point } from 'ol/geom';
import {transform} from 'ol/proj';
import { LineString} from 'ol/geom';
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


//calculate the distance between two points
function distance1(p1, p2) {
  let a = p1[0] - p2[0];
  let b = p1[1] - p2[1];
  return Math.sqrt( Math.pow(a,2) + Math.pow(b,2));
}


//calculate distance between the point and the list of coordinates 
/**and return the index of the closest coordinate to the point**/
function closestPoint(coordinates, point){
  let distances = [];
  let distance = 0;
  let min = 0;
  for (let i = 0; i < coordinates.length; i++) {
    if(coordinates[i] && ((coordinates[i][0] != point[0])&& (coordinates[i][1] != point[1]))){
    distance = distance1(point, coordinates[i]);
    distances.push(distance);
    }else{
      distances.push(Math.pow(10, 10));
    }
  }
  min = Math.min.apply(null, distances);
  return {'index' : distances.indexOf(min), 'distance' : min};
}

export const addFlecheVent = (feature, point, vitesse, flightLevel, epaisseurSup, epaisseurInf, affich, affichEp, type) =>{
  if(!feature) return
     let line1 = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: feature.getGeometry().getCoordinates()
        }
      }
    let line2 = turf.bezierSpline(line1);
    let geom = new LineString([]);
    geom.setCoordinates(line2["geometry"]["coordinates"]);
    var from = turf.point(feature.getGeometry().getCoordinates()[0]);
    var to = turf.point(feature.getGeometry().getCoordinates()[feature.getGeometry().getCoordinates().length-1]);
    //change the tolerance 
    let c2 = geom.simplify(100).getCoordinates()
    let dis = closestPoint(c2, point)
    let index = dis.index;
    let end = [c2[index+1][0],c2[index+1][1]];
    let start = [c2[index-1][0],c2[index-1][1]];

    let cos = calculateCos(point,end)
    let tan = calculateTan( end, start)

    let x = end[0] - start[0]
    let y = end[1] - start[1]
    let orientation = true
    if(( x < 0 && y < 0) || (x < 0 && y > 0)){
    orientation = false
    }

    let deg = 0
    if(tan > 0){
      deg = - Math.acos(cos) 
    }else{
      if(tan !=  0){
      deg =  Math.acos(cos) 
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

