import { CLOUD_MODAL, SELECT_FEATURE } from './actions';

export const cloudyAreaModal = (state = false, action) => {
	const { type, payload } = action;
	switch (type) {
		case CLOUD_MODAL:
			return payload;
		default:
			return state;
	}
};

export const selectedFeature = (state = null, action) => {
	const { type, payload } = action;
	switch (type) {
		case SELECT_FEATURE:
			return payload;
		default:
			return state;
	}
};
