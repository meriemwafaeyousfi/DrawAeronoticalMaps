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
