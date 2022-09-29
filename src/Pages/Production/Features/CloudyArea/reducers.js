import { CLOUD_MODAL } from './actions';

export const cloudyAreaModal = (state = true, action) => {
	const { type, payload } = action;
	switch (type) {
		case CLOUD_MODAL:
			return payload;
		default:
			return state;
	}
};
