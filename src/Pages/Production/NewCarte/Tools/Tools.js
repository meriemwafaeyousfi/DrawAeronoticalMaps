import React, { useCallback, useEffect } from 'react';
import './Tools.css';
import { DragPan } from 'ol/interaction';

function Tools({ map, option, setOption }) {
	const disableOptions = useCallback(() => {
		let tmp = document.querySelectorAll('.tools button');
		tmp.forEach((Element) => {
			Element.classList.remove('active');
		});
	}, []);

	useEffect(() => {
		if (option !== '') {
		} else {
			if (map) {
				map.getInteractions().forEach((interaction) => {
					console.log(interaction);
				});
			}
			document.querySelector('body').style.cursor = 'unset';
		}
	}, [map, disableOptions, option]);

	const toggle = useCallback(
		(name) => {
			setOption((prev) => {
				if (prev === name) {
					return '';
				} else {
					return name;
				}
			});
		},
		[setOption]
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
				toggle('select');
				disableOptions();
				document.getElementById('select').classList.add('active');
				document.querySelector('body').style.cursor = 'unset';
			},
		},
		{
			id: 'zoom_in',
			icon: '/Icons/Clouds/magnifying-glass-plus-solid.svg',
			alt: 'Zoom In icon',
			command: () => {
				toggle('zoom_in');
				document.querySelector('body').style.cursor = 'zoom-in';
			},
		},
		{
			id: 'zoom_out',
			icon: '/Icons/Clouds/magnifying-glass-minus-solid.svg',
			alt: 'Zoom Out icon',
			command: () => {
				toggle('zoom_out');
				document.querySelector('body').style.cursor = 'zoom-out';
			},
		},
		{
			id: 'drag',
			icon: '/Icons/Clouds/hand-solid.svg',
			alt: 'Drag icon',
			command: (event) => {
				setOption((prev) => {
					if (prev === 'drag') {
						document.getElementById('drag').classList.remove('active');
						map.getInteractions().forEach((interaction) => {
							if (interaction instanceof DragPan) {
								map.removeInteraction(interaction);
							}
						});
						return '';
					} else {
						document.getElementById('drag').classList.add('active');
						document.querySelector('body').style.cursor = 'grab';
						map.addInteraction(new DragPan());
						return 'drag';
					}
				});
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
				toggle('zone_texte');
			},
		},
		{
			id: 'zone_nuageuse',
			icon: '/Icons/Clouds/cloud-solid.svg',
			alt: 'Zone nuageuse icon',
			command: () => {
				toggle('zone_nuageuse');
			},
		},
		{
			id: 'courant_jet',
			icon: '/Icons/Clouds/wind-solid.svg',
			alt: 'Courant jet icon',
			command: () => {
				toggle('courant_jet');
			},
		},
		{
			id: 'front',
			icon: '/Icons/Clouds/i-cursor-solid.svg',
			alt: 'front icon',
			command: () => {
				toggle('front');
			},
		},
		{
			id: 'cat',
			icon: '/Icons/Clouds/i-cursor-solid.svg',
			alt: 'Cat icon',
			command: () => {
				toggle('cat');
			},
		},
		{
			id: 'ligne',
			icon: '/Icons/Clouds/i-cursor-solid.svg',
			alt: 'ligne icon',
			command: () => {
				toggle('ligne');
			},
		},
		{
			id: 'fleche',
			icon: '/Icons/Clouds/i-cursor-solid.svg',
			alt: 'Flèche icon',
			command: () => {
				toggle('fleche');
			},
		},
		{
			id: 'centres_action',
			icon: '/Icons/Clouds/i-cursor-solid.svg',
			alt: "Centres d'action icon",
			command: () => {
				toggle('centres_action');
			},
		},
		{
			id: 'volcan',
			icon: '/Icons/Clouds/volcano-solid.svg',
			alt: 'Volcan icon',
			command: () => {
				toggle('volcan');
			},
		},
		{
			id: 'tropopause',
			icon: '/Icons/Clouds/i-cursor-solid.svg',
			alt: 'tropopause icon',
			command: () => {
				toggle('tropopause');
			},
		},
		{
			id: 'condition_en_surface',
			icon: '/Icons/Clouds/i-cursor-solid.svg',
			alt: 'text Zone icon',
			command: () => {
				toggle('condition_en_surface');
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
