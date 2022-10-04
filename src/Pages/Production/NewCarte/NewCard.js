import React, { useEffect, useState } from 'react';
import MapContextMenu from '../../../Mapping/ContextMenu/MapContextMenu';
import { createBlankMap } from '../../../Mapping/Map';
import { DragPan } from 'ol/interaction';
import CloudyArea from '../Features/CloudyArea/CloudyArea';
import JetFlow from '../Features/JetFlow/JetFlow';
import FrontFlow from '../Features/FrontFlow/FrontFlow';
import './NewCard.css';

import Tools from './Tools/Tools';
import { useDispatch, useSelector } from 'react-redux';
import { cloudModal } from '../Features/CloudyArea/actions';
function NewCard() {
	const [map, setMap] = useState(null);
	const [option, setOption] = useState('');
	const dispatch = useDispatch();
	useEffect(() => {
		createBlankMap('map-container').then((res) => {
			res.getViewport().addEventListener('dblclick', (event) => {
				res.forEachFeatureAtPixel(
					res.getEventPixel(event),
					(feature) => {
						if (feature.get('feature_type') === 'zone_nuageuse') {
							dispatch(cloudModal(true));
						}
					},
					{ hitTolerance: 10 }
				);
			});
			res.addInteraction(new DragPan());
			setMap(res);
		});
	}, []);
	return (
		<div className="new-card-container">
			<Tools map={map} setOption={setOption} />
			<div id="map-container"></div>
			<MapContextMenu map={map} />
			{map && <CloudyArea map={map} option={option} />}
			{map && <JetFlow map={map} />}
			{map && <FrontFlow map={map} />}
		</div>
	);
}

export default NewCard;
