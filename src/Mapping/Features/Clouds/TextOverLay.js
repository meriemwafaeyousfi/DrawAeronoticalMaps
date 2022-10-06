import { Feature, Overlay } from 'ol';
import { imagesLink } from '../../../Helpers/data';
import * as extent from 'ol/extent';
import { LineString } from 'ol/geom';
import { Stroke, Style } from 'ol/style';

export const createTextOverlay = (map, feature) => {
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
		position: extent.getCenter(feature.getGeometry().getExtent()),
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

export const unHighlightOverlay = (overlay) => {
	overlay
		.getElement()
		.querySelector('.overlay_content')
		.classList.remove('selected_overlay');
};

export const highlightOverlay = (overlay) => {
	overlay
		.getElement()
		.querySelector('.overlay_content')
		.classList.add('selected_overlay');
};

export const getOverlay = (map, feature) => {
	return map.getOverlayById(feature.ol_uid);
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

export const getOverlayText = (overlay) => {
	let data = {
		text: '',
		numenator: 0,
		denominator: 0,
		show: false,
		alignement: 'Gauche',
	};
	overlay
		.getElement()
		.querySelector('.overlay_text')
		.childNodes.forEach((node) => {
			if (node.tagName === 'IMG') {
				data.text = data.text + ' ' + node.getAttribute('alt');
			} else if (node.tagName === 'DIV') {
				data.numenator =
					node.querySelector('.overlay_fraction_numenator').innerHTML === 'XXX'
						? 0
						: node.querySelector('.overlay_fraction_numenator').innerHTML;
				data.denominator =
					node.querySelector('.overlay_fraction_denominator').innerHTML ===
					'XXX'
						? 0
						: node.querySelector('.overlay_fraction_denominator').innerHTML;
				data.show = true;
			} else {
				if (node.innerHTML !== '') {
					data.text = data.text + ' ' + node.innerHTML;
					data.numenator = 0;
					data.denominator = 0;
					data.show = false;
				}
			}
		});
	switch (
		overlay.getElement().querySelector('.overlay_text').style.justifyContent
	) {
		case 'start':
			data.alignement = 'Gauche';
			break;
		case 'center':
			data.alignement = 'Center';
			break;
		case 'end':
			data.alignement = 'Droite';
			break;

		default:
			break;
	}
	return data;
};
