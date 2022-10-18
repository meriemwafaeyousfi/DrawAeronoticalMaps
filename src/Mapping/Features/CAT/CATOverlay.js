import { forcesImages } from 'Helpers/data';

export const createOverlaysContainer = () => {
	const overlayContainer = document.createElement('div');
	overlayContainer.className = 'cat_overlay_container';
	const overlayContent = document.createElement('div');
	overlayContent.className = 'cat_overlay_content';
	overlayContainer.appendChild(overlayContent);

	const mapContainer = document.getElementById('map-container');
	mapContainer.appendChild(overlayContainer);
};

export const createAndUpdateOverlays = (vectorLayer) => {
	const container = document.querySelector('.cat_overlay_content');
	container.innerHTML = '';
	vectorLayer.getSource().forEachFeature((feature) => {
		const featureDataContainer = document.createElement('div');
		featureDataContainer.className = 'cat_data';
		const catNum = document.createElement('div');
		catNum.className = 'cat_num';
		catNum.innerHTML = feature.get('numCat');

		const catImage = document.createElement('img');
		catImage.className = 'cat_image';
		catImage.setAttribute('src', forcesImages[feature.get('type_force')]);
		catImage.setAttribute('alt', feature.get('type_force'));
		catImage.style.width = '30px';

		let numenator = document.createElement('div');
		numenator.className = 'overlay_fraction_numenator';
		numenator.innerHTML = feature.get('numenator');

		let denominator = document.createElement('div');
		denominator.className = 'overlay_fraction_denominator';
		denominator.innerHTML = feature.get('denominator');

		let fraction = document.createElement('div');
		fraction.className = 'overlay_fraction';
		fraction.appendChild(numenator);
		fraction.appendChild(denominator);

		featureDataContainer.appendChild(catNum);
		featureDataContainer.appendChild(catImage);
		featureDataContainer.appendChild(fraction);

		container.appendChild(featureDataContainer);
	});
};
