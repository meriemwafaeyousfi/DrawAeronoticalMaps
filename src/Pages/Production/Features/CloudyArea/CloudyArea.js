import React, { useCallback, useEffect } from 'react';
import {
	cloudVectorLayer,
	drawCloud,
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
		const cvl = cloudVectorLayer();
		map.addLayer(cvl);

		const dc = drawCloud(cvl.getSource());
		dc.set('title', 'cloud_drawing');
		dc.setActive(false);
		map.addInteraction(dc);
	}, [map]);

	useEffect(() => {
		init();
	}, [init]);
	return <></>;
}

export default CloudyArea;
