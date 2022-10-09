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
	save,
} from '../../../../Mapping/Map';
import { cloudDrawingON } from '../../../../Mapping/Features/Clouds/Clouds';
import { frontFlowDrawingON } from '../../../../Mapping/Features/FrontFlow/FrontFlow';
import { useDispatch, useSelector } from 'react-redux';
import { setModal, setOption } from '../redux/actions';
import { jetDrawingON } from '../../../../Mapping/Features/Jet/Jet';

function Tools() {
	const map = useSelector((state) => state.map);
	const modal = useSelector((state) => state.modal);
	const option = useSelector((state) => state.option);

	const dispatch = useDispatch();

	const [undoRedo, setUndoRedo] = useState(null);

	const doubleClick = useCallback(
		(event) => {
			dispatch(setModal(''));
			map.forEachFeatureAtPixel(
				map.getEventPixel(event),
				(feature) => {
					if (feature.getGeometry().getType() !== 'Point') {
						dispatch(setModal(feature.get('feature_type')));
						dispatch(setOption(''));
					}
				},
				{ hitTolerance: 10 }
			);
		},
		[dispatch, map]
	);
	const nothing = useCallback(() => {
		if (map) {
			map.un('singleclick', zoomingInAndCenter);
			map.un('singleclick', zoomingOutAndCenter);
			map.getViewport().removeEventListener('dblclick', doubleClick);
			dragPanOff(map);
			endDrawing(map);
			selectOff(map);
			translateOff(map);
			document.querySelector('#map-container').style.cursor = 'unset';
		}
	}, [doubleClick, map]);

	const toggleToolsOption = useCallback(
		(Function) => {
			nothing();
			Function(map);
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

	useEffect(() => {
		if (map) {
			switch (option) {
				case 'zoom_in':
					zoom('zoom_in', zoomingInAndCenter);
					break;
				case 'zoom_out':
					zoom('zoom_out', zoomingOutAndCenter);
					break;
				case 'drag':
					dragAndTranslate();
					break;
				case 'zone_texte':
					console.log('not Define yet');
					break;
				case 'zone_nuageuse':
					toggleToolsOption(cloudDrawingON);
					break;
				case 'jet':
					toggleToolsOption(jetDrawingON);
					break;
				case 'courant_front':
					toggleToolsOption(frontFlowDrawingON);
					break;
				case 'cat':
					console.log('not Define yet');
					break;
				case 'ligne':
					console.log('not Define yet');
					break;
				case 'fleche':
					console.log('not Define yet');
					break;
				case 'centres_action':
					console.log('not Define yet');
					break;
				case 'volcan':
					console.log('not Define yet');
					break;
				case 'tropopause':
					console.log('not Define yet');
					break;
				case 'condition_en_surface':
					console.log('not Define yet');
					break;

				default:
					toggleToolsOption(selectOn);
					if (selectedFeature)
						map.getViewport().addEventListener('dblclick', doubleClick);
					break;
			}
		}
	}, [
		doubleClick,
		dragAndTranslate,
		map,
		option,
		selectedFeature,
		toggleToolsOption,
		zoom,
	]);

	const items = [
		{
			id: 'zoom_in',
			icon: '/Icons/Clouds/magnifying-glass-plus-solid.svg',
			alt: 'Zoom In icon',
			command: () => {
				option !== 'zoom_in'
					? dispatch(setOption('zoom_in'))
					: dispatch(setOption('select'));
			},
		},
		{
			id: 'zoom_out',
			icon: '/Icons/Clouds/magnifying-glass-minus-solid.svg',
			alt: 'Zoom Out icon',
			command: () => {
				option !== 'zoom_out'
					? dispatch(setOption('zoom_out'))
					: dispatch(setOption('select'));
			},
		},
		{
			id: 'drag',
			icon: '/Icons/Clouds/hand-solid.svg',
			alt: 'Drag icon',
			command: () => {
				option !== 'drag'
					? dispatch(setOption('drag'))
					: dispatch(setOption('select'));
			},
		},
		{
			id: 'zone_texte',
			icon: '/Icons/Clouds/message-regular.svg',
			alt: 'Zone de texte icon',
			command: () => {
				option !== 'zone_texte'
					? dispatch(setOption('zone_texte'))
					: dispatch(setOption('select'));
			},
		},
		{
			id: 'zone_nuageuse',
			icon: '/Icons/Clouds/cloud-solid.svg',
			alt: 'Zone nuageuse icon',
			command: () => {
				option !== 'zone_nuageuse'
					? dispatch(setOption('zone_nuageuse'))
					: dispatch(setOption(''));
			},
		},
		{
			id: 'jet',
			icon: '/Icons/Clouds/wind-solid.svg',
			alt: 'Courant jet icon',
			command: () => {
				option !== 'jet' ? dispatch(setOption('jet')) : dispatch(setOption(''));
			},
		},
		{
			id: 'courant_front',
			icon: '/Icons/Clouds/i-cursor-solid.svg',
			alt: 'front icon',
			command: () => {
				option !== 'courant_front'
					? dispatch(setOption('courant_front'))
					: dispatch(setOption('select'));
			},
		},
		{
			id: 'cat',
			icon: '/Icons/Clouds/i-cursor-solid.svg',
			alt: 'Cat icon',
			command: () => {
				option !== 'cat'
					? dispatch(setOption('cat'))
					: dispatch(setOption('select'));
			},
		},
		{
			id: 'ligne',
			icon: '/Icons/Clouds/i-cursor-solid.svg',
			alt: 'ligne icon',
			command: () => {
				option !== 'ligne'
					? dispatch(setOption('ligne'))
					: dispatch(setOption('select'));
			},
		},
		{
			id: 'fleche',
			icon: '/Icons/Clouds/i-cursor-solid.svg',
			alt: 'Flèche icon',
			command: () => {
				option !== 'fleche'
					? dispatch(setOption('fleche'))
					: dispatch(setOption('select'));
			},
		},
		{
			id: 'centres_action',
			icon: '/Icons/Clouds/centre_action.png',
			alt: "Centres d'action icon",
			command: () => {
				option !== 'centres_action'
					? dispatch(setOption('centres_action'))
					: dispatch(setOption('select'));
			},
		},
		{
			id: 'volcan',
			icon: '/Icons/Clouds/volcano-solid.svg',
			alt: 'Volcan icon',
			command: () => {
				option !== 'volcan'
					? dispatch(setOption('volcan'))
					: dispatch(setOption('select'));
			},
		},
		{
			id: 'tropopause',
			icon: '/Icons/Clouds/i-cursor-solid.svg',
			alt: 'tropopause icon',
			command: () => {
				option !== 'tropopause'
					? dispatch(setOption('tropopause'))
					: dispatch(setOption('select'));
			},
		},
		{
			id: 'condition_en_surface',
			icon: '/Icons/Clouds/flag.png',
			alt: 'text Zone icon',
			command: () => {
				option !== 'condition_en_surface'
					? dispatch(setOption('condition_en_surface'))
					: dispatch(setOption('select'));
			},
		},
	];

	return (
		<div className="tools">
			<button
				onClick={() => {
					save(map);
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
					disabled={modal !== ''}
					className={option === item.id ? 'active' : ''}>
					<img src={item.icon} alt={item.alt} height={20} width={20} />
				</button>
			))}
		</div>
	);
}

export default Tools;
