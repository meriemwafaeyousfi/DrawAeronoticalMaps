import { View, Map } from 'ol';
import { fromLonLat } from 'ol/proj';
import BlankMap from './Layers/BlankMap';

export const createBlankMap = (target) => {
	return new Promise((resolve, rejecte) => {
		const map = new Map({
			target: target,
			interactions: [],
			layers: [BlankMap],
			view: new View({
				projection: 'EPSG:3857',
				center: fromLonLat([-1.15, 35.08]),
				zoom: 3,
			}),
			controls: [],
		});
		if (map) {
			resolve(map);
		} else {
			rejecte('fail to generate map');
		}
	});
};
