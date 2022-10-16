import React, { useCallback, useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';

import './Window.css';
import { useDispatch, useSelector } from 'react-redux';
import { setModal, setOption } from '../../../CardDrawingTools/redux/actions';

function Window({ vectorLayer }) {
	const map = useSelector((state) => state.map);
	const selectedFeature = useSelector((state) => state.selectedFeature);
	const disptach = useDispatch();

	const [numCat, setNumCat] = useState(1);

	const [backupFeature, setBackupFeature] = useState(null);

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

	useEffect(() => {
		if (selectedFeature) setNumCat(selectedFeature.get('numCat'));
	}, [selectedFeature]);
	return (
		<Dialog
			header="Zone de turbulence (CAT)"
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
					<input type="text" name="" id="" value={numCat} />
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
