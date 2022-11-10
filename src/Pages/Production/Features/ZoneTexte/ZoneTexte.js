import React, { useCallback, useEffect, useState } from 'react';
import {
	zoneTexteVectorLayer,
	drawZoneTexte,
    selectZoneTexte,
    modifyZoneTexte,
    translateZoneTexte,
    createEditorText
} from 'Mapping/Features/ZoneTexte/ZoneTexte';
import * as extent from 'ol/extent';
import { useDispatch, useSelector } from 'react-redux';
import { endDrawing } from 'Mapping/Map';
import {
    setModal,
	setOption,
	setSelectedFeature,
} from '../../CardDrawingTools/redux/actions';
import Window from './Window/Window'

function ZoneTexte() {
	const map = useSelector((state) => state.map);
	const modal = useSelector((state) => state.modal);
	const selectedFeature = useSelector((state) => state.selectedFeature);
	const dispatch = useDispatch();

	const init = useCallback(() => {
		const ztvl = zoneTexteVectorLayer(map);
		map.addLayer(ztvl);
		const szt = selectZoneTexte(map,ztvl);
		szt.set('title', 'zone_texte:select');
		szt.setActive(false);
		szt.on('select', ({ selected, deselected}) => {
			console.log('select interaction detected')
			let entriesSeen = new Set(); 
			const  observer = new ResizeObserver((entries) => { 
				if (!entriesSeen.has(entries[0].target)) {
					entriesSeen.add(entries[0].target);
				} 
				else {
					let height = entries[0].contentRect.height;
					let target = entries[0].target;
					let textContent = target.innerHTML;
					let nLines = textContent.split("<div>").length;
					let computedStyle = getComputedStyle(target)
					let size = ((height *0.65)/nLines)-( 2*parseFloat(computedStyle.padding)) - (2*parseFloat(computedStyle.borderWidth));
					target.style.fontSize = size +'px';
					selected[0].set('size',size)
				}
				});

			if (selected[0]) {
				const editorOverlay = map.getOverlayById(selected[0].ol_uid); 
				let target = editorOverlay.getElement();
				target.contentEditable = "true";
				target.style.resize= "vertical";
				target.style.outline = '0.2px dashed #000000';  
				dispatch(setSelectedFeature(selected[0]));
				observer.observe(target);  
			} else {
				const editorOverlay = map.getOverlayById(deselected[0].ol_uid)
				let target = editorOverlay.getElement();
			    target.contentEditable = "false";
				target.style.resize= "none";
				target.style.outline = 'none';
				dispatch(setSelectedFeature(null));
				observer.unobserve(target)
			}
		
		});
		map.addInteraction(szt);
		const dzt = drawZoneTexte(ztvl.getSource());
		dzt.set('title', 'zone_texte:draw');
		dzt.setActive(false);
		dzt.on('drawend', ({ feature }) => {
		    szt.getFeatures().clear();
			feature.set('feature_type', 'zone_texte');
			feature.set('epaisseur', 0);
			feature.set('transparence', 0);
			feature.set('size', 16);
			feature.set('marge', 0);
			feature.set('show-bordure', false);
			feature.set('show-remp', false);
			feature.set('text-color', '000000');
			feature.set('border-color', '000000');
			feature.set('remp-color', '000000');
			feature.set('bold', false);
			feature.set('italic', false);
			feature.set('underline', false);
			feature.set('align', 'left')
			feature.set('style-border', 'solid')
			feature.set('police', 'Arial')
			dispatch(setOption(''));
            dispatch(setModal('zone_texte'));
            dispatch(setSelectedFeature(feature));
			createEditorText(map,feature);
			endDrawing(map);
		});
		map.addInteraction(dzt);
		// ztvl.getSource().on('addfeature', ({ feature }) => {
		// 	if (feature.get('feature_type') === 'zone_texte') {
		// 		console.log('feature added');
		// 		szt.getFeatures().clear();
		// 		szt.setActive(true);
								
		// 	}
		// });
		const tzt = translateZoneTexte(ztvl);
		tzt.set('title', 'zone_texte:translate');
		tzt.setActive(false);
		map.addInteraction(tzt);

		
	}, [dispatch, map]);

	useEffect(() => {
		if (map) init();
	}, [init, map]);


	return modal === 'zone_texte' && <Window />;
}

export default ZoneTexte;
