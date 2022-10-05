import React, { useEffect } from 'react';
import MapContextMenu from './ContextMenu/MapContextMenu';
import { createBlankMap } from '../../../Mapping/Map';
import { DragPan } from 'ol/interaction';
import CloudyArea from '../Features/CloudyArea/CloudyArea';
import JetFlow from '../Features/JetFlow/JetFlow';
import FrontFlow from '../Features/FrontFlow/FrontFlow';
import './NewCard.css';

import Tools from './Tools/Tools';
import { useDispatch } from 'react-redux';
import { setMap } from './redux/actions';
function NewCard() {
	const dispatch = useDispatch();
	useEffect(() => {
		createBlankMap('map-container').then((res) => {
			res.addInteraction(new DragPan());
			dispatch(setMap(res));
		});
	}, [dispatch]);
	return (
		<div className="new-card-container">
			<Tools />
			<div id="map-container"></div>
			<MapContextMenu />
			<CloudyArea />
			<JetFlow />
			{map && <FrontFlow map={map} />}
		</div>
	);
}

export default NewCard;
