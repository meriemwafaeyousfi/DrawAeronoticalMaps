import { SET_SELECTED_FEATURE } from './actions';

export const selectedFeature = (state = null, action) => {
	const { type, payload } = action;
	switch (type) {
		case SET_SELECTED_FEATURE:
			return payload;

		default:
			return state;
	}
};
