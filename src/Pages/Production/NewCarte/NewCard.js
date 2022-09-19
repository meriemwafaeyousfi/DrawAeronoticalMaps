import React, { useEffect, useState } from 'react';
import MapContextMenu from '../../../Mapping/ContextMenu/MapContextMenu';
import { createBlankMap } from '../../../Mapping/Map';
import { DragPan, Draw, Select, Translate } from 'ol/interaction';
import CloudyArea from '../Features/CloudyArea/CloudyArea';
import JetFlow from '../Features/JetFlow/JetFlow';
import './NewCard.css';

import Tools from './Tools/Tools';
function NewCard() {
	const [map, setMap] = useState(null);
	const [option, setOption] = useState('');
	const [contextMenu, setContextMenu] = useState(null);

	useEffect(() => {
		createBlankMap('map-container').then((res) => {
			res.getViewport().addEventListener('drawing:end', (e) => {
				res.getInteractions().forEach((interaction) => {
					if (interaction instanceof Draw) {
						interaction.setActive(false);
					}
				});
			});
			res.getViewport().addEventListener('select:off', (e) => {
				res.getInteractions().forEach((interaction) => {
					if (interaction instanceof Select) {
						interaction.getFeatures().clear();
						interaction.setActive(false);
					}
				});
			});
			res.getViewport().addEventListener('translate:off', (e) => {
				res.getInteractions().forEach((interaction) => {
					if (interaction instanceof Translate) {
						interaction.setActive(false);
					}
				});
			});
			res.getViewport().addEventListener('contextmenu', (event) => {
				event.preventDefault();
				setContextMenu(event);
			});
			res.addInteraction(new DragPan());
			setMap(res);
		});
	}, []);
	return (
		<div className="new-card-container">
			<Tools map={map} setOption={setOption} />
			<div id="map-container"></div>
			<MapContextMenu map={map} event={contextMenu} />
			{map && <CloudyArea map={map} option={option} />}
			{map && <JetFlow map={map} />}
		</div>
	);
}

export default NewCard;
