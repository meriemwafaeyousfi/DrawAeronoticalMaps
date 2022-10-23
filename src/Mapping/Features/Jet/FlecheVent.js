import { D3WindBarb, ConversionFactors } from "d3-wind-barbs";
import { Point } from 'ol/geom';

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
    let zoom = map.getView().getZoom()
    let h = (zoomMap != 0) ? ((zoomMap * 75) / 4) : 75
    windBarb.setAttribute('height', Math.round(h))
    let w = (zoomMap != 0) ? ((zoomMap * 50) / 4) : 50
    windBarb.setAttribute('width', Math.round(w))
    let x = windBarb.firstChild.getAttribute("transform")
    windBarb.firstChild.setAttribute("transform","scale(-1,1)translate(0, 0)rotate(90)")
    if(vitesse != 0){
        const line = windBarb.getElementsByClassName("wind-barb-root")[0]
        const old = (windBarb.firstChild).firstChild
        if(old){
        old.parentElement.removeChild(old)}
          }
   
    return windBarb
}

export const addFlecheVent = (coordinates, point, vitesse, type) =>{
    const {end, start} = getClosestPoints()
    let cos = calculateCos(point,end)
    let tan = calculateTan( end, start)
    let x = end[0] - start[0]
    let y = end[1] - start[1]
    let orientation = true
    if(( x < 0 && y < 0) || (x < 0 && y > 0)){
     orientation = false
    }
    const windBarb = createWindBarb(vitesse,90,orientation)
    let flecheVent = new Point(point)
    
    return
}
export const deleteFlecheVent = () =>{
    return
}

function drawWindBarb(coordinates, point, vitesse, type){ 
    let coords2 = dblClickFeature.getGeometry().get('jetCoordinates')
    let dis2 = closestPoint(coords2, point)
  
    let coordinates = dblClickFeature.getGeometry().getCoordinates()
    let styles = dblClickFeature.getStyle() 
    let i =-1
   
   styles.forEach((element, id) => {   
     if (element.getGeometry()){
      if((element.getGeometry().getCoordinates()[0] === point[0]) && (element.getGeometry().getCoordinates()[1]=== point[1]))
      {
        i = id
      }
    }
      }) 
    let dis = closestPoint(coordinates, point)
    let index = dis.index;
    let end = [coordinates[index+1][0],coordinates[index+1][1]];
    let start = [coordinates[index-1][0],coordinates[index-1][1]];
   
    let cos = calculateCos(point,end)
    let tan = calculateTan( end, start)
    let x = end[0] - start[0]
    let y = end[1] - start[1]
    let orientation = true
    if(( x < 0 && y < 0) || (x < 0 && y > 0)){
     orientation = false
    }

    const windBarb = createWindBarb(vitesse,90,orientation)
    let flecheVent = new Point(point)
    let poigne = new Point(point)
    let p = (Number(dblClickFeature.getGeometry().get('totalFleches')) + 1)
    poigne.set('name','poigne')
    flecheVent.set('name','flecheVent')
    flecheVent.set('affichage',optionAffich)
    flecheVent.set('vitesse',vitesse)
    flecheVent.set('fl',flightLevel)
    flecheVent.set('e-sup',epaisseurSup)
    flecheVent.set('e-inf',epaisseurInf)
    flecheVent.set('windBarb',windBarb)
    flecheVent.set('priorite', p) 
    flecheVent.set('colorText', textColor) 
    dblClickFeature.getGeometry().set('totalFleches',p)

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

    flecheVent.set('label', 'FL ' + flightLevel.toString() + '\n'+(((optionAffichEpaisseur != 'cache') && (epaisseurInf>0 || epaisseurSup>0)) ?  epaisseurInf+ '/'+ epaisseurSup : ''))
    flecheVent.set('rotation',deg)
    
    if (i != -1 ){
      if(type === 'cassure'){
        let cassure = createCassure(point, deg)
        styles[i] = cassure
      }else{
        if(vitesse == 0){
          styles[i] = new Style({
              geometry: poigne,
              image: new Circle({
                fill: fill,
                stroke: stroke,
                radius: 3,
              })
            })
          
        }else{
        styles[i] = new Style({
        geometry: flecheVent,
        text : new olText({
          font: 'bold '+ ((zoomMap != 0) ? ((zoomMap * '16') / 4) : '16') +'px/1 bold Arial',
          text: 'FL ' + flightLevel.toString() + '\n'+ (((optionAffichEpaisseur != 'cache') && (epaisseurInf>0 || epaisseurSup>0)) ?  epaisseurInf+ '/'+ epaisseurSup : '') ,
          rotation: deg ,
          offsetY  :((zoomMap != 0) ? ((zoomMap * 30) / 4) : 30),
          fill: new Fill({
            color: textColor.hex
          }),
       }),
        image: new Icon (({
        rotation: deg+ (Math.PI/2) ,
       anchor : (vitesse < 150) ? [0.48, 0.85] : [0.5,0.5],
        src: 'data:image/svg+xml;charset=utf-8,' + escape(windBarb.outerHTML ), 
        }))
      
      })
    }
       i =-1
      }
      
    }else{
      if(type === 'cassure'){
        let cassure = createCassure(point, deg)
        styles.push(cassure)
      }else{
        if(vitesse == 0){
          styles.push(
            new Style({
              geometry: poigne,
              image: new Circle({
                fill: fill,
                stroke: stroke,
                radius: 3,
              })
            })
          );
        }else{
          styles.push(new Style({
            geometry: flecheVent,
            text : new olText({
              color: textColor.hex,
              font: 'bold '+ ((zoomMap != 0) ? ((zoomMap * '16') / 4) : '16') +'px/1 bold Arial',
              text: 'FL ' + flightLevel.toString() + '\n'+ (((optionAffichEpaisseur != 'cache') && (epaisseurInf>0 || epaisseurSup>0)) ?  epaisseurInf+ '/'+ epaisseurSup : '') ,
              rotation: deg ,
              offsetY  :((zoomMap != 0) ? ((zoomMap * 30) / 4) : 30),
          }),
            image: new Icon (({
            rotation: deg + (Math.PI/2) ,
            anchor : (vitesse < 150) ? [0.48, 0.85] : [0.5,0.5],
            src: 'data:image/svg+xml;charset=utf-8,' + escape(windBarb.outerHTML )
            }))
          }))}
  }
}
    dblClickFeature.setStyle(styles)
  
}