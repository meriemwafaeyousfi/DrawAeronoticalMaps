import React, { useCallback, useEffect } from 'react';
import {
	conditionVectorLayer,
	drawCondition,
    selectCondition,
    modifyCondition,
    translateCondition
} from 'Mapping/Features/ConditionSurface/ConditionSurface';
import * as extent from 'ol/extent';
import { useDispatch, useSelector } from 'react-redux';
import { endDrawing } from 'Mapping/Map';
import {
    setModal,
	setOption,
	setSelectedFeature,
} from '../../CardDrawingTools/redux/actions';
import Window from './Window/Window'

function ConditionSurface() {
	const map = useSelector((state) => state.map);
	const modal = useSelector((state) => state.modal);
	const dispatch = useDispatch();

	const init = useCallback(() => {
		const csvl = conditionVectorLayer();
		map.addLayer(csvl);

		const scs = selectCondition(csvl);
		scs.set('title', 'condition:select');
		scs.setActive(false);
		scs.on('select', ({ selected }) => {
			if (selected[0]) {
				dispatch(setSelectedFeature(selected[0]));
			} else {
				dispatch(setSelectedFeature(null));
			}
		});
		map.addInteraction(scs);

		const dcs = drawCondition(csvl.getSource());
		dcs.set('title', 'condition:draw');
		dcs.setActive(false);
		dcs.on('drawend', ({ feature }) => {
			scs.getFeatures().clear();
			feature.set('feature_type', 'condition_surface');
            feature.set('condition', 'etat');
            feature.set('valeur', 0);
			dispatch(setOption(''));
			dispatch(setOption('select'));
            dispatch(setModal('condition_surface'));
            dispatch(setSelectedFeature(feature));
			endDrawing(map);
		});
		map.addInteraction(dcs);
        
		const tcs = translateCondition(csvl);
		tcs.set('title', 'condition:translate');
		tcs.setActive(false);
		map.addInteraction(tcs);

	}, [dispatch, map]);

	useEffect(() => {
		if (map) init();
	}, [init, map]);
	return modal === 'condition_surface' && <Window />;
}

export default ConditionSurface;
