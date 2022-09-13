import React, { useEffect, useState } from 'react';
import { createBlankMap } from '../../../Mapping/Map';
import './NewCard.css';
import Tools from './Tools/Tools';
function NewCard() {
	const [map, setMap] = useState(null);

	useEffect(() => {
		createBlankMap('map-container').then((res) => {
			console.log(res);
			setMap(res);
		});
	}, []);
	return (
		<div className="new-card-container">
			<Tools />
			<div id="map-container"></div>
		</div>
	);
}

export default NewCard;
