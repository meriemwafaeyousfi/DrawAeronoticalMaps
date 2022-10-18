import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ContextMenu as PrimeContextMenu } from 'primereact/contextmenu';
import './MapContextMenu.css';
import {
	addAHandle,
	deleteAHandle,
	deleteClouds,
} from 'Mapping/Features/Clouds/Clouds';
import { addPoigneFrontHandle } from 'Mapping/Features/FrontFlow/FrontFlow';
import {
	copyFeature,
	cutFeature,
	pastFeature,
	verticesCheck,
	verticesCheckPolygon,
} from 'Mapping/Map';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedFeature } from '../redux/actions';
import { addAHandleCat, deleteAHandleCat } from 'Mapping/Features/CAT/CAT';

function MapContextMenu() {
	const map = useSelector((state) => state.map);
	const selectedFeature = useSelector((state) => state.selectedFeature);
	const disptach = useDispatch();
	const CMRef = useRef(null);
	const [rightClickedFeature, setRightClickedFeature] = useState(null);
	const [eventCoordiantes, setEventCoordinates] = useState(null);
	const [layer, setLayer] = useState();
	const [vertex, setVertex] = useState(false);

	const items = [
		{
			label: 'Ajouter un poignée',
			icon: 'ajouter-poingee',
			visible:
				!!rightClickedFeature &&
				rightClickedFeature.get('feature_type') === 'zone_nuageuse' &&
				!vertex &&
				rightClickedFeature === selectedFeature,
			command: () => {
				addAHandle(eventCoordiantes, rightClickedFeature);
			},
		},
		{
			label: 'Ajouter un poignée',
			icon: 'ajouter-poingee',
			visible:
				!!rightClickedFeature &&
				rightClickedFeature.get('feature_type') === 'courant_front' &&
				!vertex &&
				rightClickedFeature === selectedFeature,
			command: () => {
				addPoigneFrontHandle(eventCoordiantes, rightClickedFeature);
			},
		},
		{
			label: 'Ajouter un poignée',
			icon: 'ajouter-poingee',
			visible:
				!!rightClickedFeature &&
				rightClickedFeature.get('feature_type') === 'CAT' &&
				!vertex &&
				rightClickedFeature === selectedFeature,
			command: () => {
				addAHandle(eventCoordiantes, rightClickedFeature);
			},
		},
		{
			label: 'Supprimer le poignée',
			icon: 'supprimer-poingee',
			visible:
				!!rightClickedFeature &&
				(rightClickedFeature.get('feature_type') === 'zone_nuageuse' ||
					rightClickedFeature.get('feature_type') === 'courant_front') &&
				vertex &&
				rightClickedFeature === selectedFeature,
			command: () => {
				deleteAHandle(eventCoordiantes, rightClickedFeature);
			},
		},
		{
			label: 'Supprimer le poignée',
			icon: 'supprimer-poingee',
			visible:
				!!rightClickedFeature &&
				rightClickedFeature.get('feature_type') === 'CAT' &&
				vertex &&
				rightClickedFeature === selectedFeature,
			command: () => {
				deleteAHandle(eventCoordiantes, rightClickedFeature);
			},
		},
		{
			label: 'Ajouter une zone de texte',
			icon: 'ajouter-zone-text',
			visible:
				!!rightClickedFeature &&
				rightClickedFeature.get('feature_type') === 'zone_nuageuse' &&
				rightClickedFeature === selectedFeature,
			command: () => {},
		},
		{
			label: 'Supprimer la zone de texte',
			icon: 'supprimer-zone-text',
			visible:
				!!rightClickedFeature &&
				rightClickedFeature.get('feature_type') === 'zone_nuageuse' &&
				rightClickedFeature === selectedFeature,
			command: () => {},
		},
		{
			label: 'Copier',
			icon: 'copie-figure',
			disabled: !rightClickedFeature || rightClickedFeature !== selectedFeature,
			command: () => {
				copyFeature(map, rightClickedFeature);
			},
		},
		{
			label: 'Couper',
			icon: 'couper-figure',
			disabled: !rightClickedFeature || rightClickedFeature !== selectedFeature,
			command: () => {
				cutFeature(map, rightClickedFeature);
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
			visible:
				!!rightClickedFeature &&
				rightClickedFeature !== selectedFeature &&
				rightClickedFeature.get('feature_type') === 'zone_nuageuse',
			command: () => {
				deleteClouds(selectedFeature, layer);
				disptach(setSelectedFeature(null));
			},
		},
		{
			label: 'Supprimer la figure',
			icon: 'supprimer-figure',
			visible:
				!!rightClickedFeature &&
				rightClickedFeature === selectedFeature &&
				rightClickedFeature.get('feature_type') === 'courant_front',
			command: () => {
				layer.getSource().removeFeature(rightClickedFeature);
				disptach(setSelectedFeature(null));
			},
		},
		{
			label: 'Supprimer la figure',
			icon: 'supprimer-figure',
			visible:
				!!rightClickedFeature &&
				rightClickedFeature === selectedFeature &&
				rightClickedFeature.get('feature_type') === 'CAT',
			command: () => {
				layer.getSource().removeFeature(rightClickedFeature);
				disptach(setSelectedFeature(null));
			},
		},
	];

	useEffect(() => {
		if (map) {
			map.getViewport().addEventListener('contextmenu', (event) => {
				setEventCoordinates(null);
				setRightClickedFeature(null);
				setVertex(false);
				const eventCoordinate = map.getCoordinateFromPixel(
					map.getEventPixel(event)
				);
				setEventCoordinates(eventCoordinate);
				map.forEachFeatureAtPixel(
					map.getEventPixel(event),
					(feature, layer) => {
						if (feature.getGeometry().getType() === 'LineString') {
							setLayer(layer);
							setRightClickedFeature(feature);
							setVertex(verticesCheck(eventCoordinate, feature));
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
