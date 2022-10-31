import { useCallback, useState , useEffect} from 'react';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import {
	setMapCoordinate,
	setModal,
	setOption,
	setSelectedFeature,
} from 'Pages/Production/CardDrawingTools/redux/actions';
import { Dialog } from 'primereact/dialog';
import { RadioButton } from 'primereact/radiobutton';
import { Checkbox } from 'primereact/checkbox';
import {styleBorder, sizeTextList } from '../../../../../Helpers/data';
import { ColorPicker } from 'primereact/colorpicker';

function Window(props) {
	const selectedFeature = useSelector((state) => state.selectedFeature);
	const map = useSelector((state) => state.map);
	const dispatch = useDispatch();

    const [sizeText, setSizeText] = useState(0)
    const [showBordure, setShowBordure] = useState(false)
    const [epaisseur, setEpaisseur] = useState(0)
    const [marge, setMarge] = useState(0)
    const [textColor, setTextColor] = useState('1976D2')
    const [borderColor, setBorderColor] = useState('1976D2')
    const [showRemp, setShowRemp] = useState(false)
    const [transparence, setTransparence] = useState(0)
    const [policeText, setPoliceText] = useState('Arial')

	const handleChangeEpaisseur = useCallback(
		(event) => {
			if (selectedFeature) {
				const { value } = event.target;
				setEpaisseur(value);
			    selectedFeature.set('epaisseur', value);
			}
		},
		[props, selectedFeature]
	);

    const handleChangeTransparence = useCallback(
		(event) => {
			if (selectedFeature) {
				const { value } = event.target;
				setTransparence(value);
			    selectedFeature.set('transparence', value);
			}
		},
		[props, selectedFeature]
	);
    
    
    const handleChangeSizeText = useCallback(
		(event) => {
			if (selectedFeature) {
				const { value } = event.target;
				setSizeText(value);
			    selectedFeature.set('size', value);
			}
		},
		[props, selectedFeature]
	);
    
    
	const handleChangeMarge = useCallback(
		(event) => {
			if (selectedFeature) {
				const { value } = event.target;
				setMarge(value);
			    selectedFeature.set('marge', value);
			}
		},
		[props, selectedFeature]
	);

    const handleChangeShowBordure = useCallback(
		(event) => {
			if (selectedFeature) {
				const  value  = event.checked;
				setShowBordure(value);
			    selectedFeature.set('show-bordure', value);
			}
		},
		[props, selectedFeature]
	);

    const handleChangeShowRemp = useCallback(
		(event) => {
			if (selectedFeature) {
				const  value  = event.checked;
				setShowRemp(value);
			    selectedFeature.set('show-remplissage', value);
			}
		},
		[props, selectedFeature]
	);


	const handleConfirm = useCallback(() => {
        const editorOverlay = map.getOverlayById(selectedFeature.ol_uid)
        editorOverlay.getElement().contentEditable = "false";
        editorOverlay.getElement().style.resize= "none";
        editorOverlay.getElement().style.outline = 'none';
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
          
        }
      }, [selectedFeature]);
    
    const groupedItemTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <img alt={option.style} src={option.image} style={{width:'100%', maxWidth:'100px'}} />
            </div>
        );
    }

return (
    <Dialog
        header="Conditions surface"
        position="bottom-left"
        modal={false}
        visible={true}
        className="conditionWindow"
        keepInViewport={false}
        dismissableMask={false}
        style={{ width: '300px' }}
        closable={false}>


            <div className="my-2">
                <label htmlFor="color" className="p-checkbox-label">Couleur</label>
                <ColorPicker inputId="color" value={textColor} onChange={(e) => setTextColor(e.value)} />
            </div>

            <div className="grid p-fluid col-12 ">
                    <div className="grid p-fluid col-12">
                        <div className="col_6">
                            <Dropdown
                                //value={dir2}
                                options={styleBorder}
                                //onChange={handleChangeDirection}
                                optionLabel="style"
                                placeholder="Polices"
                            />
                        </div>

                    <div className="col_6">
						<Dropdown
							value={sizeText}
							options={sizeTextList}
							onChange={handleChangeSizeText}
							placeholder="Taille"
						/>
					</div>
             </div>

         </div>

       
        <div className="grid p-fluid col-12">
                 <div className="col_6">
                    <span className="p-buttonset">
                        <Button  icon="pi pi-align-right" />
                        <Button  icon="pi pi-align-left" />
                        <Button  icon="pi pi-align-center" />
                    </span>
                </div>

                <div className="col_6">
                    <span className="p-buttonset">
                        <Button label='B' />
                        <Button  label='I'/>
                        <Button  label='U' />
                    </span>
                </div>

            </div>

            <div className="grid p-fluid col-12">
                <Checkbox inputId="border"  onChange={handleChangeShowBordure} checked={showBordure}></Checkbox>
                <label htmlFor="border" className="p-checkbox-label">Bordure</label>
            </div>

            <div className="grid p-fluid col-12">
                <div className="col_6">
                        <label htmlFor="color2">Couleur</label>
                        <ColorPicker inputId="color2" value={textColor} onChange={(e) => setTextColor(e.value)} />
                        
                </div>
                <div className="col_6">
                    <Dropdown
							   //value={dir2}
							    options={styleBorder}
                                //onChange={handleChangeDirection}
                                optionLabel="style"
							   placeholder="Style"
                              itemTemplate={groupedItemTemplate}
						/>
                </div>
            </div>

            <div className="grid p-fluid col-12 ">
                
            <div className="col_6">
                    <label htmlFor="stacked">Epaisseur</label>
                    <InputNumber
                        inputId="stacked"
                        value={epaisseur}
                        onValueChange={handleChangeEpaisseur}
                        showButtons
                    />
                </div>
                <div className="col_6">
                    <label htmlFor="stacked">Marge</label>
                    <InputNumber
                        inputId="stacked"
                        value={marge}
                        onValueChange={handleChangeMarge}
                        showButtons
                    />
                </div>

            
        </div>  


        <div className="grid p-fluid col-12">
                <Checkbox inputId="remp" value="Remplissage" onChange={handleChangeShowRemp} checked={showRemp}></Checkbox>
                <label htmlFor="remp" className="p-checkbox-label">Remplissage</label>
            </div>

        <div className="grid p-fluid col-12">
                <div className="col_6">
                        <label htmlFor="color2">Couleur</label>
                        <ColorPicker inputId="color2" value={borderColor} onChange={(e) => setBorderColor(e.value)} />
                        
                </div>

                <div className="col_6">
                <label htmlFor="trans">Transparence</label>
                <InputNumber
                        inputId="trans"
                        value={transparence}
                        onValueChange={handleChangeTransparence}
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