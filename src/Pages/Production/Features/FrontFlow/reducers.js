import { SELECT_FEATURE } from './actions';



export const selectedFeature = (state = null, action) => {
	const { type, payload } = action;
	switch (type) {
		case SELECT_FEATURE:
			return payload;
		default:
			return state;
	}
};
