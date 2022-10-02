import React, { useCallback, useEffect } from 'react';
import {
	cloudVectorLayer,
	drawCloud,
	modifyCloud,
	selectCloud,
	translateCloud,
} from '../../../../Mapping/Features/Clouds/Clouds';
import { createTextOverlay } from '../../../../Mapping/Features/Clouds/TextOverLay';
import * as extent from 'ol/extent';
import Window from './Window/Window';
import { useDispatch, useSelector } from 'react-redux';
import { endDrawing } from '../../../../Mapping/Map';
import { setOption } from '../../NewCarte/Tools/actions';
import { cloudModal, selectFeature } from './actions';

function CloudyArea({ map }) {
	const dispatch = useDispatch();
	const init = useCallback(() => {
		const cvl = cloudVectorLayer();
		map.addLayer(cvl);

		const sc = selectCloud(cvl);
		sc.set('title', 'zone_nuageuse:select');
		sc.setActive(false);
		sc.on('select', ({ selected }) => {
			if (selected[0]) {
				dispatch(selectFeature(selected[0]));
			} else {
				dispatch(selectFeature(null));
			}
		});
		map.addInteraction(sc);

		const dc = drawCloud(cvl.getSource());
		dc.set('title', 'zone_nuageuse:draw');
		dc.setActive(false);
		dc.on('drawend', ({ feature }) => {
			sc.getFeatures().clear();
			feature.set('feature_type', 'zone_nuageuse');
			feature.set('color', '#000000');
			feature.set('width', 2);
			feature.set('text', '');
			feature.set('alignement', 'Gauche');
			endDrawing(map);
			dispatch(setOption(''));
			dispatch(selectFeature(feature));
			dispatch(cloudModal(true));
			sc.getFeatures().push(feature);
			createTextOverlay(map, feature);
		});
		map.addInteraction(dc);

		const mc = modifyCloud(sc, cvl);
		mc.set('title', 'zone_nuageuse:modify');
		map.addInteraction(mc);

		const tc = translateCloud(cvl);
		tc.set('title', 'zone_nuageuse:translate');
		tc.setActive(false);
		tc.on('translating', ({ features }) => {
			const link = cvl.getSource().getFeatureById(features.array_[0].ol_uid);
			const center = extent.getCenter(
				features.array_[0].getGeometry().getExtent()
			);
			link
				.getGeometry()
				.setCoordinates([center, link.getGeometry().getCoordinates()[1]]);
		});
		map.addInteraction(tc);
	}, [dispatch, map]);

	useEffect(() => {
		init();
	}, [init]);
	return useSelector((state) => state.cloudyAreaModal) && <Window map={map} />;
}

export default CloudyArea;
