import React, { useCallback, useEffect } from 'react';
import {
	jetVectorLayer,
	drawJet,
	modifyJet,
	selectJet,
	translateJet,
} from 'Mapping/Features/Jet/Jet';
import * as extent from 'ol/extent';
import { useDispatch, useSelector } from 'react-redux';
import { endDrawing } from 'Mapping/Map';
import {
	setOption,
	setSelectedFeature,
} from '../../CardDrawingTools/redux/actions';
import Window from './Window/FlecheVentWindow'

function Jet() {
	const map = useSelector((state) => state.map);
	const modal = useSelector((state) => state.modal);
	const dispatch = useDispatch();

	const init = useCallback(() => {
		const jvl = jetVectorLayer();
		map.addLayer(jvl);

		const sj = selectJet(map,jvl);
		sj.set('title', 'jet:select');
		sj.setActive(false);
		sj.on('select', (e) => {
			if (e.selected[0]) {
				dispatch(setSelectedFeature(e.selected[0]));
			} else {
				dispatch(setSelectedFeature(null));
			}
		});
		map.addInteraction(sj);

		const dj = drawJet(jvl.getSource());
		dj.set('title', 'jet:draw');
		dj.setActive(false);
		dj.on('drawend', ({ feature }) => {
			sj.getFeatures().clear();
			feature.set('feature_type', 'jet');
			feature.set('fleches', [])
			dispatch(setOption(''));
			dispatch(setOption('select'));
			
			endDrawing(map);
		});
		map.addInteraction(dj);

		const mt = modifyJet(sj, jvl);
		mt.set('title', 'jet:modify');
		map.addInteraction(mt);

		const tj = translateJet(jvl);
		tj.set('title', 'jet:translate');
		tj.setActive(false);
		map.addInteraction(tj);
	}, [dispatch, map]);

	useEffect(() => {
		if (map) init();
	}, [init, map]);
	return modal === 'fleche_vent' && <Window />;
}

export default Jet;
