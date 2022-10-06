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
import {
	setOption,
	setSelectedFeature,
} from '../../NewCarte/redux/actions';

function Jet() {
	const map = useSelector((state) => state.map);
	const dispatch = useDispatch();
	const init = useCallback(() => {
		const cvl = jetVectorLayer();
		map.addLayer(cvl);
		const sc = selectJet(cvl);
		sc.set('title', 'jet:select');
		sc.setActive(false);
		sc.on('select', ({ selected }) => {
			if (selected[0]) {
				dispatch(setSelectedFeature(selected[0]));
			} else {
				dispatch(setSelectedFeature(null));
			}
		});
		map.addInteraction(sc)

		const dc = drawJet(cvl.getSource())
		dc.set('title', 'jet:draw')
		dc.setActive(false)
		dc.on('drawend', ({ feature }) => {
			sc.getFeatures().clear()
			feature.set('feature_type', 'jet')
			endDrawing(map)
			dispatch(setOption(''));
			sc.getFeatures().push(feature)
		});
		map.addInteraction(dc)

		const mc = modifyJet(sc, cvl);
		mc.set('title', 'jet:modify');
		map.addInteraction(mc);
	}, [dispatch, map])

	useEffect(() => {
		if (map) init();
	}, [init, map]);
	return<></>
}

export default Jet;
