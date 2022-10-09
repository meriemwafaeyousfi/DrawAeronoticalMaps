import React, { useCallback, useEffect, useState } from 'react';
import {
	cloudVectorLayer,
	drawCloud,
	modifyCloud,
	selectCloud,
	translateCloud,
} from '../../../../Mapping/Features/Clouds/Clouds';
import {
	createTextOverlay,
	updateOverlayContent,
} from '../../../../Mapping/Features/Clouds/TextOverLay';
import * as extent from 'ol/extent';
import Window from './Window/Window';
import { endDrawing } from '../../../../Mapping/Map';
import { useDispatch, useSelector } from 'react-redux';
import {
	setModal,
	setOption,
	setSelectedFeature,
} from '../../NewCarte/redux/actions';

function CloudyArea() {
	const map = useSelector((state) => state.map);
	const modal = useSelector((state) => state.modal);
	const dispatch = useDispatch();

	const [vectorLayer, setVectorLayer] = useState(null);

	const init = useCallback(() => {
		const cvl = cloudVectorLayer();
		setVectorLayer(cvl);
		map.addLayer(cvl);

		const sc = selectCloud(cvl);
		sc.set('title', 'zone_nuageuse:select');
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
			if (feature.get('feature_type') === 'zone_nuageuse') {
				sc.getFeatures().clear();
				sc.getFeatures().push(feature);
				dispatch(setSelectedFeature(feature));
				createTextOverlay(map, feature);
				updateOverlayContent(map, feature);
			}
		});
		cvl.getSource().on('removefeature', ({ feature }) => {
			if (feature.get('feature_type') === 'zone_nuageuse') {
				const relatedOverlay = map.getOverlayById(feature.ol_uid);
				const relatedLink = cvl.getSource().getFeatureById(feature.ol_uid);
				map.removeOverlay(relatedOverlay);
				cvl.getSource().removeFeature(relatedLink);
			}
		});

		const dc = drawCloud(cvl.getSource());
		dc.set('title', 'zone_nuageuse:draw');
		dc.setActive(false);
		dc.on('drawend', ({ feature }) => {
			feature.set('feature_type', 'zone_nuageuse');
			feature.set('color', '#000000');
			feature.set('width', 2);
			feature.set('text', '');
			feature.set('alignement', 'Gauche');
			dispatch(setModal('zone_nuageuse'));
			dispatch(setOption(''));
			endDrawing(map);
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
		if (map) {
			init();
		}
	}, [init, map]);
	return modal === 'zone_nuageuse' && <Window vectorLayer={vectorLayer} />;
}

export default CloudyArea;
