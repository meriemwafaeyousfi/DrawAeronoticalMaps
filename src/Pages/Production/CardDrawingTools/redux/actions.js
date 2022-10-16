export const SET_MAP = 'SET_MAP';
export const setMap = (map) => ({
	type: SET_MAP,
	payload: map,
});

export const SET_OPTION = 'SET_OPTION';
export const setOption = (option) => ({
	type: SET_OPTION,
	payload: option,
});

export const SET_MODAL = 'SET_MODAL';
export const setModal = (modal) => ({
	type: SET_MODAL,
	payload: modal,
});

export const SET_SELECTED_FEATURE = 'SET_SELECTED_FEATURE';
export const setSelectedFeature = (feature) => ({
	type: SET_SELECTED_FEATURE,
	payload: feature,
});

export const SET_MAP_COORDINATE = 'SET_MAP_COORDINATE';
export const setMapCoordinate = (coordinate) => ({
	type: SET_MAP_COORDINATE,
	payload: coordinate,
});

export const SET_CENTER_RESIZER = 'SET_CENTER_RESIZER';
export const setCenterResizer = (overlay) => ({
	type: SET_CENTER_RESIZER,
	payload: overlay,
});
