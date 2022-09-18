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
		map.getViewport().addEventListener('courant_jet:start', (e) => {
			map.getInteractions().forEach((interaction) => {
				if (interaction.get('title') === 'draw_jet_flow') {
					interaction.setActive(true);
				}
			});
		});

		map.getViewport().addEventListener('select:on', (e) => {
			map.getInteractions().forEach((interaction) => {
				if (interaction.get('title') === 'select_jet_flow') {
					interaction.setActive(true);
				}
			});
		});

		map.getViewport().addEventListener('translate:on', (e) => {
			map.getInteractions().forEach((interaction) => {
				if (interaction.get('title') === 'translate_jet_flow') {
					interaction.setActive(true);
				}
			});
		});

		const jfvl = jetFlowVectorLayer();
		map.addLayer(jfvl);

		const djf = drawJetFlow(jfvl.getSource());
		djf.set('title', 'draw_jet_flow');
		djf.setActive(false);
		map.addInteraction(djf);

		const sjf = selectJetFlow(jfvl);
		sjf.set('title', 'select_jet_flow');
		sjf.setActive(false);
		map.addInteraction(sjf);

		const mjf = modifyJetFlow(sjf);
		mjf.set('title', 'modify_jet_flow');
		map.addInteraction(mjf);

		const tjf = translateJetFlow(jfvl);
		tjf.set('title', 'translate_jet_flow');
		tjf.setActive(false);
		map.addInteraction(tjf);
	}, [map]);
	useEffect(() => {
		init();
	}, [init]);
	return <></>;
}

export default JetFlow;
