import React, { useCallback, useEffect } from 'react';
import {
	drawJetFlow,
	jetFlowVectorLayer,
	modifyJetFlow,
	selectJetFlow,
	translateJetFlow,
} from '../../../../Mapping/Features/JetFlow/JetFlow';

function JetFlow({ map }) {
	const init = useCallback(() => {
		map.getViewport().addEventListener('select:on', (e) => {
			map.getInteractions().forEach((interaction) => {
				if (interaction.get('title') === 'courant_jet:select') {
					interaction.setActive(true);
				}
			});
		});

		map.getViewport().addEventListener('translate:on', (e) => {
			map.getInteractions().forEach((interaction) => {
				if (interaction.get('title') === 'courant_jet:translate') {
					interaction.setActive(true);
				}
			});
		});

		const jfvl = jetFlowVectorLayer();
		map.addLayer(jfvl);

		const djf = drawJetFlow(jfvl.getSource());
		djf.set('title', 'courant_jet:draw');
		djf.setActive(false);
		djf.on('drawend', ({ feature }) => {
			feature.set('featureType', 'courant_jet');
		});
		map.addInteraction(djf);

		const sjf = selectJetFlow(jfvl);
		sjf.set('title', 'courant_jet:select');
		sjf.setActive(false);
		map.addInteraction(sjf);

		const mjf = modifyJetFlow(sjf);
		mjf.set('title', 'courant_jet:modify');
		map.addInteraction(mjf);

		const tjf = translateJetFlow(jfvl);
		tjf.set('title', 'courant_jet:translate');
		tjf.setActive(false);
		map.addInteraction(tjf);
	}, [map]);
	useEffect(() => {
		init();
	}, [init]);
	return <></>;
}

export default JetFlow;
