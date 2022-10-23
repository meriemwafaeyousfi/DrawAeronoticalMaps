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


const fill = new Fill({color: '#FFF',  opacity : 1})
const stroke = new Stroke({
     color: '#000',
     width: 2
     })
const stroke2 = new Stroke({
     color: '#000',
     width: 1.09,
     lineDash: [3.5, 2]
     })

const selectType = (mapBrowserEvent) => {
    return (
            click(mapBrowserEvent) ||
            doubleClick(mapBrowserEvent) ||
            mapBrowserEvent.type === 'contextmenu'
        );
    };


const selectStyleFunction = function (feature) {
   const style2 =  new Style({
        image: new RegularShape({
           stroke: stroke2,
           points: 4,
           radius: 60,
           rotateWithView: true,
           angle: Math.PI/4,
         }),
         })
   let style = []
   if(feature.get('condition') === 'vent'){
       style =   new Style({
          image: new RegularShape({
                      fill: fill,
                      stroke: stroke,
                      points: 4,
                      radius: 30,
                      rotateWithView: true,
                    }),
                    text: new olText({
                      font: 'bold 16px/1 bold Arial',
                      text: feature.get('valeur').toString(),
                      offsetY  : 0,
                      fill: new Fill({
                        color: 'black'
                      }),
                   })
      })
      
   } else if(feature.get('condition') === 'temperature'){
       style =  new Style({
               image: new Circle({
                   radius: 25,
                   fill: fill,
                   stroke: stroke
               }),
              
               text: new olText({
                 font: 'bold 16px/1 bold Arial',
                 text: feature.get('valeur').toString(),
                 offsetY  : 0,
                 fill: new Fill({
                   color: 'black'
                 }),
              })
           })
       
   }else{
         style =  new Style({
            stroke : stroke,
            fill: fill,
            text: new olText({
                   font: 'bold 16px/1 bold Arial',
                   text: feature.get('valeur').toString(),
                   offsetY  : 0,
                   fill: new Fill({
                   color: 'black'
                                 }),
                              })
                            })
                
        
         if (feature.getGeometry().getType() === "Point"){
          const mapCoord = feature.getGeometry().getCoordinates()
          let coords0 = [[mapCoord[0]-400000,mapCoord[1]-300000],
                        [mapCoord[0]-400000,mapCoord[1]+300000]]
          // curved
          let coords1 = [[mapCoord[0]-400000,mapCoord[1]+300000],
                        [mapCoord[0]-60000,mapCoord[1]+350000],
                       [mapCoord[0]+60000,mapCoord[1]+250000],
                       [mapCoord[0]+400000,mapCoord[1]+300000]]
    
          let coords2 =[
                        [mapCoord[0]+400000,mapCoord[1]+300000],
                        [mapCoord[0]+400000,mapCoord[1]-300000]]
          // curved
          let coords3 = [
                        [mapCoord[0]+400000,mapCoord[1]-300000],
                        [mapCoord[0]+60000,mapCoord[1]-350000],
                        [mapCoord[0]-60000,mapCoord[1]-250000],
                        [mapCoord[0]-400000,mapCoord[1]-300000]
                        ]
         
            let line1 = {
            "type": "Feature",
            "properties": {
              },
            "geometry": {
              "type": "LineString",
              "coordinates": coords1
              }
            };
    
            let line2 = {
              "type": "Feature",
              "properties": {
                },
              "geometry": {
                "type": "LineString",
                "coordinates": coords3
                }
              }
    
           let curved1 = turf.bezier(line1)
           let curved2 = turf.bezier(line2)
           let coordsC1 = curved1["geometry"]["coordinates"]
           let coordsC2 = curved2["geometry"]["coordinates"]
    
           let coordsInt1 = coords0.concat(coordsC1)
           let coordsInt2 = coordsInt1.concat(coords2)
           let coordsF = coordsInt2.concat(coordsC2)
           let gm1 = new Point(mapCoord)
           let gm2 = new Polygon([coordsF])
           feature.setGeometry(new GeometryCollection([gm1,gm2]))
        }
    
   }
        return [style, style2];
    };
    

export const conditionVectorLayer = () => {
	return new VectorLayer({
		title: 'Condition en Surface',
		source: new VectorSource(),
        style :  (feature) => {
            if(feature.get('condition') === 'vent'){
                return (
                      new Style({
                      image: new RegularShape({
                                  fill: fill,
                                  stroke: stroke,
                                  points: 4,
                                  radius: 30,
                                  rotateWithView: true,
                                }),
                                text: new olText({
                                  font: 'bold 16px/1 bold Arial',
                                  text: feature.get('valeur').toString(),
                                  offsetY  : 0,
                                  fill: new Fill({
                                    color: 'black'
                                  }),
                               })
                  })
                  )
               } else if(feature.get('condition') === 'temperature'){
                   return( new Style({
                           image: new Circle({
                               radius: 25,
                               fill: fill,
                               stroke: stroke
                           }),
                          
                           text: new olText({
                             font: 'bold 16px/1 bold Arial',
                             text: feature.get('valeur').toString(),
                             offsetY  : 0,
                             fill: new Fill({
                               color: 'black'
                             }),
                          })
                       })
                   )
               }else{
                    const style =  new Style({
                        stroke : stroke,
                        fill: fill,
                        text: new olText({
                               font: 'bold 16px/1 bold Arial',
                               text: feature.get('valeur').toString(),
                               offsetY  : 0,
                               fill: new Fill({
                               color: 'black'
                                             }),
                                          })
                                        })
                            
                    
                     if (feature.getGeometry().getType() === "Point"){
                      const mapCoord = feature.getGeometry().getCoordinates()
                      let coords0 = [[mapCoord[0]-400000,mapCoord[1]-300000],
                                    [mapCoord[0]-400000,mapCoord[1]+300000]]
                      // curved
                      let coords1 = [[mapCoord[0]-400000,mapCoord[1]+300000],
                                    [mapCoord[0]-60000,mapCoord[1]+350000],
                                   [mapCoord[0]+60000,mapCoord[1]+250000],
                                   [mapCoord[0]+400000,mapCoord[1]+300000]]
                
                      let coords2 =[
                                    [mapCoord[0]+400000,mapCoord[1]+300000],
                                    [mapCoord[0]+400000,mapCoord[1]-300000]]
                      // curved
                      let coords3 = [
                                    [mapCoord[0]+400000,mapCoord[1]-300000],
                                    [mapCoord[0]+60000,mapCoord[1]-350000],
                                    [mapCoord[0]-60000,mapCoord[1]-250000],
                                    [mapCoord[0]-400000,mapCoord[1]-300000]
                                    ]
                     
                        let line1 = {
                        "type": "Feature",
                        "properties": {
                          },
                        "geometry": {
                          "type": "LineString",
                          "coordinates": coords1
                          }
                        };
                
                        let line2 = {
                          "type": "Feature",
                          "properties": {
                            },
                          "geometry": {
                            "type": "LineString",
                            "coordinates": coords3
                            }
                          }
                
                       let curved1 = turf.bezier(line1)
                       let curved2 = turf.bezier(line2)
                       let coordsC1 = curved1["geometry"]["coordinates"]
                       let coordsC2 = curved2["geometry"]["coordinates"]
                
                       let coordsInt1 = coords0.concat(coordsC1)
                       let coordsInt2 = coordsInt1.concat(coords2)
                       let coordsF = coordsInt2.concat(coordsC2)
                       let gm1 = new Point(mapCoord)
                       let gm2 = new Polygon([coordsF])
                       feature.setGeometry(new GeometryCollection([gm1,gm2]))
                    }
                return style
               }
        }
	});
};

export const drawCondition = (vectorSource) => {
	return new Draw({
		source: vectorSource,
		type: 'Point',
	});
};

// export const modifyJet = (select) => {
// 	return new Modify({
// 		features: select.getFeatures(),
// 		insertVertexCondition: shiftKeyOnly,
// 		removePoint: altKeyOnly,
// 	});
// };

export const selectCondition = (vectorLayer) => {
	return new Select({
		condition: selectType,
		style: (feature) => {
			return selectStyleFunction(feature);
		},
		filter: function (feature) {
			return feature.get('feature_type') === 'condition_surface';
		},
	});
};

export const translateCondition = (vectorLayer) => {
	return new Translate({
		layers: [vectorLayer],
		hitTolerance: 10,
	});
};

export const conditionDrawingON = (map) => {
	map.getInteractions().forEach((interaction) => {
		if (interaction.get('title') === 'condition:draw') {
			interaction.setActive(true);
		}
	});
};
