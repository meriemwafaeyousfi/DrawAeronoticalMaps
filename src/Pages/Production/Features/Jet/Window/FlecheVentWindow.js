import { useCallback, useState } from 'react';
import './Window.css';
import { useDispatch, useSelector } from 'react-redux';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import {
	setModal,
	setOption,
	setSelectedFeature,
} from 'Pages/Production/CardDrawingTools/redux/actions';
import { Dialog } from 'primereact/dialog';
import { RadioButton } from 'primereact/radiobutton';

function Window(props) {
	const selectedFeature = useSelector((state) => state.selectedFeature);
	const dispatch = useDispatch();

    const [vitesse, setVitesse] = useState(0)
    const [flightLevel, setFlightLevel] = useState(0)
    const [epaisseurSup,setEpaisseurSup] = useState(0)
    const [epaisseurInf,setEpaisseurInf] = useState(0)
    const [affichEp, setAffichEp] = useState('auto')
    const [affich , setAffich] = useState('auto')

	const handleChangeVitesse = useCallback(
		(event) => {
			if (selectedFeature) {
				const { value } = event.target;
				setVitesse(value);
                let fleches = selectedFeature.get('fleches')
                let x = fleches.find(elt => ((elt.point[0] ===  selectedFeature.get('dblclickpoint')[0] ) && (elt.point[1] ===  selectedFeature.get('dblclickpoint')[1])));
                let coords = selectedFeature.getGeometry().getCoordinates()
                if (!x){    
                    selectedFeature.set('fleches', fleches.concat([({
                        point : selectedFeature.get('dblclickpoint'), 
                        vitesse : value,
                        flightLevel : flightLevel,
                        epSup : epaisseurSup,
                        epInf : epaisseurInf,
                        affichEp : affichEp,
                        affich : affich,
                        index :  coords.findIndex(elt => ((elt[0] ===  selectedFeature.get('dblclickpoint')[0] ) && (elt[1] ===  selectedFeature.get('dblclickpoint')[1])))
                         })
                      ]
                    ))
                }else{
                    let i = fleches.indexOf(x)
                    x.vitesse = value
                    fleches[i] = x
                    selectedFeature.set('fleches', fleches.concat([]))
                }
			}
		},
		[ selectedFeature, flightLevel, epaisseurInf, epaisseurSup, affich, affichEp]
	);

    const handleChangeFlightLevel = useCallback(
		(event) => {
			if (selectedFeature) {
				const { value } = event.target;
				setFlightLevel(value);
				let fleches = selectedFeature.get('fleches')
                let x = fleches.find(elt => ((elt.point[0] ===  selectedFeature.get('dblclickpoint')[0] ) && (elt.point[1] ===  selectedFeature.get('dblclickpoint')[1])));
                let coords = selectedFeature.getGeometry().getCoordinates()
                if (!x){    
                    selectedFeature.set('fleches', fleches.concat([({
                        point : selectedFeature.get('dblclickpoint'), 
                        vitesse : vitesse,
                        flightLevel : value,
                        epSup : epaisseurSup,
                        epInf : epaisseurInf,
                        affichEp : affichEp,
                        affich : affich,
                        index :  coords.findIndex(elt => ((elt[0] ===  selectedFeature.get('dblclickpoint')[0] ) && (elt[1] ===  selectedFeature.get('dblclickpoint')[1])))
                         })
                      ]
                    ))
                }else{
                    let i = fleches.indexOf(x)
                    x.flightLevel = value
                    fleches[i] = x
                    selectedFeature.set('fleches', fleches.concat([]))
                }

			}
		},
		[ selectedFeature, vitesse, epaisseurInf, epaisseurSup, affich, affichEp]
	);

    const handleChangeEpaisseurSup = useCallback(
		(event) => {
			if (selectedFeature) {
				const { value } = event.target;
				setEpaisseurSup(value);
                let fleches = selectedFeature.get('fleches')
                let x = fleches.find(elt => ((elt.point[0] ===  selectedFeature.get('dblclickpoint')[0] ) && (elt.point[1] ===  selectedFeature.get('dblclickpoint')[1])));
                let coords = selectedFeature.getGeometry().getCoordinates()
                if (!x){    
                    selectedFeature.set('fleches', fleches.concat([({
                        point : selectedFeature.get('dblclickpoint'), 
                        vitesse : vitesse,
                        flightLevel : flightLevel,
                        epSup : value,
                        epInf : epaisseurInf,
                        affichEp : affichEp,
                        affich : affich,
                        index :  coords.findIndex(elt => ((elt[0] ===  selectedFeature.get('dblclickpoint')[0] ) && (elt[1] ===  selectedFeature.get('dblclickpoint')[1])))
                         })
                      ]
                    ))
                }else{
                    let i = fleches.indexOf(x)
                    x.epSup = value
                    fleches[i] = x
                    selectedFeature.set('fleches', fleches.concat([]))
                }
			}
		},
		[selectedFeature, vitesse, flightLevel, epaisseurInf, affich, affichEp]
	);

    const handleChangeEpaisseurInf = useCallback(
		(event) => {
			if (selectedFeature) {
				const { value } = event.target;
				setEpaisseurInf(value);
                let fleches = selectedFeature.get('fleches')
                let x = fleches.find(elt => ((elt.point[0] ===  selectedFeature.get('dblclickpoint')[0] ) && (elt.point[1] ===  selectedFeature.get('dblclickpoint')[1])));
                let coords = selectedFeature.getGeometry().getCoordinates()
                if (!x){    
                    selectedFeature.set('fleches', fleches.concat([({
                        point : selectedFeature.get('dblclickpoint'), 
                        vitesse : vitesse,
                        flightLevel : flightLevel,
                        epSup : epaisseurSup,
                        epInf : value,
                        affichEp : affichEp,
                        affich : affich,
                        index :  coords.findIndex(elt => ((elt[0] ===  selectedFeature.get('dblclickpoint')[0] ) && (elt[1] ===  selectedFeature.get('dblclickpoint')[1])))
                         })
                      ]
                    ))
                }else{
                    let i = fleches.indexOf(x)
                    x.epInf = value
                    fleches[i] = x
                    selectedFeature.set('fleches', fleches.concat([]))
                }
			}
		},
		[selectedFeature, vitesse, flightLevel, epaisseurSup, affich, affichEp]
	);

    const handleChangeAffich = useCallback(
		(event) => {
			if (selectedFeature) {
				const { value } = event.target
				setAffich(value)
                let fleches = selectedFeature.get('fleches')
                let x = fleches.find(elt => ((elt.point[0] ===  selectedFeature.get('dblclickpoint')[0] ) && (elt.point[1] ===  selectedFeature.get('dblclickpoint')[1])));
                let coords = selectedFeature.getGeometry().getCoordinates()
                if (!x){    
                    selectedFeature.set('fleches', fleches.concat([({
                        point : selectedFeature.get('dblclickpoint'), 
                        vitesse : vitesse,
                        flightLevel : flightLevel,
                        epSup : epaisseurSup,
                        epInf : epaisseurInf,
                        affichEp : affichEp,
                        affich : value,
                        index :  coords.findIndex(elt => ((elt[0] ===  selectedFeature.get('dblclickpoint')[0] ) && (elt[1] ===  selectedFeature.get('dblclickpoint')[1])))
                         })
                      ]
                    ))
                }else{
                    let i = fleches.indexOf(x)
                    x.affich = value
                    fleches[i] = x
                    selectedFeature.set('fleches', fleches.concat([]))
                }
			} 
		},
		[selectedFeature, vitesse, flightLevel, epaisseurInf, epaisseurSup, affichEp]
	);

    const handleChangeAffichEp= useCallback(
		(event) => {
			if (selectedFeature) {
				const { value } = event.target
				setAffichEp(value)
                let fleches = selectedFeature.get('fleches')
                let x = fleches.find(elt => ((elt.point[0] ===  selectedFeature.get('dblclickpoint')[0] ) && (elt.point[1] ===  selectedFeature.get('dblclickpoint')[1])));
                let coords = selectedFeature.getGeometry().getCoordinates()
                if (!x){    
                    selectedFeature.set('fleches', fleches.concat([({
                        point : selectedFeature.get('dblclickpoint'), 
                        vitesse : vitesse,
                        flightLevel : flightLevel,
                        epSup : epaisseurSup,
                        epInf : epaisseurInf,
                        affichEp : value,
                        affich : affich,
                        index :  coords.findIndex(elt => ((elt[0] ===  selectedFeature.get('dblclickpoint')[0] ) && (elt[1] ===  selectedFeature.get('dblclickpoint')[1])))
                         })
                      ]
                    ))
                }else{
                    let i = fleches.indexOf(x)
                    x.affichEp = value
                    fleches[i] = x
                    selectedFeature.set('fleches', fleches.concat([]))
                }
			} 
		},
		[selectedFeature, vitesse, flightLevel, epaisseurInf, epaisseurSup, affich]
	);
 
	const handleConfirm = useCallback(() => {
        dispatch(setModal(''));
	}, [ dispatch]);

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
        style={{ width: '300px' }}
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
            <div className="col-6">
                <div className="field-radiobutton">
                        <RadioButton inputId="affichage1" name="affichage" value="auto" onChange={handleChangeAffich} checked={affich === 'auto'}  />
                        <label htmlFor="affichage1">Auto</label>
                </div>
                <div className="field-radiobutton">
                        <RadioButton inputId="affichage2" name="affichage" value="affiche" onChange={handleChangeAffich} checked={affich === 'affiche'}   />
                        <label htmlFor="affichage2">Affiché</label>
                </div>
                <div className="field-radiobutton">
                        <RadioButton inputId="affichage3" name="affichage" value="cassure"  onChange={handleChangeAffich} checked={affich === 'cassure'}  />
                        <label htmlFor="affichage3">Cassure</label>
                </div> 
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
            <div className="field-radiobutton">
                        <RadioButton inputId="affichageEp1" name="affichageEp" value="auto" onChange={handleChangeAffichEp} checked={affichEp === 'auto'}  />
                        <label htmlFor="affichageEp1">Auto</label>
                </div>
                <div className="field-radiobutton">
                        <RadioButton inputId="affichageEp2" name="affichageEp" value="affiche" onChange={handleChangeAffichEp} checked={affichEp === 'affiche'}   />
                        <label htmlFor="affichageEp2">Affiché</label>
                </div>
                <div className="field-radiobutton">
                        <RadioButton inputId="affichageEp3" name="affichageEp" value="cache"  onChange={handleChangeAffichEp} checked={affichEp === 'cache'}  />
                        <label htmlFor="affichageEp3">Caché</label>
                </div>
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