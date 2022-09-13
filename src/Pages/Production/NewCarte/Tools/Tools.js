import React, { useCallback } from 'react';
import './Tools.css';

function Tools({ option, setOption }) {
	const toggle = useCallback(
		(name) => {
			if (option === name) {
				setOption('');
			} else {
				setOption(name);
			}
		},
		[option, setOption]
	);
	const items = [
		{
			id: 'save',
			icon: '/Icons/Clouds/floppy-disk-solid.svg',
			alt: 'Save icon',
			command: () => {
				toggle('text');
			},
		},
		{
			id: 'select',
			icon: '/Icons/Clouds/arrow-pointer-solid.svg',
			alt: 'Select icon',
			command: () => {
				toggle('text');
			},
		},
		{
			id: 'zoomin',
			icon: '/Icons/Clouds/magnifying-glass-plus-solid.svg',
			alt: 'Zoom In icon',
			command: () => {
				toggle('text');
			},
		},
		{
			id: 'zoomout',
			icon: '/Icons/Clouds/magnifying-glass-minus-solid.svg',
			alt: 'Zoom Out icon',
			command: () => {
				toggle('text');
			},
		},
		{
			id: 'drag',
			icon: '/Icons/Clouds/hand-solid.svg',
			alt: 'Drag icon',
			command: () => {
				toggle('text');
			},
		},
		{
			id: 'undo',
			icon: '/Icons/Clouds/rotate-left-solid.svg',
			alt: 'Undo icon',
			command: () => {
				toggle('text');
			},
		},
		{
			id: 'redo',
			icon: '/Icons/Clouds/rotate-right-solid.svg',
			alt: 'Redo icon',
			command: () => {
				toggle('text');
			},
		},
		{
			id: 'clouds',
			icon: '/Icons/Clouds/cloud-solid.svg',
			alt: 'cloud icon',
			command: () => {
				toggle('clouds');
			},
		},
		{
			id: 'jet',
			icon: '/Icons/Clouds/wind-solid.svg',
			alt: 'Jet icon',
			command: () => {
				toggle('jet');
			},
		},
		{
			id: 'text',
			icon: '/Icons/Clouds/i-cursor-solid.svg',
			alt: 'text Zone icon',
			command: () => {
				toggle('text');
			},
		},
		{
			id: 'text',
			icon: '/Icons/Clouds/i-cursor-solid.svg',
			alt: 'text Zone icon',
			command: () => {
				toggle('text');
			},
		},
		{
			id: 'text',
			icon: '/Icons/Clouds/i-cursor-solid.svg',
			alt: 'text Zone icon',
			command: () => {
				toggle('text');
			},
		},
		{
			id: 'text',
			icon: '/Icons/Clouds/i-cursor-solid.svg',
			alt: 'text Zone icon',
			command: () => {
				toggle('text');
			},
		},
		{
			id: 'text',
			icon: '/Icons/Clouds/i-cursor-solid.svg',
			alt: 'text Zone icon',
			command: () => {
				toggle('text');
			},
		},
		{
			id: 'text',
			icon: '/Icons/Clouds/i-cursor-solid.svg',
			alt: 'text Zone icon',
			command: () => {
				toggle('text');
			},
		},
		{
			id: 'text',
			icon: '/Icons/Clouds/i-cursor-solid.svg',
			alt: 'text Zone icon',
			command: () => {
				toggle('text');
			},
		},
		{
			id: 'text',
			icon: '/Icons/Clouds/i-cursor-solid.svg',
			alt: 'text Zone icon',
			command: () => {
				toggle('text');
			},
		},
		{
			id: 'text',
			icon: '/Icons/Clouds/i-cursor-solid.svg',
			alt: 'text Zone icon',
			command: () => {
				toggle('text');
			},
		},
		{
			id: 'text',
			icon: '/Icons/Clouds/i-cursor-solid.svg',
			alt: 'text Zone icon',
			command: () => {
				toggle('text');
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
