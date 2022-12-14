import {
	CATVectorLayer,
	drawCAT,
	modifyCAT,
	selectCAT,
	translateCAT,
	updateOrder,
} from 'Mapping/Features/CAT/CAT';
import {
	setModal,
	setOption,
	setSelectedFeature,
} from 'Pages/Production/CardDrawingTools/redux/actions';
import React, { useCallback, useEffect, useState } from 'react';
import { endDrawing } from 'Mapping/Map';
import Window from './Window/Window';
import { useDispatch, useSelector } from 'react-redux';
import {
	createAndUpdateOverlays,
	createOverlaysContainer,
} from 'Mapping/Features/CAT/CATOverlay';

function CAT() {
	const map = useSelector((state) => state.map);
	const modal = useSelector((state) => state.modal);
	const dispatch = useDispatch();

	const [vectorLayer, setVectorLayer] = useState(null);

	const init = useCallback(() => {
		createOverlaysContainer();
		const cvl = CATVectorLayer();
		setVectorLayer(cvl);
		map.addLayer(cvl);

		const sc = selectCAT(cvl);
		sc.set('title', 'CAT:select');
		sc.setActive(false);
		sc.on('select', ({ selected }) => {
			if (selected[0]) {
				dispatch(setSelectedFeature(selected[0]));
			} else {
				dispatch(setSelectedFeature(null));
			}
		});
		map.addInteraction(sc);

		cvl.getSource().on('addfeature', ({ feature }) => {
			if (feature.get('feature_type') === 'CAT') {
				updateOrder(cvl);
				createAndUpdateOverlays(cvl);
				sc.getFeatures().clear();
				sc.getFeatures().push(feature);
				dispatch(setSelectedFeature(feature));
			}
		});
		cvl.getSource().on('removefeature', ({ feature }) => {
			updateOrder(cvl);
			createAndUpdateOverlays(cvl);
		});

		const dc = drawCAT(cvl.getSource());
		dc.set('title', 'CAT:draw');
		dc.setActive(false);
		dc.on('drawend', ({ feature }) => {
			feature.set('feature_type', 'CAT');
			feature.set('numCat', '1');
			feature.set('type_force', 'Modere');
			feature.set('numenator', 'XXX');
			feature.set('denominator', 'XXX');
			dispatch(setModal('CAT'));
			dispatch(setOption(''));
			endDrawing(map);
		});
		map.addInteraction(dc);

		const mc = modifyCAT(sc, cvl);
		mc.set('title', 'CAT:modify');
		mc.on('modifyend', ({ features }) => {});
		map.addInteraction(mc);

		const tc = translateCAT(cvl);
		tc.set('title', 'CAT:translate');
		tc.setActive(false);
		map.addInteraction(tc);
	}, [dispatch, map]);

	useEffect(() => {
		if (map) {
			init();
		}
	}, [init, map]);
	return modal === 'CAT' && <Window vectorLayer={vectorLayer} />;
}

export default CAT;
