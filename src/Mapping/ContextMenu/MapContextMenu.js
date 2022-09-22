import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ContextMenu as PrimeContextMenu } from 'primereact/contextmenu';
import './MapContextMenu.css';
import { addAHandle } from '../Features/Clouds/Clouds';
import { copyFeature, pastFeature } from '../Map';

function MapContextMenu({ map }) {
	const CMRef = useRef(null);
	const [feature, setFeature] = useState(null);
	const [eventCoordiantes, setEventCoordinates] = useState(null);
	const [layer, setLayer] = useState();
	const [vertex, setVertex] = useState(false);

	const items = [
		{
			label: 'Ajouter un poignée',
			icon: 'ajouter-poingee',
			visible: !!feature,
			command: (event) => {
				addAHandle(eventCoordiantes, feature);
			},
		},
		{
			label: 'Supprimer le poignée',
			icon: 'supprimer-poingee',
			visible:
				!!feature && feature.get('feature_type') === 'zone_nuageuse' && vertex,
			command: (event) => {},
		},
		{
			label: 'Ajouter une zone de texte',
			icon: 'ajouter-zone-text',
			visible: !!feature && feature.get('feature_type') === 'zone_nuageuse',
			command: () => {},
		},
		{
			label: 'Supprimer la zone de texte',
			icon: 'supprimer-zone-text',
			visible: !!feature && feature.get('feature_type') === 'zone_nuageuse',
			command: () => {},
		},
		{
			label: 'Copier',
			icon: 'copie-figure',
			disabled: !feature,
			command: () => {
				copyFeature(map, feature);
			},
		},
		{
			label: 'Couper',
			icon: 'couper-figure',
			disabled: !feature,
			command: (event) => {},
		},
		{
			label: 'Coller',
			icon: 'coller-figure',
			disabled: !!map && !map.get('feature_copiee'),
			command: () => {
				pastFeature(map, layer, eventCoordiantes);
			},
		},
		{
			label: 'Supprimer la figure',
			icon: 'supprimer-figure',
			disabled: !feature,
			command: (event) => {},
		},
	];

	const distance = useCallback((p1, p2) => {
		return Math.sqrt(
			(p2[0] - p1[0]) * (p2[0] - p1[0]) + (p2[1] - p1[1]) * (p2[1] - p1[1])
		);
	}, []);

	const getClosestPoint = useCallback(
		(point, feature) => {
			let vertex = null;
			feature
				.getGeometry()
				.getCoordinates()
				.forEach((coord) => {
					if (distance(map.getPixelFromCoordinate(coord), point) <= 7) {
						vertex = coord;
					}
				});
			return vertex
				? { coords: vertex, vertex: true }
				: { coords: map.getCoordinateFromPixel(point), vertex: false };
		},
		[distance, map]
	);
	useEffect(() => {
		if (map) {
			map.getViewport().addEventListener('contextmenu', (event) => {
				setEventCoordinates(null);
				setFeature(null);
				setEventCoordinates(
					map.getCoordinateFromPixel(map.getEventPixel(event))
				);
				map.forEachFeatureAtPixel(
					map.getEventPixel(event),
					(feature, layer) => {
						if (feature.getGeometry().getType() !== 'Point') {
							setLayer(layer);
							setFeature(feature);
						}
					},
					{ hitTolerance: 5 }
				);
				CMRef.current.show(event);
			});
		}
	}, [map]);
	return (
		<PrimeContextMenu model={items} style={{ width: '260px' }} ref={CMRef} />
	);
}

export default MapContextMenu;
