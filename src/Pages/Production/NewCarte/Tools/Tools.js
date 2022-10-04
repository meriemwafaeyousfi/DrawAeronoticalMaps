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
	dragPanOff,
} from '../../../../Mapping/Map';
import { cloudDrawingON } from '../../../../Mapping/Features/Clouds/Clouds';
import { jetFlowDrawingON } from '../../../../Mapping/Features/JetFlow/JetFlow';
import { frontFlowDrawingON } from '../../../../Mapping/Features/FrontFlow/FrontFlow';
import { useDispatch, useSelector } from 'react-redux';
import { setOption } from './actions';

function Tools({ map }) {
	let option = useSelector((state) => state.option);
	const modals = useSelector((state) => state.cloudyAreaModal);
	const dispatch = useDispatch();
	const [undoRedo, setUndoRedo] = useState(null);

	const nothing = useCallback(() => {
		if (map) {
			map.un('singleclick', zoomingInAndCenter);
			map.un('singleclick', zoomingOutAndCenter);
			dragPanOff(map);
			endDrawing(map);
			selectOff(map);
			translateOff(map);
			document.querySelector('#map-container').style.cursor = 'unset';
		}
	}, [map]);

	const toggleDrawingOptions = useCallback(
		(drawingFunction) => {
			nothing();
			drawingFunction(map);
		},
		[map, nothing]
	);

	const dragAndTranslate = useCallback(() => {
		nothing();
		map.getInteractions().forEach((interaction) => {
			if (interaction instanceof DragPan) {
				interaction.setActive(true);
			}
		});
		translateOn(map);
		document.querySelector('#map-container').style.cursor = 'grab';
	}, [map, nothing]);

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
			command: () => {
				toggleDrawingOptions(selectOn);
				dispatch(setOption('select'));
			},
		},
		{
			id: 'zoom_in',
			icon: '/Icons/Clouds/magnifying-glass-plus-solid.svg',
			alt: 'Zoom In icon',
			command: () => {
				zoom('zoom_in', zoomingInAndCenter);
				dispatch(setOption('zoom_in'));
			},
		},
		{
			id: 'zoom_out',
			icon: '/Icons/Clouds/magnifying-glass-minus-solid.svg',
			alt: 'Zoom Out icon',
			command: () => {
				zoom('zoom_out', zoomingOutAndCenter);
				dispatch(setOption('zoom_out'));
			},
		},
		{
			id: 'drag',
			icon: '/Icons/Clouds/hand-solid.svg',
			alt: 'Drag icon',
			command: () => {
				dragAndTranslate();
				dispatch(setOption('drag'));
			},
		},
		{
			id: 'zone_texte',
			icon: '/Icons/Clouds/message-regular.svg',
			alt: 'Zone de texte icon',
			command: () => {
				toggleDrawingOptions(jetFlowDrawingON);
				dispatch(setOption('zone_texte'));
			},
		},
		{
			id: 'zone_nuageuse',
			icon: '/Icons/Clouds/cloud-solid.svg',
			alt: 'Zone nuageuse icon',
			command: () => {
				toggleDrawingOptions(cloudDrawingON);
				dispatch(setOption('zone_nuageuse'));
			},
		},
		{
			id: 'courant_jet',
			icon: '/Icons/Clouds/wind-solid.svg',
			alt: 'Courant jet icon',
			command: () => {
				toggleDrawingOptions(jetFlowDrawingON);
				map.changed();
			},
		},
		{
			id: 'front',
			icon: '/Icons/Clouds/i-cursor-solid.svg',
			alt: 'front icon',
			command: () => {
				toggleDrawingOptions(frontFlowDrawingON);
				map.changed();
			},
		},
		{
			id: 'cat',
			icon: '/Icons/Clouds/i-cursor-solid.svg',
			alt: 'Cat icon',
			command: () => {
				toggleDrawingOptions(jetFlowDrawingON);
				map.changed();
			},
		},
		{
			id: 'ligne',
			icon: '/Icons/Clouds/i-cursor-solid.svg',
			alt: 'ligne icon',
			command: () => {
				toggleDrawingOptions(jetFlowDrawingON);
				map.changed();
			},
		},
		{
			id: 'fleche',
			icon: '/Icons/Clouds/i-cursor-solid.svg',
			alt: 'Flèche icon',
			command: () => {
				toggleDrawingOptions(jetFlowDrawingON);
				map.changed();
			},
		},
		{
			id: 'centres_action',
			icon: '/Icons/Clouds/i-cursor-solid.svg',
			alt: "Centres d'action icon",
			command: () => {
				toggleDrawingOptions(jetFlowDrawingON);
				map.changed();
			},
		},
		{
			id: 'volcan',
			icon: '/Icons/Clouds/volcano-solid.svg',
			alt: 'Volcan icon',
			command: () => {
				toggleDrawingOptions(jetFlowDrawingON);
				map.changed();
			},
		},
		{
			id: 'tropopause',
			icon: '/Icons/Clouds/i-cursor-solid.svg',
			alt: 'tropopause icon',
			command: () => {
				toggleDrawingOptions(jetFlowDrawingON);
				map.changed();
			},
		},
		{
			id: 'condition_en_surface',
			icon: '/Icons/Clouds/i-cursor-solid.svg',
			alt: 'text Zone icon',
			command: () => {
				toggleDrawingOptions(jetFlowDrawingON);
				map.changed();
			},
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
					onClick={item.command}
					key={key}
					id={item.id}
					disabled={modals}
					className={option === item.id ? 'active' : ''}>
					<img src={item.icon} alt={item.alt} height={20} width={20} />
				</button>
			))}
		</div>
	);
}

export default Tools;
