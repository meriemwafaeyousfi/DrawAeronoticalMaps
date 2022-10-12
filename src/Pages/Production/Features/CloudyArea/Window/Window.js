import React, { useCallback, useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Loc, Qte, Type, Images } from '../../../../../Helpers/data';

import './Window.css';
import {
	alignOverlayContent,
	updateOverlayContent,
} from '../../../../../Mapping/Features/Clouds/TextOverLay';
import {
	deleteCloudFeature,
	inverseFeature,
} from '../../../../../Mapping/Features/Clouds/Clouds';
import { useDispatch, useSelector } from 'react-redux';
import {
	setModal,
	setOption,
	setSelectedFeature,
} from '../../../NewCarte/redux/actions';
function Window({ vectorLayer }) {
	const map = useSelector((state) => state.map);
	const selectedFeature = useSelector((state) => state.selectedFeature);
	const disptach = useDispatch();

	const [backupFeature, setBackupFeature] = useState(null);
	const [selectedFeatureStyle, setSelectedFeatureStyle] = useState({
		color: '#000000',
		width: 2,
	});

	const [alignement, setAlignement] = useState('Gauche');

	const [fraction, setFraction] = useState({
		numenator: '0',
		denominator: '0',
	});

	const [text, setText] = useState('');

	const handleChange = useCallback((event) => {
		const { value } = event.target;
		setText((prev) => {
			let splitText = prev.split(' ');
			if (splitText.includes(value)) {
				splitText = splitText.filter((word) => word !== value);
				return splitText.join(' ');
			} else {
				if (prev !== '') {
					return prev + ' ' + value;
				} else {
					return value;
				}
			}
		});
	}, []);

	const handleText = useCallback((event) => {
		const { value } = event.target;
		setText(value);
	}, []);

	const fractionChange = useCallback((event) => {
		const { id, value } = event.target;
		setFraction((prev) => ({
			...prev,
			[id]: value,
		}));
	}, []);

	const insertFraction = useCallback(() => {
		setText((prev) => {
			if (prev === '') {
				return (
					(fraction.numenator === '0' ? 'XXX' : fraction.numenator) +
					'/' +
					(fraction.denominator === '0' ? 'XXX' : fraction.denominator)
				);
			} else {
				return (
					prev +
					' ' +
					(fraction.numenator === '0' ? 'XXX' : fraction.numenator) +
					'/' +
					(fraction.denominator === '0' ? 'XXX' : fraction.denominator)
				);
			}
		});
	}, [fraction]);

	const handleAlignement = useCallback(
		(event) => {
			if (selectedFeature) {
				const { value } = event.target;
				setAlignement(value);
				selectedFeature.set('alignement', value);
				alignOverlayContent(map.getOverlayById(selectedFeature.ol_uid), value);
			}
		},
		[map, selectedFeature]
	);

	const handleFeatureStyleChange = useCallback(
		(event) => {
			const { id, value } = event.target;
			setSelectedFeatureStyle((prev) => ({
				...prev,
				[id]: value,
			}));
			selectedFeature.set(id, value);
		},
		[selectedFeature]
	);

	useEffect(() => {
		if (selectedFeature) {
			setBackupFeature(selectedFeature.clone());
			setSelectedFeatureStyle({
				color: selectedFeature.get('color'),
				width: selectedFeature.get('width'),
			});
			setText(selectedFeature.get('text'));
			setAlignement(selectedFeature.get('alignement'));
		} else {
			setSelectedFeatureStyle({
				color: '#000000',
				width: 2,
			});
			setText('');
			setAlignement('Gauche');
		}
	}, [selectedFeature]);

	const inverse = useCallback(() => {
		selectedFeature && inverseFeature(selectedFeature);
	}, [selectedFeature]);

	const handleConfirm = useCallback(() => {
		disptach(setOption(''));
		disptach(setModal(''));
	}, [disptach]);

	const handleCancel = useCallback(() => {
		deleteCloudFeature(map, vectorLayer, selectedFeature);
		vectorLayer.getSource().addFeature(backupFeature);
		disptach(setSelectedFeature(backupFeature));
		disptach(setOption(''));
		disptach(setModal(''));
	}, [backupFeature, disptach, map, selectedFeature, vectorLayer]);

	useEffect(() => {
		if (map && selectedFeature) {
			selectedFeature.set('text', text);
			updateOverlayContent(map, selectedFeature);
		}
	}, [text, selectedFeature, map]);

	return (
		<Dialog
			header="Zone nuaguse"
			headerClassName="cloudWindowHeader"
			contentClassName="cloudWindowContent"
			position="bottom-left"
			modal={false}
			visible={true}
			className="cloudWindow"
			keepInViewport={false}
			dismissableMask={false}
			closable={false}>
			<div className="content_container">
				<div className="col_4">
					<h4>Loc</h4>
					<div className="choosing_panel">
						{Loc.map((L, key) => (
							<button
								key={key}
								className={text.split(' ').includes(L.label) ? 'active' : ''}
								value={L.label}
								onClick={handleChange}>
								{L.label}
							</button>
						))}
					</div>
				</div>
				<div className="col_4">
					<h4>Qté</h4>
					<div className="choosing_panel">
						{Qte.map((Q, key) => (
							<button
								key={key}
								className={text.split(' ').includes(Q.label) ? 'active' : ''}
								value={Q.label}
								onClick={handleChange}>
								{Q.label}
							</button>
						))}
					</div>
				</div>
				<div className="col_4">
					<h4>Type</h4>
					<div className="choosing_panel">
						{Type.map((T, key) => (
							<button
								key={key}
								className={text.split(' ').includes(T.label) ? 'active' : ''}
								value={T.label}
								onClick={handleChange}>
								{T.label}
							</button>
						))}
					</div>
				</div>
				<div className="col_8">
					<div className="signImages">
						{Images.map((Image, key) => (
							<button
								key={key}
								value={Image.value}
								onClick={handleChange}
								className={
									text.split(' ').includes(Image.value) ? 'active' : ''
								}>
								<img
									src={Image.src}
									alt={Image.alt}
									style={{ pointerEvents: 'none', height: '2rem' }}
								/>
							</button>
						))}
					</div>
				</div>
				<div className="col_4">
					<div className="Niveau">
						<h4>Niveau</h4>
						<div className="input_field">
							<label htmlFor="numenator">Haut</label>
							<input
								id="numenator"
								type="text"
								autoComplete="off"
								value={fraction.numenator}
								onChange={fractionChange}
							/>
						</div>
						<div className="input_field">
							<label htmlFor="denominator">bas</label>
							<input
								id="denominator"
								type="text"
								autoComplete="off"
								value={fraction.denominator}
								onChange={fractionChange}
							/>
						</div>
						<button
							id="show"
							style={{ padding: '5px' }}
							onClick={insertFraction}>
							Insérer
						</button>
					</div>
				</div>
				<div className="col_8">
					<div className="text">
						<h4>Texte</h4>
						<textarea value={text} onChange={handleText} />
						<div className="input_field">
							<label htmlFor="alignement">Alignement</label>
							<select onChange={handleAlignement} value={alignement}>
								<option value={'Gauche'}>Gauche</option>
								<option value={'Centre'}>Centre</option>
								<option value={'Droite'}>Droite</option>
							</select>
						</div>
					</div>
				</div>
				<div className="col_4">
					<div className="courbe">
						<h4>Courbe</h4>
						<div className="input_field">
							<label htmlFor="color">Couleur</label>
							<input
								type="color"
								id="color"
								value={selectedFeatureStyle.color}
								onChange={handleFeatureStyleChange}
							/>
						</div>
						<div className="input_field">
							<label htmlFor="width">Epaisseur</label>
							<input
								type="number"
								id="width"
								autoComplete="off"
								value={selectedFeatureStyle.width}
								onChange={handleFeatureStyleChange}
							/>
						</div>
						<button style={{ padding: '5px' }} onClick={inverse}>
							Inverser
						</button>
					</div>
				</div>
				<div className="confirmation_buttons">
					<div>
						<button onClick={handleConfirm}>Confirmer</button>
					</div>
					<div>
						<button onClick={handleCancel}>Annuler</button>
					</div>
				</div>
			</div>
		</Dialog>
	);
}

export default Window;
