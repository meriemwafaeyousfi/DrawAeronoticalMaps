import React, { useCallback, useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import './Window.css';
import { useDispatch, useSelector } from 'react-redux';
import {
	setModal,
	setOption,
	setSelectedFeature,
} from '../../../NewCarte/redux/actions';
import { Style, Icon } from "ol/style";
import { Point } from "ol/geom";
import { getSelectedSegment } from "../../../../../Mapping/Features/FrontFlow/FrontStyles";


function Window({ vectorLayer }) {
    const src2 =
  "data:image/svg+xml,%3Csvg fill='white' width='60px' id='Layer_1' data-name='Layer 1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50 25'%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bfill:red;%7D%3C/style%3E%3C/defs%3E%3Ctitle%3E01%3C/title%3E%3Cpath class='cls-1' d='M50,36.5H0a25,25,0,0,1,50,0Z' transform='translate(0 -11.5)'/%3E%3C/svg%3E";

const imageStyle = new Style({
    image: new Icon({
      anchor: [1, 1],
      src: src2,
      scale: 0.19,
    }),
    geometry: new Point([]),
  });

	const map = useSelector((state) => state.map);
	const selectedFeature = useSelector((state) => state.selectedFeature);
	const disptach = useDispatch();

	const [backupFeature, setBackupFeature] = useState(null);
	const [selectedFeatureStyle, setSelectedFeatureStyle] = useState({
		color: '#000000',
		width: 2,
	});
  
	const singleClick = useCallback(
		(event) => {
		map.forEachFeatureAtPixel(
		  map.getEventPixel(event),
		   (feature) => {
		   if (feature.getGeometry().getType() != "Point") {
			if(feature.get("feature_type") === "courant_front") {
				const point = map.getEventCoordinate(event);
				console.log("feature in single",feature, "point",point);
				const selectedSeg = getSelectedSegment(feature, point);
				console.log("new selectedSeg",selectedSeg)
				selectedFeature.set("seg_selected", selectedSeg);
		 
		  console.log("hiiiiiiiiiiiiiiiiiiiiiiii")
			}
		  }
		},
		{ hitTolerance: 10 }
		);
	  }, [selectedFeature, map]);

    const handleConfirm = useCallback(() => {
		disptach(setOption(''));
		disptach(setModal(''));
		map.getViewport().removeEventListener("click", singleClick);
	}, [disptach]);

    const handleCancel = useCallback(() => {
		console.log(backupFeature);
        console.log("vectoreLayer in windows ",vectorLayer);
		vectorLayer.getSource().addFeature(backupFeature);
		disptach(setSelectedFeature(backupFeature));
		disptach(setOption(''));
		disptach(setModal(''));
		//map.getViewport().removeEventListener("click", singleClick);
	}, [backupFeature, disptach, map, selectedFeature, vectorLayer]);

	useEffect(() => {
		if (selectedFeature) {
			map.getViewport().removeEventListener("click", singleClick);
			map.getViewport().addEventListener("click", singleClick);
            console.log("selectedFeature in windows",selectedFeature);
		   setBackupFeature(selectedFeature.clone());
		   console.log("selectedFeature is =========",selectedFeature)
           selectedFeature.set("color","red");
           selectedFeature.set("type",2);
          
          
		} else {
            console.log("we go heere")
              
		}
	}, [selectedFeature]);


	/*useEffect(() => {
		if (map && selectedFeature) {
			selectedFeature.set('text', text);
			updateOverlayContent(map, selectedFeature);
		}
	}, [text, selectedFeature, map]);*/

	return (
		<Dialog
			header="Front"
			headerClassName="cloudWindowHeader"
			contentClassName="cloudWindowContent"
			position="bottom-left"
			modal={false}
			visible={true}
			className="cloudWindow"
			keepInViewport={false}
			dismissableMask={false}
			closable={false}>
			<div className="content_container">
				<div className="col_4">
					<h4>Loc</h4>
					
				</div>
				<div className="col_4">
					<h4>Qté</h4>
					
					</div>
				</div>
				
				<div className="confirmation_buttons">
					<div>
						<button onClick={handleConfirm}>Confirmer</button>
					</div>
					<div>
						<button onClick={handleCancel}>Annuler</button>
					</div>
				</div>
			
		</Dialog>
	);
}

export default Window;