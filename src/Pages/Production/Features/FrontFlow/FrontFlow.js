import React, { useCallback, useEffect } from 'react';
import {
	drawFrontFlow,
	frontFlowVectorLayer,
	modifyFrontFlow,
	selectFrontFlow,
	translateFrontFlow,
} from '../../../../Mapping/Features/FrontFlow/FrontFlow';
import { useDispatch, useSelector } from 'react-redux';
import {  selectFeature } from './actions';
import { endDrawing } from '../../../../Mapping/Map';

function FrontFlow({ map }) {
    const dispatch = useDispatch();
	const init = useCallback(() => {
		map.getViewport().addEventListener('select:on', (e) => {
			map.getInteractions().forEach((interaction) => {
				if (interaction.get('title') === 'courant_front:select') {
					interaction.setActive(true);
				}
			});
		});

		map.getViewport().addEventListener('translate:on', (e) => {
			map.getInteractions().forEach((interaction) => {
				if (interaction.get('title') === 'courant_front:translate') {
					interaction.setActive(true);
				}
			});
		});

		const jfvl = frontFlowVectorLayer();
		map.addLayer(jfvl);


		const sjf = selectFrontFlow(jfvl);
		sjf.set('title', 'courant_front:select');
		sjf.setActive(false);
        sjf.on('select', ({ selected }) => {
			if (selected[0]) {
                console.log("selected[0]",selected[0])
				dispatch(selectFeature(selected[0]));
			} else {
				dispatch(selectFeature(null));
			}
		});
		map.addInteraction(sjf);

        const djf = drawFrontFlow(jfvl.getSource());
		djf.set('title', 'courant_front:draw');
		djf.setActive(false);
		djf.on('drawend', ({ feature }) => {
            sjf.getFeatures().clear();
			feature.set('featureType', 'courant_front');
            endDrawing(map);
			dispatch(selectFeature(feature));
			
            sjf.getFeatures().push(feature);
		});
		map.addInteraction(djf);

		const mjf = modifyFrontFlow(sjf);
		mjf.set('title', 'courant_front:modify');
		map.addInteraction(mjf);

		const tjf = translateFrontFlow(jfvl);
		tjf.set('title', 'courant_front:translate');
		tjf.setActive(false);
		map.addInteraction(tjf);
	}, [dispatch, map]);

	useEffect(() => {
		init();
	}, [init]);
	return <></>;
}

export default FrontFlow;
