import React, { useCallback, useEffect } from 'react';
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
	const dispatch = useDispatch();

	const init = useCallback(() => {
		const ztvl = zoneTexteVectorLayer();
		map.addLayer(ztvl);

		// const szt = selectCondition(ztvl);
		// szt.set('title', 'condition:select');
		// szt.setActive(false);
		// szt.on('select', ({ selected }) => {
		// 	if (selected[0]) {
		// 		dispatch(setSelectedFeature(selected[0]));
		// 	} else {
		// 		dispatch(setSelectedFeature(null));
		// 	}
		// });
		// map.addInteraction(szt);

		const dzt = drawZoneTexte(ztvl.getSource());
		dzt.set('title', 'zone_texte:draw');
		dzt.setActive(false);
		dzt.on('drawend', ({ feature }) => {
		    //szt.getFeatures().clear();
			feature.set('feature_type', 'zone_texte');
			dispatch(setOption(''));
			dispatch(setOption('select'));
            dispatch(setModal('zone_texte'));
            dispatch(setSelectedFeature(feature));
			endDrawing(map);
            createEditorText(map,feature);
		});
		map.addInteraction(dzt);
        
		const tzt = translateZoneTexte(ztvl);
		tzt.set('title', 'condition:translate');
		tzt.setActive(false);
		map.addInteraction(tzt);

	}, [dispatch, map]);

	useEffect(() => {
		if (map) init();
	}, [init, map]);


	return modal === 'zone_texte' && <Window />;
}

export default ZoneTexte;
