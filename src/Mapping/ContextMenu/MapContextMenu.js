import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ContextMenu as PrimeContextMenu } from 'primereact/contextmenu';
import './MapContextMenu.css';

function MapContextMenu({ map }) {
	const CMRef = useRef(null);
	const [featureType, setFeatureType] = useState('');
	const [vertex, setVertex] = useState(false);

	const generateItem = useCallback(() => {
		let items = [];
		if (featureType !== '') {
			items = [
				{
					label: 'Copier',
					icon: 'copie-figure',
					command: (event) => {},
				},
				{
					label: 'Coller',
					icon: 'coller-figure',
					command: (event) => {},
				},
				{
					label: 'Couper',
					icon: 'couper-figure',
					command: (event) => {},
				},
				{ separator: true },
				{
					label: 'Supprimer la figure',
					icon: 'supprimer-figure',
					command: (event) => {},
				},
			];

			if (featureType === 'cloud') {
				items.push(
					{
						label: 'Ajouter une zone de texte',
						icon: 'ajouter-zone-text',
						command: () => {},
					},
					{
						label: 'Supprimer la zone de texte',
						icon: 'supprimer-zone-text',
						command: () => {},
					}
				);
			}

			if (vertex) {
				items.push({
					label: 'Supprimer le poignée',
					icon: 'supprimer-poingee',
					command: (event) => {
						setVertex(false);
					},
				});
			} else {
				items.push({
					label: 'Ajouter un poignée',
					icon: 'ajouter-poingee',
					command: (event) => {
						setVertex(true);
					},
				});
			}
		} else {
			items = [
				{
					label: 'Random Action',
					command: () => {},
				},
				{
					label: 'Random Action',
					command: () => {},
				},
				{
					label: 'Random Action',
					command: () => {},
				},
				{
					label: 'Random Action',
					command: () => {},
				},
				{
					label: 'Random Action',
					command: () => {},
				},
			];
		}
		return items;
	}, [featureType, vertex]);

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
			/* map.getViewport().addEventListener('contextmenu', (event) => {
				generateItem();
				map.forEachFeatureAtPixel(
					map.getEventPixel(event),
					(feature) => {
						setFeatureType(feature.get('featureType'));
					},
					{ hitTolerance: 10 }
				);
				CMRef.current.show(event);
			}); */
		}
	}, [generateItem, map]);
	return (
		<PrimeContextMenu
			model={generateItem()}
			style={{ width: '250px' }}
			ref={CMRef}
		/>
	);
}

export default MapContextMenu;
