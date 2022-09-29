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

function CloudyArea({ map }) {
	const init = useCallback(() => {
		map.getViewport().addEventListener('cloud_drawing:start', (e) => {
			map.getInteractions().forEach((interaction) => {
				if (interaction.get('title') === 'cloud_drawing') {
					interaction.setActive(true);
				}
			});
		});

		map.getViewport().addEventListener('select:on', (e) => {
			console.log('activated');
			map.getInteractions().forEach((interaction) => {
				if (interaction.get('title') === 'zone_nuageuse:select') {
					interaction.setActive(true);
				}
			});
		});

		map.getViewport().addEventListener('translate:on', (e) => {
			map.getInteractions().forEach((interaction) => {
				if (interaction.get('title') === 'zone_nuageuse:translate') {
					interaction.setActive(true);
				}
			});
		});

		const cvl = cloudVectorLayer();
		map.addLayer(cvl);

		const sc = selectCloud(cvl);
		sc.set('title', 'zone_nuageuse:select');
		sc.setActive(false);
		map.addInteraction(sc);

		const dc = drawCloud(cvl.getSource());
		dc.set('title', 'zone_nuageuse:draw');
		dc.setActive(false);
		dc.on('drawend', ({ feature }) => {
			feature.set('feature_type', 'zone_nuageuse');
			feature.set('color', '#000000');
			feature.set('width', 2);
			feature.set('text', '');
			feature.set('alignement', 'Gauche');
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
	}, [map]);

	useEffect(() => {
		init();
	}, [init]);
	return <Window map={map} />;
}

export default CloudyArea;
