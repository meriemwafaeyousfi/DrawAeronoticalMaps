import React, { useCallback, useEffect } from 'react';
import {
	cloudVectorLayer,
	drawCloud,
	modifyCloud,
	selectCloud,
	translateCloud,
} from '../../../../Mapping/Features/Clouds/Clouds';

function CloudyArea({ map, option }) {
	const init = useCallback(() => {
		map.getViewport().addEventListener('cloud_drawing:start', (e) => {
			map.getInteractions().forEach((interaction) => {
				if (interaction.get('title') === 'cloud_drawing') {
					interaction.setActive(true);
				}
			});
		});

		map.getViewport().addEventListener('select:on', (e) => {
			map.getInteractions().forEach((interaction) => {
				if (interaction.get('title') === 'select_cloud') {
					interaction.setActive(true);
				}
			});
		});

		map.getViewport().addEventListener('translate:on', (e) => {
			map.getInteractions().forEach((interaction) => {
				if (interaction.get('title') === 'translate_cloud') {
					interaction.setActive(true);
				}
			});
		});

		const cvl = cloudVectorLayer();
		map.addLayer(cvl);

		const dc = drawCloud(cvl.getSource());
		dc.set('title', 'cloud_drawing');
		dc.setActive(false);
		dc.on('drawend', ({ feature }) => {
			feature.set('feature_type', 'zone_nuageuse');
		});
		map.addInteraction(dc);

		const sc = selectCloud(cvl);
		sc.set('title', 'select_cloud');
		sc.setActive(false);
		map.addInteraction(sc);

		const mc = modifyCloud(sc, cvl);
		mc.set('title', 'modify_cloud');
		map.addInteraction(mc);

		const tc = translateCloud(cvl);
		tc.set('title', 'translate_cloud');
		tc.setActive(false);
		map.addInteraction(tc);
	}, [map]);

	useEffect(() => {
		init();
	}, [init]);
	return <></>;
}

export default CloudyArea;
