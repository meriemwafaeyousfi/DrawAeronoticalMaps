import { SET_OPTION } from './actions';

export const option = (state = '', action) => {
	const { type, payload } = action;
	switch (type) {
		case SET_OPTION:
			return payload;
		default:
			return state;
	}
};
