import React, { useCallback, useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';

import './Window.css';
import { useDispatch, useSelector } from 'react-redux';
import { setModal, setOption } from '../../../CardDrawingTools/redux/actions';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { forces } from 'Helpers/data';
import { createAndUpdateOverlays } from 'Mapping/Features/CAT/CATOverlay';
import { InputText } from 'primereact/inputtext';

function Window({ vectorLayer }) {
	const map = useSelector((state) => state.map);
	const selectedFeature = useSelector((state) => state.selectedFeature);
	const disptach = useDispatch();

	const [forceType, setForceType] = useState('');
	const [fraction, setFraction] = useState({
		numenator: 'XXX',
		denominator: 'XXX',
	});
	const [backupFeature, setBackupFeature] = useState(null);

	const handleForceChange = useCallback(
		(event) => {
			setForceType(event.value);
			console.log(event.value);
			if (selectedFeature) selectedFeature.set('type_force', event.value);
		},
		[selectedFeature]
	);

	const handleConfirm = useCallback(() => {
		disptach(setOption('select'));
		disptach(setModal(''));
	}, [disptach]);

	const handleCancel = useCallback(() => {
		vectorLayer.getSource().removeFeature(selectedFeature);
		backupFeature.setStyle([backupFeature.getStyle()(backupFeature)[0]]);
		vectorLayer.getSource().addFeature(backupFeature);
		disptach(setOption('select'));
		disptach(setModal(''));
	}, [backupFeature, disptach, selectedFeature, vectorLayer]);

	const handleFractionChange = useCallback(
		(event) => {
			console.log(event);
			const { id, value } = event.target;
			selectedFeature.set(id, value);
			setFraction((prev) => ({
				...prev,
				[id]: value,
			}));
		},
		[selectedFeature]
	);
	useEffect(() => {
		if (selectedFeature) {
			setForceType(selectedFeature.get('type_force'));
			setFraction((prev) => ({
				...prev,
				numenator: selectedFeature.get('numenator'),
			}));

			setFraction((prev) => ({
				...prev,
				denominator: selectedFeature.get('denominator'),
			}));
		}
	}, [selectedFeature]);

	useEffect(() => {
		createAndUpdateOverlays(vectorLayer);
	}, [fraction, vectorLayer, forceType]);
	return (
		<Dialog
			header="Zone de turbulence (CAT)"
			position="bottom-left"
			modal={false}
			visible={true}
			keepInViewport={false}
			dismissableMask={false}
			closable={false}>
			<div>
				<div className="col-12 grid p-fluid">
					<div className="col-3">
						<h5>N°</h5>
						<InputNumber
							inputId="numCat"
							value={selectedFeature.get('numCat')}
							disabled={true}
						/>
					</div>
					<div className="col-9">
						<h5>Direction</h5>
						<Dropdown
							value={forceType}
							options={forces}
							onChange={handleForceChange}
							optionLabel="label"
							placeholder="Direction"
						/>
					</div>
				</div>
				<div className="col-12 grid p-fluid">
					<div className="col-6">
						<h5>Haut</h5>
						<InputText
							value={fraction.numenator}
							onChange={handleFractionChange}
							id="numenator"
						/>
					</div>
					<div className="col-6">
						<h5>Bas</h5>
						<InputText
							value={fraction.denominator}
							onChange={handleFractionChange}
							id="denominator"
						/>
					</div>
				</div>
				<div className="grid">
					<div className="col-6">
						<Button
							label="Confirmer"
							className="p-button-warning"
							onClick={handleConfirm}
						/>
					</div>
					<div className="col-6">
						<Button
							label="Annuler"
							className="p-button-secondary"
							onClick={handleCancel}
						/>
					</div>
				</div>
			</div>
		</Dialog>
	);
}

export default Window;
