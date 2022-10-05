import { SET_MAP, SET_MODAL, SET_OPTION } from './actions';

export const map = (state = null, action) => {
	const { type, payload } = action;
	switch (type) {
		case SET_MAP:
			return payload;

		default:
			return state;
	}
};
export const option = (state = '', action) => {
	const { type, payload } = action;
	switch (type) {
		case SET_OPTION:
			return payload;

		default:
			return state;
	}
};
export const modal = (state = '', action) => {
	const { type, payload } = action;
	switch (type) {
		case SET_MODAL:
			return payload;

		default:
			return state;
	}
};
