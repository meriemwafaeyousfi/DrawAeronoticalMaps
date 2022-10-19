import React, { useCallback, useEffect, useState } from 'react';
import {
	centreActionVectorLayer,
	modifyCentreAction,
	selectCentreAction,
	translateCentreAction,
	deselectCentreAction
} from 'Mapping/Features/CentreAction/CentreAction';
import {
	displayResizer,
	createResizer,
} from 'Mapping/Features/CentreAction/Resizer';
import * as extent from 'ol/extent';
import { useDispatch, useSelector } from 'react-redux';
import { endDrawing } from 'Mapping/Map';
import {
	setOption,
	setSelectedFeature,
	setCenterResizer,
} from 'Pages/Production/CardDrawingTools/redux/actions';
import Overlay from 'ol/Overlay';
import Resizer from './Resizer/Resizer';
import Window from './Window/Window';
import { Rnd } from 'react-rnd';


function CentreAction() {
	const [top, setTop] = useState(0)
	const [left, setLeft] = useState(0) 
	const [widthImg, setWidthImg] = useState(80)
	const [heightImg, setHeightImg] = useState(80)
  
	const [nameCentre, setNameCentre] = useState('c') 
	const [vitesse , setVitesse]= useState(null)
	const [texte, setTexte] = useState('')
	const [direction, setDirection]= useState(0)
	const [display , setDisplay] = useState('none')
  
	  const map = useSelector((state) => state.map)
	  const dispatch = useDispatch()
	const modal = useSelector((state) => state.modal)
	const mapCoordinate = useSelector((state) => state.mapCoordinate)
	const selectedFeature =useSelector((state) => state.selectedFeature)
	const centerResizer =useSelector((state) => state.centerResizer)
  
	  const init = useCallback(() => {
		  let resizer = createResizer(map, mapCoordinate)
	  dispatch(setCenterResizer(resizer))
	  }, [dispatch, map])
  
  
	  useEffect(() => {
		  if (map) init()
	  }, [init, map])
  
	
   
  //ajouter un centre d'action apres la detection de click sur le map
	useEffect(()=>{
	  if (!mapCoordinate || selectedFeature) return
		displayResizer(centerResizer, mapCoordinate)
		let overlayElt = new Overlay({
		  element : null,
		  stopEvent : false  
		})
		overlayElt.set('coordinates', null)
		overlayElt.set('feature_type','centre_action')
		overlayElt.set('nameCentre', 'c')
		overlayElt.set('vitesseCentre', null)
		overlayElt.set('texteCentre', '')
		overlayElt.set('directionCentre', -1)
		overlayElt.set('left', 0)
		overlayElt.set('top',0)
		overlayElt.set('width',80)
		overlayElt.set('height',80)
  
		dispatch(setSelectedFeature(overlayElt))
  
	  },[mapCoordinate])
  
   
	  const click = useCallback(
		  (event) => {
		deselectCentreAction(map,selectedFeature.get('coordinates'),selectedFeature,dispatch)
		dispatch(setSelectedFeature(null))
		map.un('click', click)
		  },
		  [dispatch, map, selectedFeature]
		)
  
	  useEffect(() => {
		if(selectedFeature && selectedFeature.get('feature_type')==='centre_action'){
			  setDisplay('block')
			  setNameCentre(selectedFeature.get('nameCentre'))
			  setVitesse(selectedFeature.get('vitesseCentre'))
			  setTexte(selectedFeature.get('texteCentre'))
			  setDirection(selectedFeature.get('directionCentre'))
  
			  setTop(selectedFeature.get('top'))
			  setLeft(selectedFeature.get('left'))
			  setWidthImg(selectedFeature.get('width'))
			  setHeightImg(selectedFeature.get('height'))
			  if(selectedFeature.get('coordinates')){
				  selectCentreAction(map,selectedFeature,centerResizer)
			  }
			  if(modal === ''){
				map.on('click', click)
			  }
		  }else{
			setDisplay('none')
			setTop(0)
			setLeft(0)
			setWidthImg(80)
			setHeightImg(80)
		  }
		  
		}, [selectedFeature])
  
  
  
  
	  return( 
	  <div>
		 <div  id="resizer" style={{display : {display} }}>
		   <Resizer 
		   nameCentre={nameCentre}
		   vitesse={vitesse} 
		   direction = {direction}
		   texte = {texte}
		   setWidthImg = {setWidthImg} 
		   setHeightImg = {setHeightImg}
		   widthImg = {widthImg} 
		   heightImg = {heightImg}
		   top= {top}
		   left = {left}
		   setTop={setTop}
		   setLeft={setLeft}></Resizer>
		   </div>
		 {modal==='centre_action' &&
		<Rnd  className="snapshotDialog" style={{zIndex : 6}}>
			<Window 
			nameCentre={nameCentre} 
			setNameCentre={setNameCentre}
			vitesse={vitesse} 
			setVitesse={setVitesse}
			direction = {direction}
			setDirection={setDirection}
			texte = {texte}
			setTexte={setTexte}
			/>
		</Rnd>
		}
	  </div>
	  )
	
  
  }
  
  export default CentreAction;
  
