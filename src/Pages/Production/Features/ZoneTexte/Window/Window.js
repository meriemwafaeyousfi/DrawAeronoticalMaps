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
import {styleBorder as styleBorderList, sizeTextList, policesTextList  } from '../../../../../Helpers/data';
import { ColorPicker } from 'primereact/colorpicker';
import {
	resizeTextZone
} from 'Mapping/Features/ZoneTexte/ZoneTexte';

function Window(props) {
	const selectedFeature = useSelector((state) => state.selectedFeature);
	const map = useSelector((state) => state.map);
    const option = useSelector((state)=> state.option)
	const dispatch = useDispatch();

    const [sizeText, setSizeText] = useState(16);
    const [showBordure, setShowBordure] = useState(false);
    const [epaisseur, setEpaisseur] = useState(0);
    const [marge, setMarge] = useState(0);
    const [textColor, setTextColor] = useState('1976D2');
    const [borderColor, setBorderColor] = useState('1976D2');
    const [showRemp, setShowRemp] = useState(false);
    const [transparence, setTransparence] = useState(100);
    const [policeText, setPoliceText] = useState('Arial');
    const [rempColor , setRempColor] = useState('1976D2');
    const [boldText, setBoldText] = useState(false);
    const [italicText, setItalicText] = useState(false);
    const [underLineText, setUnderLineText] = useState(false);
    const [alignText, setAlignText] = useState('start');
    const [styleBorder, setStyleBorder] = useState('solid');


	const handleChangeEpaisseur = useCallback(
		(event) => {
			if (selectedFeature) {
				const { value } = event.target;
				setEpaisseur(value);
			    selectedFeature.set('epaisseur', value);
			}
		},
		[selectedFeature]
	);

    const handleChangeTransparence = useCallback(
		(event) => {
			if (selectedFeature) {
				const { value } = event.target;
				setTransparence(value);
			    selectedFeature.set('transparence', (value === 0 )? 0 : value/100 );
			}
		},
		[selectedFeature]
	);
    
    const handleChangeSizeText = useCallback(
		(event) => {
			if (selectedFeature) {
				const { value } = event.target;
				setSizeText(value);
			    selectedFeature.set('size', value);
			}
		},
		[selectedFeature]
	);
     
	const handleChangeMarge = useCallback(
		(event) => {
			if (selectedFeature) {
				const { value } = event.target;
				setMarge(value);
			    selectedFeature.set('marge', value);
			}
		},
		[selectedFeature]
	);

    const handleChangeShowBordure = useCallback(
		(event) => {
			if (selectedFeature) {
				const  value  = event.checked;
				setShowBordure(value);
			    selectedFeature.set('show-bordure', value);
			}
		},
		[selectedFeature]
	);

    const handleChangeShowRemp = useCallback(
		(event) => {
			if (selectedFeature) {
				const  value  = event.checked;
				setShowRemp(value);
			    selectedFeature.set('show-remp', value);
			}
		},
		[selectedFeature]
	);

    const handleChangeTextColor = useCallback(
        (event)=>{
            if (selectedFeature) {
				const  value  = event.value;
				setTextColor(value);
			    selectedFeature.set('text-color', value);
			}
        },
        [selectedFeature]
    );

    const handleChangeBorderColor = useCallback(
        (event)=>{
            if (selectedFeature) {
				const  value  = event.value;
				setBorderColor(value);
			    selectedFeature.set('border-color', value);
			}
        },
        [selectedFeature]
    );

    const handleChangeRempColor = useCallback(
        (event)=>{
            if (selectedFeature) {
				const  value  = event.value;
				setRempColor(value);
			    selectedFeature.set('remp-color', value);
			}
        },
        [selectedFeature]
    );

    const handleChangeBoldText = useCallback(
		(event) => {
			if (selectedFeature) {
				setBoldText(!boldText);
                console.log(!boldText)
			    selectedFeature.set('bold', !boldText);
			}
		},
		[selectedFeature,boldText]
	);

    const handleChangeItalicText = useCallback(
		(event) => {
			if (selectedFeature) {
				setItalicText(!italicText);
			    selectedFeature.set('italic', !italicText);
			}
		},
		[selectedFeature,italicText]
	);

    const handleChangeUnderLineText = useCallback(
		(event) => {
			if (selectedFeature) {
				setUnderLineText(!underLineText);
			    selectedFeature.set('underline', !underLineText);
			}
		},
		[selectedFeature,underLineText]
	);

    const handleChangeAlign = useCallback(
        (event , value) => {
            if(selectedFeature){
                setAlignText(value)
                selectedFeature.set('align', value)
            }
        },
		[selectedFeature]
    )

    const handleChangeStyleBorder = useCallback(
        (event) => {
            if(selectedFeature){
                const {value} = event.target
                setStyleBorder(value)
                selectedFeature.set('style-border', value.style)
            }
        },
		[selectedFeature]
    )

    const handleChangePoliceText = useCallback(
        (event) => {
            if(selectedFeature){
                const {value} = event.target
                setPoliceText(value)
                selectedFeature.set('police', value)
            }
        },
		[selectedFeature]
    )


	const handleConfirm = useCallback(() => {
        const editorOverlay = map.getOverlayById(selectedFeature.ol_uid)
        editorOverlay.getElement().contentEditable = "false";
        editorOverlay.getElement().style.resize= "none";
        editorOverlay.getElement().style.outline = 'none';
        
        console.log(selectedFeature)
		dispatch(setSelectedFeature(null));
		dispatch(setOption(''));
		dispatch(setModal(''));
        dispatch(setOption("select"));
	}, [map, selectedFeature, dispatch]);

	const handleCancel = useCallback(() => {
		dispatch(setOption(''));
		dispatch(setModal(''));
		dispatch(setSelectedFeature(null));
	}, [dispatch]);

    useEffect(() => {
        if (selectedFeature) {
            setSizeText(selectedFeature.get("size"));
            setShowBordure(selectedFeature.get("show-bordure"));
            setEpaisseur(selectedFeature.get("epaisseur"));
            setMarge(selectedFeature.get("marge"));
            setTextColor(selectedFeature.get("text-color"));
            setBorderColor(selectedFeature.get("border-color"));
            setShowRemp(selectedFeature.get("show-remp"));
            setTransparence(selectedFeature.get("transparence"));
            setPoliceText(selectedFeature.get("police"));
            setRempColor(selectedFeature.get("remp-color"));
            setBoldText(selectedFeature.get("bold"));
            setItalicText(selectedFeature.get("italic"));
            setUnderLineText(selectedFeature.get("underline"));
            setAlignText(selectedFeature.get("align"));
            setStyleBorder(selectedFeature.get("style-border"));
        }
      }, [map,selectedFeature]);
    
    const groupedItemTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <img alt={option.style} src={option.image} style={{width:'100%', maxWidth:'100px'}} />
            </div>
        );
    }

return (
    <Dialog
        header="Editeur de texte"
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
                <ColorPicker inputId="color" value={textColor} onChange={handleChangeTextColor} />
            </div>

            <div className="grid p-fluid col-12 ">
                    <div className="grid p-fluid col-12">
                        <div className="col_6 p-1 ">
                            <Dropdown
                                value={policeText}
                                options={policesTextList}
                                onChange={handleChangePoliceText}
                                placeholder="Polices"
                            />
                        </div>

                    <div className="col_6 p-1 ">
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
                 <div className="col_6 p-1">
                    <span className="p-buttonset">
                        <Button id='left'   icon="pi pi-align-left"    onClick={(e) => handleChangeAlign(e,'left')}/>
                        <Button id='center' icon="pi pi-align-center"  onClick={(e) => handleChangeAlign(e,'center')}/>
                        <Button id='right'  icon="pi pi-align-right"   onClick={(e) => handleChangeAlign(e,'right')}/>
                    </span>
                </div>

                <div className="col_6 p-1">
                    <span className="p-buttonset">
                        <Button  label='B' onClick={handleChangeBoldText} />
                        <Button  label='I' onClick={handleChangeItalicText}/>
                        <Button  label='U' onClick={handleChangeUnderLineText}/>
                    </span>
                </div>

            </div>

            <div className="grid p-fluid col-12">
                <Checkbox inputId="border"  onChange={handleChangeShowBordure} checked={showBordure}></Checkbox>
                <label htmlFor="border" className="p-checkbox-label">Bordure</label>
            </div>

            <div className="grid p-fluid col-12">
                <div className="col_6 p-1">
                        <label htmlFor="color2">Couleur</label>
                        <ColorPicker  inputId="color2" value={borderColor} onChange={handleChangeBorderColor} />
                        
                </div>
                <div className="col_6 p-1">
                    <Dropdown
							    value={styleBorder}
							    options={styleBorderList}
                                onChange={handleChangeStyleBorder}
                                optionLabel="style"
							   placeholder="Style"
                              itemTemplate={groupedItemTemplate}
						/>
                </div>
            </div>

            <div className="grid p-fluid col-12 ">
                
            <div className="col_6 p-1">
                    <label htmlFor="i1">Epaisseur</label>
                    <InputNumber
                        inputId="i1"
                        value={epaisseur}
                        onValueChange={handleChangeEpaisseur}
                        showButtons
                        placeholder="Polices"
                    />
                </div>
                <div className="col_6 p-1">
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
                        <label htmlFor="color3">Couleur</label>
                        <ColorPicker inputId="color3" value={rempColor} onChange={handleChangeRempColor} />
                        
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