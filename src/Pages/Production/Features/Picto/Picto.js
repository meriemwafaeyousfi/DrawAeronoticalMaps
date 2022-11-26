import {
	pictoVectorLayer,
	drawPicto,
	modifyPicto,
	selectPicto,
	translatePicto,
	savePicto,
	getPictos,
} from 'Mapping/Features/Picto/Picto';
import {
	setModal,
	setOption,
	setSelectedFeature,
} from 'Pages/Production/CardDrawingTools/redux/actions';
import React, { useCallback, useEffect, useState } from 'react';
import { endDrawing } from 'Mapping/Map';
import Window from './Window/Window';
import { useDispatch, useSelector } from 'react-redux';

function Picto({ pictos, cardid }) {
	const map = useSelector((state) => state.map);
	const modal = useSelector((state) => state.modal);
	const dispatch = useDispatch();

	const [vectorLayer, setVectorLayer] = useState(null);

	useEffect(() => {
		if (pictos && pictos.length && vectorLayer) {
			getPictos(pictos, vectorLayer);
		}
	}, [pictos, vectorLayer]);
	const init = useCallback(() => {
		const pvl = pictoVectorLayer();
		setVectorLayer(pvl);
		map.addLayer(pvl);

		const sp = selectPicto(pvl);
		sp.set('title', 'picto:select');
		sp.setActive(false);
		sp.on('select', ({ selected }) => {
			if (selected[0]) {
				dispatch(setSelectedFeature(selected[0]));
			} else {
				dispatch(setSelectedFeature(null));
			}
		});
		map.addInteraction(sp);

		pvl.getSource().on('addfeature', ({ feature }) => {
			if (feature.get('feature_type') === 'picto') {
			}
		});
		pvl.getSource().on('removefeature', ({ feature }) => {});

		const dp = drawPicto(pvl.getSource());
		dp.set('title', 'picto:draw');
		dp.setActive(false);
		dp.on('drawend', ({ feature }) => {
			feature.set('feature_type', 'picto');
			feature.set('name_picto', 'Ww_17');
			feature.set('scale', 1);
			sp.getFeatures().clear();
			sp.getFeatures().push(feature);
			dispatch(setSelectedFeature(feature));
			dispatch(setModal('picto'));
			dispatch(setOption(''));
			endDrawing(map);
			savePicto(feature, cardid);
		});
		map.addInteraction(dp);
		const mp = modifyPicto(sp, pvl);
		mp.set('title', 'picto:modify');
		mp.on('modifyend', ({ features }) => {});
		map.addInteraction(mp);

		const tp = translatePicto(pvl);
		tp.set('title', 'picto:translate');
		tp.setActive(false);
		map.addInteraction(tp);
	}, [cardid, dispatch, map]);

	useEffect(() => {
		if (map) {
			init();
		}
	}, [init, map]);
	return modal === 'picto' && <Window vectorLayer={vectorLayer} />;
}

export default Picto;
