import React, { useCallback, useEffect } from 'react';
import {
	jetVectorLayer,
	drawJet,
	modifyJet,
	selectJet,
	translateJet,
} from '../../../../Mapping/Features/Jet/Jet';
import * as extent from 'ol/extent';
import { useDispatch, useSelector } from 'react-redux';
import { endDrawing } from '../../../../Mapping/Map';
import { setOption, setSelectedFeature } from '../../NewCarte/redux/actions';

function Jet() {
	const map = useSelector((state) => state.map);
	const dispatch = useDispatch();

	const init = useCallback(() => {
		const jvl = jetVectorLayer();
		map.addLayer(jvl);

		const sj = selectJet(jvl);
		sj.set('title', 'jet:select');
		sj.setActive(false);
		sj.on('select', ({ selected }) => {
			if (selected[0]) {
				dispatch(setSelectedFeature(selected[0]));
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
			endDrawing(map);
			dispatch(setOption(''));
			sj.getFeatures().push(feature);
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
	return <></>;
}

export default Jet;
