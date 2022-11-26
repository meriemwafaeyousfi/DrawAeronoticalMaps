import React, { useCallback, useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';

import './Window.css';
import { useDispatch, useSelector } from 'react-redux';
import { setModal, setOption } from '../../../CardDrawingTools/redux/actions';
import { Button } from 'primereact/button';
import { pictos1, pictos2, pictos3 } from 'Helpers/data';
import { Slider } from 'primereact/slider';

function Window({ vectorLayer }) {
	const map = useSelector((state) => state.map);
	const selectedFeature = useSelector((state) => state.selectedFeature);
	const disptach = useDispatch();
	const [forceType, setForceType] = useState('');
	const [namePicto, setNamePicto] = useState('');
	const [backupFeature, setBackupFeature] = useState(null);
	const [pictoScale, setPictoScale] = useState(1);

	const handleChangeNamePicto = useCallback(
		(event) => {
			setNamePicto(event.target.name);
			if (selectedFeature) selectedFeature.set('name_picto', event.target.name);
		},
		[selectedFeature]
	);
	const handlePictoScaleChange = useCallback(
		(e) => {
			setPictoScale(e.value);
			selectedFeature.set('scale', e.value);
		},
		[selectedFeature]
	);

	const handleConfirm = useCallback(() => {
		disptach(setOption('select'));
		disptach(setModal(''));
	}, [disptach]);

	const handleCancel = useCallback(() => {
		disptach(setOption('select'));
		disptach(setModal(''));
	}, [disptach]);

	return (
		<Dialog
			header="All Pictos"
			position="bottom-left"
			modal={false}
			visible={true}
			className="cloudWindow"
			keepInViewport={false}
			dismissableMask={false}
			style={{ width: '800px' }}
			closable={false}>
			<div className="p-fluid my-2 flex ">
				<h3 className="w-4">Taille :</h3>
				<Slider
					step={0.1}
					value={pictoScale}
					onChange={handlePictoScaleChange}
					className="w-8"
					min={0.1}
					max={3}
				/>
			</div>
			<div className="grid p-fluid col-12 ">
				{pictos1.map((image, key) => (
					<div key={key}>
						<Button
							className={
								selectedFeature && selectedFeature.get('name_picto') === image
									? 'p-button-outlined p-button-warning'
									: 'p-button-text'
							}
							name={image}
							onClick={handleChangeNamePicto}>
							<img
								src={'/Icons/Pictos/' + image + '.png'}
								alt=""
								width="20px"
								height="20px"
								style={{ pointerEvents: 'none' }}></img>
						</Button>
					</div>
				))}
			</div>

			<div className="grid p-fluid col-12 ">
				{pictos2.map((image, key) => (
					<div key={key}>
						<Button
							className={
								selectedFeature && selectedFeature.get('name_picto') === image
									? 'p-button-outlined p-button-warning'
									: 'p-button-text'
							}
							name={image}
							onClick={handleChangeNamePicto}>
							<img
								src={'/Icons/Pictos/' + image + '.png'}
								alt=""
								width="20px"
								height="20px"
								style={{ pointerEvents: 'none' }}></img>
						</Button>
					</div>
				))}
			</div>

			<div className="grid p-fluid col-12 ">
				{pictos3.map((image, key) => (
					<div key={key}>
						<Button
							className={
								selectedFeature && selectedFeature.get('name_picto') === image
									? 'p-button-outlined p-button-warning'
									: 'p-button-text'
							}
							name={image}
							onClick={handleChangeNamePicto}>
							<img
								src={'/Icons/Pictos/' + image + '.png'}
								alt=""
								width="20px"
								height="20px"
								style={{ pointerEvents: 'none' }}></img>
						</Button>
					</div>
				))}
			</div>
			<div className="col-12 grid p-fluid">
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
		</Dialog>
	);
}

export default Window;
