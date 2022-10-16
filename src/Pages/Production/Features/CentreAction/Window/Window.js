import { useCallback, useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import TextField from '@mui/material/TextField';
import Button from 'react-bootstrap/Button';
import Radio from '@mui/material/Radio';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import './Window.css';
import { styled } from '@mui/material/styles';
import { centresImages, directions } from 'Helpers/data';
import { useDispatch, useSelector } from 'react-redux';
import {
	setMapCoordinate,
	setModal,
	setOption,
	setSelectedFeature,
} from 'Pages/Production/CardDrawingTools/redux/actions';
import { createCentreAction } from 'Mapping/Features/CentreAction/CentreAction';

function Window(props) {
	const selectedFeature = useSelector((state) => state.selectedFeature);
	const map = useSelector((state) => state.map);
	const mapCoordinate = useSelector((state) => state.mapCoordinate);
	const dispatch = useDispatch();

	const handleChangeName = (
		event: React.MouseEvent<HTMLElement>,
		newName: string
	) => {
		if (newName) {
			props.setNameCentre(newName);
			selectedFeature.set('nameCentre', newName);
		}
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
				const { value } = event.target;
				props.setDirection(value);
				selectedFeature.set('directionCentre', value);
			}
		},
		[props, selectedFeature]
	);

	const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
		'& .MuiToggleButtonGroup-grouped': {
			margin: theme.spacing(0.5),
			border: 1,
			'&.Mui-disabled': {
				border: 1,
			},
			'&:not(:first-of-type)': {
				borderRadius: theme.shape.borderRadius,
			},
			'&:first-of-type': {
				borderRadius: theme.shape.borderRadius,
			},
		},
	}));

	const handleConfirm = useCallback(() => {
		createCentreAction(map, mapCoordinate, selectedFeature);
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
		<div className="modalContainer">
			<Container className="title">
				<Row>
					<Col sm={10}>
						<h1>Haut, Bas, Cyclone et Typhon</h1>
					</Col>
					<Col sm={2} className="titleCloseBtn">
						<button onClick={handleCancel}> X </button>
					</Col>
				</Row>
			</Container>

			<div className="body">
				{/********************* Properties**********************/}
				<Box sx={{ width: '100%' }}>
					<Grid container rowSpacing={1}>
						<Grid item xs={6}>
							<Grid container rowSpacing={4} p={2}>
								<Grid item>
									<TextField
										size="small"
										type="number"
										label=" Vitesse"
										InputProps={{
											inputProps: { max: 100, min: 0 },
										}}
										value={props.vitesse ? props.vitesse : 0}
										onChange={handleChangeVitesse}
									/>
								</Grid>
								<Grid item>
									<FormControl size="small">
										<InputLabel id="demo-simple-select-label">
											Direction
										</InputLabel>
										<Select
											labelId="demo-simple-select-label"
											id="demo-simple-select"
											style={{ width: '100px' }}
											label="Style"
											value={props.direction}
											onChange={handleChangeDirection}>
											{directions.map((elet, index) => {
												if (elet != -1) {
													return (
														<MenuItem key={index} value={elet}>
															{elet}
														</MenuItem>
													);
												} else {
													return (
														<MenuItem key={index} value={elet}>
															Stationnaire
														</MenuItem>
													);
												}
											})}
										</Select>
									</FormControl>
								</Grid>
								<Grid item>
									<TextField
										size="small"
										label="Texte"
										value={props.texte}
										onChange={handleChangeTexte}
									/>
								</Grid>
							</Grid>
						</Grid>
						<Grid item xs={6}>
							{centresImages.map((elt, index) => (
								<StyledToggleButtonGroup
									key={index}
									color="primary"
									value={props.nameCentre}
									exclusive
									onChange={handleChangeName}
									aria-label="Platform">
									<ToggleButton value={elt[0].name}>
										<img
											src={elt[0].src}
											style={{ width: '30px', height: '30px' }}
											alt=""></img>
									</ToggleButton>

									<ToggleButton value={elt[1].name}>
										<img
											src={elt[1].src}
											style={{ width: '30px', height: '30px' }}
											alt=""></img>
									</ToggleButton>
								</StyledToggleButtonGroup>
							))}
						</Grid>
					</Grid>
				</Box>
			</div>

			<div className="footer">
				<button id="cancelBtn" onClick={handleCancel}>
					Annuler
				</button>
				<button onClick={handleConfirm}>OK</button>
			</div>
		</div>
	);
}

export default Window;
