import { useCallback, useState , useEffect} from 'react';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import './Window.css';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import {
	setMapCoordinate,
	setModal,
	setOption,
	setSelectedFeature,
} from 'Pages/Production/CardDrawingTools/redux/actions';
import { Dialog } from 'primereact/dialog';
import { RadioButton } from 'primereact/radiobutton';

function Window(props) {
	const selectedFeature = useSelector((state) => state.selectedFeature);
	const map = useSelector((state) => state.map);
	const dispatch = useDispatch();

    const [valeur, setValeur] = useState(0)
    const [condition, setCondition] = useState('etat')

	const handleChangeValeur = useCallback(
		(event) => {
			if (selectedFeature) {
				const { value } = event.target;
				setValeur(value);
			    selectedFeature.set('valeur', value);
			}
		},
		[props, selectedFeature]
	);


    const handleChangeCondition = useCallback(
		(event) => {
            
			if (selectedFeature) {
				const { value } = event.target
				setCondition(value)
			    selectedFeature.set('condition', value)
			} 
		},
		[props, selectedFeature]
	);

	const handleConfirm = useCallback(() => {
		dispatch(setSelectedFeature(null));
		dispatch(setOption(''));
		dispatch(setModal(''));
        dispatch(setOption("select"));
	}, [map, selectedFeature, props, dispatch]);

	const handleCancel = useCallback(() => {
		dispatch(setOption(''));
		dispatch(setModal(''));
		dispatch(setSelectedFeature(null));
	}, [dispatch]);

    useEffect(() => {
        if (selectedFeature) {
          setCondition(selectedFeature.get("condition"));
          setValeur(selectedFeature.get("valeur"));
        }
      }, [selectedFeature]);
    

return (
    <Dialog
        header="Conditions surface"
        position="bottom-left"
        modal={false}
        visible={true}
        className="conditionWindow"
        keepInViewport={false}
        dismissableMask={false}
        style={{ width: '360px' }}
        closable={false}>
        <div className="grid p-fluid col-12 ">
                <div className="field-radiobutton">
                    <RadioButton inputId="condition1" name="condition" value="etat" onChange={handleChangeCondition} checked={condition === 'etat'} />
                    <label htmlFor="condition1">Etat de mer</label>
                </div>
                <div className="field-radiobutton">
                    <RadioButton inputId="condition2" name="condition" value="temperature" onChange={handleChangeCondition} checked={condition === 'temperature'} />
                    <label htmlFor="condition2">Temperature de la mer</label>
                </div>
                <div className="field-radiobutton">
                    <RadioButton inputId="condition3" name="condition" value="vent" onChange={handleChangeCondition} checked={condition === 'vent'} />
                    <label htmlFor="condition3">Vent surface fort</label>
                </div>  

                <div className="my-2">
                    <label htmlFor="stacked">Valeur</label>
                    <InputNumber
                        inputId="stacked"
                        value={valeur}
                        onValueChange={handleChangeValeur}
                        showButtons
                    />
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