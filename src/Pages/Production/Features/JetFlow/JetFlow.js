import React, { useEffect } from 'react';

function JetFlow({ map }) {
	useEffect(() => {
		map.getViewport().addEventListener('courant_jet', (e) => {
			console.log(e);
		});
	}, [map]);
	return <></>;
}

export default JetFlow;
