import { Feature, Overlay } from 'ol';
import { imagesLink } from '../../../Helpers/data';
import * as extent from 'ol/extent';
import { LineString } from 'ol/geom';
import { Stroke, Style } from 'ol/style';
import { transform } from 'ol/proj';

export const createTextOverlay = (map, feature) => {
	console.log(feature);
	const overlayText = document.createElement('div');
	overlayText.className = 'overlay_text';

	const overlay_content = document.createElement('div');
	overlay_content.className = 'overlay_content';
	overlay_content.appendChild(overlayText);

	const overlay_container = document.createElement('div');
	overlay_container.className = 'overlay_container';
	overlay_container.appendChild(overlay_content);

	const textOverlay = new Overlay({
		element: overlay_container,
		position: [feature.get('legendX'), feature.get('legendY')],
		positioning: 'center-center',
		id: feature.ol_uid,
	});

	let link = new Feature({
		geometry: new LineString([
			extent.getCenter(feature.getGeometry().getExtent()),
			textOverlay.getPosition(),
		]),
	});
	link.setStyle(
		new Style({
			stroke: new Stroke({
				color: '#000000',
				with: 2,
			}),
		})
	);
	overlay_container.addEventListener('mousedown', () => {
		const pointermove = (event) => {
			feature.set('legendX', event.coordinate[0]);
			feature.set('legendY', event.coordinate[1]);
			textOverlay.setPosition(event.coordinate);
			link
				.getGeometry()
				.setCoordinates([
					link.getGeometry().getCoordinates()[0],
					event.coordinate,
				]);
		};
		map.on('pointermove', pointermove);
		map.once('pointerup', () => {
			map.un('pointermove', pointermove);
		});
	});
	link.set('title', 'feature_overlay_link');
	link.setId(feature.ol_uid);
	map.getLayers().forEach((layer) => {
		if (layer.get('title') === 'Zones_Nuageuses') {
			layer.getSource().addFeature(link);
		}
	});

	map.addOverlay(textOverlay);
	return textOverlay;
};

export const unHighlightOverlay = (map, feature) => {
	const overlay = map.getOverlayById(feature.ol_uid);
	overlay.getElement().classList.remove('selected_overlay');
};

export const highlightOverlay = (map, feature) => {
	const overlay = map.getOverlayById(feature.ol_uid);
	overlay.getElement().classList.add('selected_overlay');
};

export const updateOverlayContent = (map, feature) => {
	let textContainer = map
		.getOverlayById(feature.ol_uid)
		.getElement()
		.querySelector('.overlay_text');
	textContainer.innerHTML = '';
	let words = feature.get('text').split(' ');
	words.forEach((word) => {
		if (Object.keys(imagesLink).includes(word)) {
			let img = document.createElement('img');
			img.setAttribute('src', imagesLink[word]);
			img.setAttribute('alt', word);
			img.style.width = '15px';
			img.style.margin = '2px';
			textContainer.appendChild(img);
		} else if (new RegExp('/').test(word)) {
			let numenator = document.createElement('div');
			numenator.className = 'overlay_fraction_numenator';
			numenator.innerHTML = word.split('/')[0];

			let denominator = document.createElement('div');
			denominator.className = 'overlay_fraction_denominator';
			denominator.innerHTML = word.split('/')[1];

			let fraction = document.createElement('div');
			fraction.className = 'overlay_fraction';
			fraction.appendChild(numenator);
			fraction.appendChild(denominator);

			textContainer.appendChild(fraction);
		} else {
			let span = document.createElement('span');
			span.innerHTML = word;
			textContainer.appendChild(span);
		}
	});
};

export const unHighlightAllOverlays = () => {
	document.querySelectorAll('.selected_overlay').forEach((overlay) => {
		overlay.classList.remove('selected_overlay');
	});
};

export const removeOverlay = (map, overlay) => {
	map.removeOverlay(overlay);
};

export const alignOverlayContent = (overlay, alignement) => {
	const overlay_content = overlay.getElement().querySelector('.overlay_text');
	switch (alignement) {
		case 'Gauche':
			overlay_content.style.justifyContent = 'start';
			break;
		case 'Centre':
			overlay_content.style.justifyContent = 'center';
			break;
		case 'Droite':
			overlay_content.style.justifyContent = 'end';
			break;

		default:
			break;
	}
};
