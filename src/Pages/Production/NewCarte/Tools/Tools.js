import React, { useCallback, useState } from 'react';
import './Tools.css';
import { DragPan } from 'ol/interaction';
import {
	clearAllInteractions,
	endDrawing,
	zoomingInAndCenter,
	zoomingOutAndCenter,
} from '../../../../Mapping/Map';
import { cloudDrawingStartEvent } from '../../../../Mapping/Features/Clouds/Clouds';
import { jetFlowDrawingStartEvent } from '../../../../Mapping/Features/JetFlow/JetFlow';

function Tools({ map }) {
	const [option, setOption] = useState('');

	const disableOptions = useCallback(() => {
		let tmp = document.querySelectorAll('.tools button');
		tmp.forEach((Element) => {
			Element.classList.remove('active');
		});
	}, []);

	/* 	const toggleOption = useCallback(
		(option, cursor = 'unset') => {
			disableOptions();
			document.querySelector('#map-container').style.cursor = 'unset';
			clearAllInteractions(map);
			map.un('singleclick', zoomingInAndCenter);
			map.un('singleclick', zoomingOutAndCenter);
			setOption((prev) => {
				if (prev === option) {
					return '';
				} else {
					switch (option) {
						case 'zoom_in':
							map.on('singleclick', zoomingInAndCenter);
							break;
						case 'zoom_out':
							map.on('singleclick', zoomingOutAndCenter);
							break;
						case 'drag':
							map.addInteraction(new DragPan());
							break;
						default:
							break;
					}
					document.getElementById(option).classList.add('active');
					document.querySelector('#map-container').style.cursor = cursor;
					return option;
				}
			});
		},
		[disableOptions, map, setOption]
	); */

	const toggleDrawingOptions = useCallback(
		(option, startEvent, endEvent) => {
			disableOptions();
			map.getViewport().dispatchEvent(endEvent);
			setOption((prev) => {
				if (prev === option) {
					document.getElementById(option).classList.remove('active');
					return '';
				} else {
					document.getElementById(option).classList.add('active');
					map.getViewport().dispatchEvent(startEvent);
					return option;
				}
			});
		},
		[disableOptions, map]
	);
	const items = [
		{
			id: 'save',
			icon: '/Icons/Clouds/floppy-disk-solid.svg',
			alt: 'Save icon',
			command: () => {
				console.log('saved');
			},
		},
		{
			id: 'select',
			icon: '/Icons/Clouds/arrow-pointer-solid.svg',
			alt: 'Select icon',
			command: () => {
				console.log('saved');
			},
		},
		{
			id: 'zoom_in',
			icon: '/Icons/Clouds/magnifying-glass-plus-solid.svg',
			alt: 'Zoom In icon',
			command: () => {
				console.log('saved');
			},
		},
		{
			id: 'zoom_out',
			icon: '/Icons/Clouds/magnifying-glass-minus-solid.svg',
			alt: 'Zoom Out icon',
			command: () => {
				console.log('saved');
			},
		},
		{
			id: 'drag',
			icon: '/Icons/Clouds/hand-solid.svg',
			alt: 'Drag icon',
			command: (event) => {
				console.log('saved');
			},
		},
		{
			id: 'undo',
			icon: '/Icons/Clouds/rotate-left-solid.svg',
			alt: 'Undo icon',
			command: () => {
				console.log('undo');
			},
		},
		{
			id: 'redo',
			icon: '/Icons/Clouds/rotate-right-solid.svg',
			alt: 'Redo icon',
			command: () => {
				console.log('redo');
			},
		},
		{
			id: 'zone_texte',
			icon: '/Icons/Clouds/message-regular.svg',
			alt: 'Zone de texte icon',
			command: () => {
				toggleDrawingOptions('zone_texte', cloudDrawingStartEvent, endDrawing);
			},
		},
		{
			id: 'zone_nuageuse',
			icon: '/Icons/Clouds/cloud-solid.svg',
			alt: 'Zone nuageuse icon',
			command: () => {
				toggleDrawingOptions(
					'zone_nuageuse',
					cloudDrawingStartEvent,
					endDrawing
				);
			},
		},
		{
			id: 'courant_jet',
			icon: '/Icons/Clouds/wind-solid.svg',
			alt: 'Courant jet icon',
			command: () => {
				toggleDrawingOptions(
					'courant_jet',
					jetFlowDrawingStartEvent,
					endDrawing
				);
			},
		},
		{
			id: 'front',
			icon: '/Icons/Clouds/i-cursor-solid.svg',
			alt: 'front icon',
			command: () => {
				toggleDrawingOptions('front', jetFlowDrawingStartEvent, endDrawing);
			},
		},
		{
			id: 'cat',
			icon: '/Icons/Clouds/i-cursor-solid.svg',
			alt: 'Cat icon',
			command: () => {
				toggleDrawingOptions('cat', jetFlowDrawingStartEvent, endDrawing);
			},
		},
		{
			id: 'ligne',
			icon: '/Icons/Clouds/i-cursor-solid.svg',
			alt: 'ligne icon',
			command: () => {
				toggleDrawingOptions('ligne', jetFlowDrawingStartEvent, endDrawing);
			},
		},
		{
			id: 'fleche',
			icon: '/Icons/Clouds/i-cursor-solid.svg',
			alt: 'Flèche icon',
			command: () => {
				toggleDrawingOptions('fleche', jetFlowDrawingStartEvent, endDrawing);
			},
		},
		{
			id: 'centres_action',
			icon: '/Icons/Clouds/i-cursor-solid.svg',
			alt: "Centres d'action icon",
			command: () => {
				toggleDrawingOptions(
					'centres_action',
					jetFlowDrawingStartEvent,
					endDrawing
				);
			},
		},
		{
			id: 'volcan',
			icon: '/Icons/Clouds/volcano-solid.svg',
			alt: 'Volcan icon',
			command: () => {
				toggleDrawingOptions('volcan', jetFlowDrawingStartEvent, endDrawing);
			},
		},
		{
			id: 'tropopause',
			icon: '/Icons/Clouds/i-cursor-solid.svg',
			alt: 'tropopause icon',
			command: () => {
				toggleDrawingOptions(
					'tropopause',
					jetFlowDrawingStartEvent,
					endDrawing
				);
			},
		},
		{
			id: 'condition_en_surface',
			icon: '/Icons/Clouds/i-cursor-solid.svg',
			alt: 'text Zone icon',
			command: () => {
				toggleDrawingOptions(
					'condition_en_surface',
					jetFlowDrawingStartEvent,
					endDrawing
				);
			},
		},
	];

	return (
		<div className="tools">
			{items.map((item, key) => (
				<button onClick={item.command} key={key} id={item.id}>
					<img src={item.icon} alt={item.alt} height={20} width={20} />
				</button>
			))}
		</div>
	);
}

export default Tools;
