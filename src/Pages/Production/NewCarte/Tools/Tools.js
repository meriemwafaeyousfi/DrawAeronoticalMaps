import React, { useCallback, useEffect, useState } from 'react';
import './Tools.css';
import { DragPan } from 'ol/interaction';
import UndoRedo from 'ol-ext/interaction/UndoRedo';
import {
	translateOff,
	translateOn,
	endDrawing,
	selectOff,
	selectOn,
	zoomingInAndCenter,
	zoomingOutAndCenter,
} from '../../../../Mapping/Map';
import { cloudDrawingStartEvent } from '../../../../Mapping/Features/Clouds/Clouds';
import { jetFlowDrawingStartEvent } from '../../../../Mapping/Features/JetFlow/JetFlow';

function Tools({ map }) {
	const [option, setOption] = useState('');
	const [undoRedo, setUndoRedo] = useState(null);

	const nothing = useCallback(() => {
		if (map) {
			map.getInteractions().forEach((interaction) => {
				if (interaction instanceof DragPan) {
					interaction.setActive(false);
				}
			});
			map.un('singleclick', zoomingInAndCenter);
			map.un('singleclick', zoomingOutAndCenter);
			map.getViewport().dispatchEvent(endDrawing);
			map.getViewport().dispatchEvent(selectOff);
			map.getViewport().dispatchEvent(translateOff);
			document.querySelector('#map-container').style.cursor = 'unset';
		}
	}, [map]);

	const toggleDrawingOptions = useCallback(
		(startEvent) => {
			nothing();
			map.getViewport().dispatchEvent(startEvent);
		},
		[map, nothing]
	);

	const dragAndTranslate = useCallback(
		(opt) => {
			nothing();
			map.getInteractions().forEach((interaction) => {
				if (interaction instanceof DragPan) {
					interaction.setActive(true);
				}
			});
			map.getViewport().dispatchEvent(translateOn);
			document.querySelector('#map-container').style.cursor = 'grab';
		},
		[map, nothing]
	);

	const zoom = useCallback(
		(opt, action) => {
			nothing();
			map.on('singleclick', action);
			document.querySelector('#map-container').style.cursor =
				opt === 'zoom_in' ? 'zoom-in' : 'zoom-out';
		},
		[map, nothing]
	);

	useEffect(() => {
		switch (option) {
			case 'select':
				toggleDrawingOptions(selectOn);
				break;
			case 'zoom_in':
				zoom(option, zoomingInAndCenter);
				break;
			case 'zoom_out':
				zoom(option, zoomingOutAndCenter);
				break;
			case 'drag':
				dragAndTranslate(option);
				break;
			case 'zone_texte':
				toggleDrawingOptions(jetFlowDrawingStartEvent);
				break;
			case 'zone_nuageuse':
				toggleDrawingOptions(cloudDrawingStartEvent);
				break;
			case 'courant_jet':
				toggleDrawingOptions(jetFlowDrawingStartEvent);
				break;
			case 'front':
				toggleDrawingOptions(jetFlowDrawingStartEvent);
				break;
			case 'cat':
				toggleDrawingOptions(jetFlowDrawingStartEvent);
				break;
			case 'ligne':
				toggleDrawingOptions(jetFlowDrawingStartEvent);
				break;
			case 'fleche':
				toggleDrawingOptions(jetFlowDrawingStartEvent);
				break;
			case 'centres_action':
				toggleDrawingOptions(jetFlowDrawingStartEvent);
				break;
			case 'volcan':
				toggleDrawingOptions(jetFlowDrawingStartEvent);
				break;
			case 'tropopause':
				toggleDrawingOptions(jetFlowDrawingStartEvent);
				break;
			case 'condition_en_surface':
				toggleDrawingOptions(jetFlowDrawingStartEvent);
				break;
			default:
				nothing();
				break;
		}
	}, [dragAndTranslate, nothing, option, toggleDrawingOptions, zoom]);

	const toggleOption = useCallback((event) => {
		const { id } = event.target;
		setOption((prev) => {
			if (prev === id) {
				return '';
			} else {
				return id;
			}
		});
	}, []);

	useEffect(() => {
		if (map) {
			const ur = new UndoRedo({
				maxLength: 10,
			});
			setUndoRedo(ur);
			map.addInteraction(ur);
		}
	}, [map]);
	const items = [
		{
			id: 'select',
			icon: '/Icons/Clouds/arrow-pointer-solid.svg',
			alt: 'Select icon',
		},
		{
			id: 'zoom_in',
			icon: '/Icons/Clouds/magnifying-glass-plus-solid.svg',
			alt: 'Zoom In icon',
		},
		{
			id: 'zoom_out',
			icon: '/Icons/Clouds/magnifying-glass-minus-solid.svg',
			alt: 'Zoom Out icon',
		},
		{
			id: 'drag',
			icon: '/Icons/Clouds/hand-solid.svg',
			alt: 'Drag icon',
		},
		{
			id: 'zone_texte',
			icon: '/Icons/Clouds/message-regular.svg',
			alt: 'Zone de texte icon',
		},
		{
			id: 'zone_nuageuse',
			icon: '/Icons/Clouds/cloud-solid.svg',
			alt: 'Zone nuageuse icon',
		},
		{
			id: 'courant_jet',
			icon: '/Icons/Clouds/wind-solid.svg',
			alt: 'Courant jet icon',
		},
		{
			id: 'front',
			icon: '/Icons/Clouds/i-cursor-solid.svg',
			alt: 'front icon',
		},
		{
			id: 'cat',
			icon: '/Icons/Clouds/i-cursor-solid.svg',
			alt: 'Cat icon',
		},
		{
			id: 'ligne',
			icon: '/Icons/Clouds/i-cursor-solid.svg',
			alt: 'ligne icon',
		},
		{
			id: 'fleche',
			icon: '/Icons/Clouds/i-cursor-solid.svg',
			alt: 'Flèche icon',
		},
		{
			id: 'centres_action',
			icon: '/Icons/Clouds/i-cursor-solid.svg',
			alt: "Centres d'action icon",
		},
		{
			id: 'volcan',
			icon: '/Icons/Clouds/volcano-solid.svg',
			alt: 'Volcan icon',
		},
		{
			id: 'tropopause',
			icon: '/Icons/Clouds/i-cursor-solid.svg',
			alt: 'tropopause icon',
		},
		{
			id: 'condition_en_surface',
			icon: '/Icons/Clouds/i-cursor-solid.svg',
			alt: 'text Zone icon',
		},
	];

	return (
		<div className="tools">
			<button
				onClick={() => {
					console.log('saved');
				}}
				id={'save'}>
				<img
					src="/Icons/Clouds/floppy-disk-solid.svg"
					alt="save"
					height={20}
					width={20}
				/>
			</button>
			<button
				onClick={() => {
					undoRedo.undo();
				}}
				id={'save'}>
				<img
					src="/Icons/Clouds/rotate-left-solid.svg"
					alt="undo"
					height={20}
					width={20}
				/>
			</button>
			<button
				onClick={() => {
					undoRedo.redo();
				}}
				id={'save'}>
				<img
					src="/Icons/Clouds/rotate-right-solid.svg"
					alt="redo"
					height={20}
					width={20}
				/>
			</button>
			{items.map((item, key) => (
				<button
					onClick={toggleOption}
					key={key}
					id={item.id}
					className={option === item.id ? 'active' : ''}>
					<img src={item.icon} alt={item.alt} height={20} width={20} />
				</button>
			))}
		</div>
	);
}

export default Tools;
