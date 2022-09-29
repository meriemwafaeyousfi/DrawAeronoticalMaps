import React, { useEffect, useRef, useState } from 'react';
import { ContextMenu as PrimeContextMenu } from 'primereact/contextmenu';
import './MapContextMenu.css';
import { addAHandle, deleteAHandle } from '../Features/Clouds/Clouds';
import { copyFeature, cutFeature, pastFeature, verticesCheck } from '../Map';

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
			visible:
				!!feature && feature.get('feature_type') === 'zone_nuageuse' && !vertex,
			command: () => {
				addAHandle(eventCoordiantes, feature);
			},
		},
		{
			label: 'Supprimer le poignée',
			icon: 'supprimer-poingee',
			visible:
				!!feature && feature.get('feature_type') === 'zone_nuageuse' && vertex,
			command: () => {
				deleteAHandle(eventCoordiantes, feature);
			},
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
			command: () => {
				cutFeature(map, feature);
			},
		},
		{
			label: 'Coller',
			icon: 'coller-figure',
			disabled:
				!!map && !(map.get('feature_copiee') || map.get('feature_coupee')),
			command: () => {
				pastFeature(map, layer, eventCoordiantes);
			},
		},
		{
			label: 'Supprimer la figure',
			icon: 'supprimer-figure',
			disabled: !feature,
			command: () => {
				layer.getSource().removeFeature(feature);
				map.getInteractions().forEach((interaction) => {
					if (interaction.get('title') === 'select_cloud') {
						interaction.changed();
					}
				});
			},
		},
	];

	useEffect(() => {
		if (map) {
			map.getViewport().addEventListener('contextmenu', (event) => {
				setEventCoordinates(null);
				setFeature(null);
				setVertex(false);
				const ec = map.getCoordinateFromPixel(map.getEventPixel(event));
				setEventCoordinates(ec);
				map.forEachFeatureAtPixel(
					map.getEventPixel(event),
					(feature, layer) => {
						if (feature.getGeometry().getType() !== 'Point') {
							setLayer(layer);
							setFeature(feature);
							setVertex(verticesCheck(ec, feature));
						}
					},
					{ hitTolerance: 10 }
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
