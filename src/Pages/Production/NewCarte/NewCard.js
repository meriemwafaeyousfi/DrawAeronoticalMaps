import React, { useEffect, useState } from 'react';
import ContextMenu from '../../../Mapping/ContextMenu/ContextMenu';
import { createBlankMap } from '../../../Mapping/Map';
import { Draw } from 'ol/interaction';
import CloudyArea from '../Features/CloudyArea/CloudyArea';
import JetFlow from '../Features/JetFlow/JetFlow';
import './NewCard.css';

import Tools from './Tools/Tools';
function NewCard() {
	const [map, setMap] = useState(null);
	const [option, setOption] = useState('');

	useEffect(() => {
		createBlankMap('map-container').then((res) => {
			res.getViewport().addEventListener('drawing:end', (e) => {
				res.getInteractions().forEach((interaction) => {
					if (interaction instanceof Draw) {
						res.removeInteraction(interaction);
					}
				});
			});
			setMap(res);
		});
	}, []);
	return (
		<div className="new-card-container">
			<Tools map={map} setOption={setOption} />
			<div id="map-container"></div>
			<ContextMenu map={map} />
			{map && <CloudyArea map={map} option={option} />}
			{map && <JetFlow map={map} />}
		</div>
	);
}

export default NewCard;
