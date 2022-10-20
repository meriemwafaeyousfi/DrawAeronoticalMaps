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

    const [vitesse, setVitesse] = useState(0)
    const [flightLevel, setFlightLevel] = useState(0)
    const [epaisseurSup,setEpaisseurSup] = useState(0)
    const [epaisseurInf,setEpaisseurInf] = useState(0)

	const handleChangeVitesse = useCallback(
		(event) => {
			if (selectedFeature) {
				const { value } = event.target;
				setVitesse(value);
			//	selectedFeature.set('vitesseFleche', value);
			}
		},
		[props, selectedFeature]
	);

    const handleChangeFlightLevel = useCallback(
		(event) => {
			if (selectedFeature) {
				const { value } = event.target;
				setFlightLevel(value);
				//selectedFeature.set('flightFleche', value);
			}
		},
		[props, selectedFeature]
	);

    const handleChangeEpaisseurSup = useCallback(
		(event) => {
			if (selectedFeature) {
				const { value } = event.target;
				setEpaisseurSup(value);
				//selectedFeature.set('flightFleche', value);
			}
		},
		[props, selectedFeature]
	);

    const handleChangeEpaisseurInf = useCallback(
		(event) => {
			if (selectedFeature) {
				const { value } = event.target;
				setEpaisseurInf(value);
				//selectedFeature.set('flightFleche', value);
			}
		},
		[props, selectedFeature]
	);



	const handleConfirm = useCallback(() => {
		dispatch(setSelectedFeature(null));
		dispatch(setOption(''));
		dispatch(setModal(''));
	}, [map, mapCoordinate, selectedFeature, props, dispatch]);

	const handleCancel = useCallback(() => {
		dispatch(setOption(''));
		dispatch(setModal(''));
		dispatch(setSelectedFeature(null));
	}, [dispatch]);

return (
    <Dialog
        header="Propriétés de JET"
        position="bottom-left"
        modal={false}
        visible={true}
        className="felecheVentWindow"
        keepInViewport={false}
        dismissableMask={false}
        closable={false}>
            <p>Fleche de vent</p>
        <div className="grid p-fluid col-12 ">
            
            <div className="col-6">
            
                <div className="my-2">
                    <label htmlFor="stacked">Vitesse</label>
                    <InputNumber
                        inputId="stacked"
                        value={vitesse}
                        onValueChange={handleChangeVitesse}
                        showButtons
                    />
                </div>

                <div className="my-2">
                    <label htmlFor="stacked">Flight level</label>
                    <InputNumber
                        inputId="stacked"
                        value={flightLevel}
                        onValueChange={handleChangeFlightLevel}
                        showButtons
                    />
                </div>
            </div>
            <div className="col-6 ">
              
            </div>
            </div>
            <p>Epaisseur</p>
            <div className="grid p-fluid col-12 ">
            
            <div className="col-6">
                
                <div className="my-2">
                    <label htmlFor="stacked">Superieur</label>
                    <InputNumber
                        inputId="stacked"
                        value={epaisseurSup}
                        onValueChange={handleChangeEpaisseurSup}
                        showButtons
                    />
                </div>

                <div className="my-2">
                    <label htmlFor="stacked">Inferieur</label>
                    <InputNumber
                        inputId="stacked"
                        value={epaisseurInf}
                        onValueChange={handleChangeEpaisseurInf}
                        showButtons
                    />
                </div>
               
            </div>
            <div className="col-6">
              
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