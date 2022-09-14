import React, { useEffect, useState } from 'react';
import ContextMenu from '../../../Mapping/ContextMenu/ContextMenu';
import { createBlankMap } from '../../../Mapping/Map';
import './NewCard.css';

import Tools from './Tools/Tools';
function NewCard() {
	const [map, setMap] = useState(null);
	const [option, setOption] = useState('');

	useEffect(() => {
		createBlankMap('map-container').then((res) => {
			setMap(res);
		});
	}, []);
	return (
		<div className="new-card-container">
			<Tools map={map} option={option} setOption={setOption} />
			<div id="map-container"></div>
			<ContextMenu map={map} />
		</div>
	);
}

export default NewCard;
