import React, { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { DragPan } from 'ol/interaction';
import { createBlankMap } from '../../../Mapping/Map';
import Tools from './Tools/Tools';
import MapContextMenu from './ContextMenu/MapContextMenu';
import CloudyArea from '../Features/CloudyArea/CloudyArea';
import FrontFlow from '../Features/FrontFlow/FrontFlow';
import Jet from '../Features/Jet/Jet';
import CentreAction from '../Features/CentreAction/CentreAction';
import { setMap } from './redux/actions';
import { api } from 'axiosConfig';
import './CardDrawingTools.css';
import { useParams } from 'react-router-dom';
import CAT from '../Features/CAT/CAT';
import ConditionSurface from '../Features/ConditionSurface/ConditionSurface';
import ZoneTexte from '../Features/ZoneTexte/ZoneTexte';

function CardDrawingTools() {
	const dispatch = useDispatch();
	const params = useParams();
	const [card, setCard] = useState([]);
	useEffect(() => {
		if (params.cardid) {
			api
				.get(`carteProduite/carte/${params.cardid}/`)
				.then((res) => {
					setCard(res.data);
				})
				.catch((err) => {
					console.log(err);
				});
		}
		createBlankMap('map-container').then((map) => {
			map.addInteraction(new DragPan());
			dispatch(setMap(map));
		});
	}, [dispatch, params.cardid]);
	return (
		<>
			<div className="card-container">
				<Tools />
				<div id="map-container"></div>
				<MapContextMenu />
				<CloudyArea clouds={card.zone_nuageuse} cardid={params.cardid} />
				<FrontFlow />
				<Jet />
				<CentreAction />
				<CAT />
				<ConditionSurface/>
				<ZoneTexte/>
			</div>
		</>
	);
}

export default CardDrawingTools;
