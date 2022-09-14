import React from 'react';
import { ContextMenu as PrimeContextMenu } from 'primereact/contextmenu';
import './ContextMenu.css';

function ContextMenu({ map }) {
	const items = [
		{
			label: 'Ajouter un poignée',
			icon: 'ajouter-poingee',
			command: () => {
				console.log('mark added');
			},
		},
		{
			label: 'Supprimer le poignée',
			icon: 'supprimer-poingee',
			command: () => {
				console.log('mark added');
			},
		},
		{
			label: 'Supprimer la zone de text',
			icon: 'supprimer-zone-text',
			command: () => {
				console.log('mark added');
			},
		},
		{
			label: 'Ajouter un Zone de text',
			icon: 'ajouter-zone-text ',
			command: () => {
				console.log('mark added');
			},
		},
		{
			separator: true,
		},
		{
			label: 'Coupie',
			icon: 'copie-figure ',
			command: () => {
				console.log('mark added');
			},
		},
		{
			label: 'Coller',
			icon: 'coller-figure',
			command: () => {
				console.log('mark added');
			},
		},
		{
			label: 'Couper',
			icon: 'couper-figure ',
			command: () => {
				console.log('mark added');
			},
		},
		{
			label: 'Supprimer la figure',
			icon: 'supprimer-figure ',
			command: () => {
				console.log('mark added');
			},
		},
	];

	return <PrimeContextMenu global model={items} style={{ width: '250px' }} />;
}

export default ContextMenu;
