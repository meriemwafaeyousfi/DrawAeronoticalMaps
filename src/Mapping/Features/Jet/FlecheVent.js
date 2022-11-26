import {bezierSpline, point} from '@turf/turf';
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
import { api } from 'axiosConfig';
import CircleStyle from 'ol/style/Circle';


function createWindBarb(speed , fl, bool, zoom){
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
    let h = (zoom != 0) ? ((zoom * 75) / 4) : 75
    windBarb.setAttribute('height', Math.round(h))
    let w = (zoom != 0) ? ((zoom * 50) / 4) : 50
    windBarb.setAttribute('width', Math.round(w))  
    if(bool){
      windBarb.firstChild.setAttribute("transform","scale(-1,1)translate(0, 0)rotate(90)")  
    }else{
      windBarb.firstChild.setAttribute("transform","scale(1,1)translate(0, 0)rotate(90)")  
    }
  
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

export const addFlecheVent = (map,feature, point,fleche) =>{
  if(!feature) return
  const zoom = map.getView().getZoom() 
  let coords = feature.getGeometry().getCoordinates()
     let line1 = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: coords
        }
      }
    let line2 = bezierSpline(line1);
    let geom = new LineString([]);
    geom.setCoordinates(line2["geometry"]["coordinates"]);

    //change the tolerance 100
    let c2 = geom.simplify(0).getCoordinates()
   
    let dis = closestPoint(c2, point)
    let index = dis.index;
    let end = [c2[index+1][0],c2[index+1][1]];
    let start = [c2[index-1][0],c2[index-1][1]];
    let cos = calculateCos(point,end)
    //choose one of them
    let tan = calculateTan( end, start)
    let tan2 = calculateTan(coords[coords.length-1],coords[0])
    /************** */
    //choose one of them
    let x = end[0] - start[0]
    let y = end[1] - start[1]

    let x2 = coords[coords.length-1][0] - coords[0][0]
    let y2 = coords[coords.length-1][1] - coords[0][1]
    //*********** */

    let orientation = true
     let point2 = transform(coords[0], 'EPSG:3857', 'EPSG:4326');
     if(((point2[1]>0)&&(( x2 < 0 && y2 < 0) || (x2 < 0 && y2 > 0))) || ((point2[1]<0)&&(( x2 > 0 && y2 > 0) || (x2 > 0 && y2 < 0)))){
      orientation = false
    }

    let deg = 0
    if(tan > 0){
      deg =  -Math.acos(cos) 
    }else{
      if(tan !=  0){
      deg = Math.acos(cos) 
    }else{
      deg = 0;
    }
    }

    if((!orientation && point2[1]>0) || (orientation && point2[1]<0) ){
      deg = deg + Math.PI
    }

    if(fleche.affichage === 'cassure'){
      return(new Style({
        geometry: new Point(point),
        image: new Icon (({
            rotation: deg,
            size : [20, 20],
            // anchor : [0.70, 0.40],
             src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='210' width='500'%3E%3Cline x1='0' y1='0' x2='0' y2='20' style='stroke:%230000ff;stroke-width:4' /%3E%3Cline x1='8' y1='0' x2='8' y2='20' style='stroke:%230000ff;stroke-width:4' /%3E%3C/svg%3E"
             }))
          })
          )
    }else{
      //fleche.espace ==>    zoom*1000/4
      if(!fleche.espace || fleche.espace > 1000 || fleche.affichage === 'affiche'){
      const windBarb = createWindBarb(fleche.vitesse,90,point2[1]>0, zoom) 
      let offset = ((fleche.affichage_epaisseur !== 'cache') && (fleche.epaisseur_inf>0 || fleche.epaisseur_sup>0))? 25 : 15 
      const style = new Style({
			geometry: new Point(point),
			text : new olText({
			font:  ((zoom != 0) ? ((zoom * '16') / 4) : '16') +'px/1 Arial monospace',
			text: (fleche.niveau ? ('FL ' +  fleche.niveau.toString()) : '') + (((fleche.affichage_epaisseur !== 'cache') && (fleche.epaisseur_inf>0 || fleche.epaisseur_sup>0)) ?  '\n'+fleche.epaisseur_inf+ '/'+ fleche.epaisseur_sup : '')  ,
			rotation: deg,
			offsetY  : ((zoom != 0) ? ((zoom * offset) / 4) : offset),
			fill: new Fill({
				color: 'black' // change it after
			}),
      backgroundFill: new Fill({ color: 'white' }),
			}),
			image: new Icon (({
			rotation:  deg+ (Math.PI/2),
			anchor :  [0.48, 0.85] ,
			src: 'data:image/svg+xml;charset=utf-8,' + escape(windBarb.outerHTML), 
				}))
			})
    return style
      }else{
        return (new Style({
          // image: new CircleStyle({
          //   radius: 5,
          //   fill: new Fill({
          //     color: '#0000FF',
          //   }),
          // }),
          geometry: new Point(point)
        })
          )
      }
  }
}

export const createCassure = (point, rotation) => {
  let triangle = new Point(point);
  let cassure = new Style({
    geometry: triangle,
    image: new Icon (({
        rotation: rotation,
        size : [20, 20],
        // anchor : [0.70, 0.40],
         src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='210' width='500'%3E%3Cline x1='0' y1='0' x2='0' y2='20' style='stroke:%230000ff;stroke-width:4' /%3E%3Cline x1='8' y1='0' x2='8' y2='20' style='stroke:%230000ff;stroke-width:4' /%3E%3C/svg%3E"
         }))
      })
  return cassure;
}
