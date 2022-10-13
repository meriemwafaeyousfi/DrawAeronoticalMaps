import React, { useCallback, useEffect } from 'react';
import {
	centreActionVectorLayer,
	drawCentreAction,
	modifyCentreAction,
	selectCentreAction,
	translateCentreAction,
} from 'Mapping/Features/CentreAction/CentreAction';
import * as extent from 'ol/extent';
import { useDispatch, useSelector } from 'react-redux';
import { endDrawing } from 'Mapping/Map';
import {
	setOption,
	setSelectedFeature,
} from '../../CardDrawingTools/redux/actions';
import Overlay from 'ol/Overlay';

function CentreAction() {
	const map = useSelector((state) => state.map);
	const dispatch = useDispatch();
	const init = useCallback(() => {
		//todo
	}, [dispatch, map]);

	useEffect(() => {
		if (map) init();
	}, [init, map]);

	const resizerOverlayDiv = () => {
		// const b =  (modalOpen) ? 'block' : 'none'
		return (
			<div id="resizer" style={{ display: 'none' }}>
				{/* <Resizer 
              resizeActive = {resizeActive}
              setResizeActive = {setResizeActive}
              setWidthImg = {props.setWidthImg} 
              setHeightImg = {props.setHeightImg}
              widthImg = {props.widthImg} 
              heightImg = {props.heightImg}
              nameCentre={props.nameCentre} 
              direction={props.direction - 90} 
              vitesse={props.vitesse} 
              setVitesse={props.setVitesse}
              texte = {props.texte}
              setTexte = {props.setTexte}
              top= {top}
              left = {left}
              setTop={setTop}
              setLeft={setLeft}
              widthResizer={props.widthResizer}
              setWidthResizer = {props.setWidthResizer}
              heightResizer = {props.heightResizer}
              setHeightResizer = {props.setHeightResizer}></Resizer> */}
			</div>
		);
	};

	return <div className="ui grid container">{resizerOverlayDiv()}</div>;
}

export default CentreAction;
