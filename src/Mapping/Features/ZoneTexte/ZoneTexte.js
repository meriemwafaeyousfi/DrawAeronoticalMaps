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

const stroke = new Stroke({ 
    color: 'transparent',
    width: 2
})

const stroke2= new Stroke({ 
    color: '#000',
    width: 2
})

const fill = new Fill({
    color: 'transparent',
    width: 2
})  

const selectType = (mapBrowserEvent) => {
    return (
            click(mapBrowserEvent) ||
            doubleClick(mapBrowserEvent) ||
            mapBrowserEvent.type === 'contextmenu'
        );
    };

export const zoneTexteVectorLayer = (map) => {
	return new VectorLayer({
		title: 'Zone de Texte',
		source: new VectorSource(),
       style :  (feature) => {
            const editor = map.getOverlayById(feature.ol_uid)
            let computedStyle = getComputedStyle(editor.getElement()); //use it to modify the width of 
            const editorWidth = computedStyle.width;
            const _opacity = Math.round(Math.min(Math.max(feature.get('transparence') || 1, 0), 1) * 255);
            const color=  feature.get('remp-color') + _opacity.toString(16).toUpperCase();
            editor.getElement().style.borderWidth = feature.get('show-bordure') ? feature.get('epaisseur') + "px": 0;
            editor.getElement().style.borderColor = feature.get('show-bordure') ? '#'+feature.get('border-color').toString() : 'transparent';
            editor.getElement().style.borderStyle = feature.get('show-bordure') ?  feature.get('style-border') : 'none';
            editor.getElement().style.backgroundColor = feature.get('show-remp') ?  '#'+color.toString() : 'transparent';
            editor.getElement().style.padding =feature.get('show-bordure') ? feature.get('marge') +"px" : 0;
            editor.getElement().style.color = '#'+feature.get('text-color').toString() ;
            editor.getElement().style.fontSize = feature.get('size')+ 'px';
            editor.getElement().style.fontFamily = feature.get('police');
            editor.getElement().style.textAlign = feature.get('align');
            if(feature.get('bold')){
                editor.getElement().style.fontWeight= 'bold';
            }
            if(feature.get('italic')){
                editor.getElement().style.fontStyle = "italic";
            }
            if(feature.get('underline')){
                editor.getElement().style.textDecoration = "underline";
            }
           
          
          return (
            new Style({
                image: new RegularShape({
                    fill: fill,
                    stroke: stroke,
                    points: 4,
                    radius: 40,
                    rotateWithView: true,
                    angle: 40,
                  }),
                
            })
          )
        }
  
	});
};

export const drawZoneTexte = (vectorSource) => {
	return new Draw({
		source: vectorSource,
		type: 'Point',
	});
};

export const selectZoneTexte = (map,vectorLayer) => {
	return new Select({
        layers: [vectorLayer],
        condition: selectType,
        style: (feature) => {
            if (feature.get('feature_type') === 'zone_texte') {
            const editor = map.getOverlayById(feature.ol_uid)
            let computedStyle = getComputedStyle(editor.getElement()); //use it to modify the width of 
            const editorWidth = computedStyle.width;
            editor.getElement().style.resize= "vertical";
            editor.getElement().style.outline = '0.2px dashed #000000';
            const _opacity = Math.round(Math.min(Math.max(feature.get('transparence') || 1, 0), 1) * 255);
            const color=  feature.get('remp-color') + _opacity.toString(16).toUpperCase();
            editor.getElement().style.borderWidth = feature.get('show-bordure') ? feature.get('epaisseur') + "px": 0;
            editor.getElement().style.borderColor = feature.get('show-bordure') ? '#'+feature.get('border-color').toString() : 'transparent';
            editor.getElement().style.borderStyle = feature.get('show-bordure') ?  feature.get('style-border') : 'none';
            editor.getElement().style.backgroundColor = feature.get('show-remp') ?  '#'+color.toString() : 'transparent';
            //editor.getElement().style.opacity = feature.get('show-remp') ?  feature.get('transparence')/100 : 'transparent';
            editor.getElement().style.padding =feature.get('show-bordure') ? feature.get('marge') +"px" : 0;
            editor.getElement().style.color = '#'+feature.get('text-color').toString() ;
            editor.getElement().style.fontSize = feature.get('size')+ 'px';
            editor.getElement().style.fontFamily = feature.get('police');
            editor.getElement().style.textAlign = feature.get('align');
            if(feature.get('bold')){
                editor.getElement().style.fontWeight= 'bold';
            }else{
                
                editor.getElement().style.fontWeight= 'normal';
            }
            if(feature.get('italic')){
                editor.getElement().style.fontStyle = "italic";
            }else{
                editor.getElement().style.fontStyle = "normal";
            }
            if(feature.get('underline')){
                editor.getElement().style.textDecoration = "underline";
            }else{
                editor.getElement().style.textDecoration = "none";
            }
            
           return (new Style({
                image: new RegularShape({
                    fill: fill,
                    stroke: stroke2,
                    points: 4,
                    radius: 40,
                    rotateWithView: true,
                    angle: 40,
                  }),
                
            }))
            
        }
    }
    });
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
                  dragging: false,
                  positioning: 'center-center',
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


