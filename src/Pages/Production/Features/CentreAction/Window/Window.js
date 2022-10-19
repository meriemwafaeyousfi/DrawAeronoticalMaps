import { useCallback, useState } from 'react';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import './Window.css';
import { styled } from '@mui/material/styles';
import { centresImages, directions2 } from 'Helpers/data';
import { useDispatch, useSelector } from 'react-redux';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import {
	setMapCoordinate,
	setModal,
	setOption,
	setSelectedFeature,
} from 'Pages/Production/CardDrawingTools/redux/actions';
import { createCentreAction } from 'Mapping/Features/CentreAction/CentreAction';
import { Dialog } from 'primereact/dialog';

function Window(props) {
	const selectedFeature = useSelector((state) => state.selectedFeature);
	const map = useSelector((state) => state.map);
	const mapCoordinate = useSelector((state) => state.mapCoordinate);
	const dispatch = useDispatch();
	const [dir2, setDir2] = useState(0);

	const handleChangeName = (event) => {
		const newName = event.target.name;
		props.setNameCentre(newName);
		selectedFeature.set('nameCentre', newName);
	};

	const handleChangeVitesse = useCallback(
		(event) => {
			if (selectedFeature) {
				const { value } = event.target;
				props.setVitesse(value);
				selectedFeature.set('vitesseCentre', value);
			}
		},
		[props, selectedFeature]
	);

	const handleChangeTexte = useCallback(
		(event) => {
			if (selectedFeature) {
				const { value } = event.target;
				props.setTexte(value);
				selectedFeature.set('texteCentre', value);
			}
		},
		[props, selectedFeature]
	);

	const handleChangeDirection = useCallback(
		(event) => {
			if (selectedFeature) {
				const value = event.value;
				props.setDirection(value.name);
				setDir2(event.value);
				selectedFeature.set('directionCentre', value.name);
			}
		},
		[props, selectedFeature]
	);

	const handleConfirm = useCallback(() => {
		createCentreAction(map, mapCoordinate, selectedFeature,dispatch);
		//init the states
		props.setNameCentre('c');
		props.setVitesse(null);
		props.setTexte('');
		props.setDirection(0);
		dispatch(setSelectedFeature(null));
		dispatch(setOption(''));
		dispatch(setModal(''));
		dispatch(setMapCoordinate(null));
	}, [map, mapCoordinate, selectedFeature, props, dispatch]);

	const handleCancel = useCallback(() => {
		dispatch(setOption(''));
		dispatch(setModal(''));
		dispatch(setSelectedFeature(null));
		dispatch(setMapCoordinate(null));
		let element = document.getElementById('resizer');
		element.style.display = 'none';
	}, [dispatch]);

	return (
		<Dialog
			header="Haut, Bas, Cyclone et Typhon"
			position="bottom-left"
			modal={false}
			visible={true}
			className="cloudWindow"
			keepInViewport={false}
			dismissableMask={false}
			closable={false}>
			<div className="grid p-fluid col-12 ">
				<div className="col-6">
					<div className="my-2">
						<label htmlFor="stacked">Vitesse</label>
						<InputNumber
							inputId="stacked"
							value={props.vitesse}
							onValueChange={handleChangeVitesse}
							showButtons
						/>
					</div>
					<div className="my-2">
						<h5>Direction</h5>
						<Dropdown
							value={dir2}
							options={directions2}
							onChange={handleChangeDirection}
							optionLabel="name"
							placeholder="Direction"
						/>
					</div>
					<div className="my-2">
						<h5>Texte</h5>
						<InputText
							value={props.texte}
							onChange={handleChangeTexte}
							placeholder="Texte"
						/>
					</div>
				</div>
				<div className="col-6 grid p-fluid">
					{centresImages.map((image, key) => (
						<div className="grid p-fluid" key={key}>
							<div className="col-6">
								<Button
									className={
										selectedFeature &&
										selectedFeature.get('nameCentre') === image[0].name
											? 'p-button-outlined p-button-warning'
											: 'p-button-text'
									}
									name={image[0].name}
									onClick={handleChangeName}>
									<img
										src={image[0].src}
										alt=""
										width="30px"
										height="30px"
										style={{ pointerEvents: 'none' }}></img>
								</Button>
							</div>
							<div className="col-6">
								<Button
									className={
										selectedFeature &&
										selectedFeature.get('nameCentre') === image[1].name
											? 'p-button-outlined p-button-warning'
											: 'p-button-text'
									}
									name={image[1].name}
									onClick={handleChangeName}>
									<img
										src={image[1].src}
										alt=""
										width="30px"
										height="30px"
										style={{ pointerEvents: 'none' }}></img>
								</Button>
							</div>
						</div>
					))}
				</div>
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
