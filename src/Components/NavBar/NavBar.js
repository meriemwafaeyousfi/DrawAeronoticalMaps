import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menubar } from 'primereact/menubar';
import { Avatar } from 'primereact/avatar';

//styles
import './NavBar.css';

function NavBar() {
	const navigate = useNavigate();
	const items = [
		{
			label: 'Pointage',
			icon: 'pi pi-map-marker',
			items: [
				{
					label: 'Message',
					icon: 'pi pi-fw pi-envelope',
					command: () => {
						navigate('/pointage/messages', { replace: true });
					},
					items: [
						{
							label: 'Synop',
						},
						{
							label: 'Metar',
						},
						{
							label: 'Taf',
						},
						{
							label: 'Ship',
						},
					],
				},
				{
					label: 'Parametres',
					icon: 'pi pi-fw pi-sliders-h',
					command: () => {
						navigate('/pointage/parametres', { replace: true });
					},
					items: [
						{
							label: 'Tmax',
						},
						{
							label: 'Tmin',
						},
						{
							label: 'Précipitation',
						},
						{
							label: 'Vent',
						},
					],
				},
			],
		},
		{
			label: 'Configuration',
			icon: 'pi pi-fw pi-cog',
			items: [
				{
					label: 'Utilisateurs',
					icon: 'pi pi-fw pi-users',
					command: () => {
						navigate('/configuration/utilisateurs', { replace: true });
					},
				},
			],
		},
		{
			label: 'Satellite',
			icon: 'pi pi-wifi',
			items: [
				{
					label: 'RSS',
					command: () => {
						navigate('/satellite/rss', { replace: true });
					},
					items: [
						{
							label: 'IR 10.8',
						},
						{
							label: 'IR 10.8',
						},
						{
							label: 'IR 10.8',
						},
						{
							label: 'IR 10.8',
						},
					],
				},
				{
					label: 'M10',
					command: () => {
						navigate('/satellite/m10', { replace: true });
					},
					items: [
						{
							label: 'IR 10.8',
						},
						{
							label: 'IR 10.8',
						},
					],
				},
			],
		},
		{
			label: 'Production',
			icon: 'pi pi-map',
			items: [
				{
					label: 'Carte vierge',
					icon: 'pi pi-pencil',
					command: () => {
						navigate('/production/nouvelle_carte', {
							replace: true,
						});
					},
				},
				{
					label: 'Import BUFR',
					icon: 'pi pi-download',
					command: () => {
						navigate('/production/importe_bufr', {
							replace: true,
						});
					},
				},

				{
					label: 'Carte sauvegardée',
					icon: 'pi pi-save',
					command: () => {
						navigate('/production/carte_sauvegardees', {
							replace: true,
						});
					},
				},
			],
		},
	];

	const start = (
		<img alt="logo_ONM" src="/ONM_Logo.gif" height="40" className="logo"></img>
	);
	const end = <Avatar label="U" className="mr-2" size="large" shape="circle" />;

	return (
		<div>
			<div className="navbar">
				<Menubar model={items} start={start} end={end} className="content" />
			</div>
		</div>
	);
}

export default NavBar;
