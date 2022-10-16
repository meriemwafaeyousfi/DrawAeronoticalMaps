import {
	SET_MAP,
	SET_MODAL,
	SET_OPTION,
	SET_SELECTED_FEATURE,
	SET_MAP_COORDINATE,
	SET_CENTER_RESIZER,
} from './actions';

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

export const selectedFeature = (state = null, action) => {
	const { type, payload } = action;
	switch (type) {
		case SET_SELECTED_FEATURE:
			return payload;

		default:
			return state;
	}
};

export const mapCoordinate = (state = null, action) => {
	const { type, payload } = action;
	switch (type) {
		case SET_MAP_COORDINATE:
			return payload;

		default:
			return state;
	}
};

export const centerResizer = (state = null, action) => {
	const { type, payload } = action;
	switch (type) {
		case SET_CENTER_RESIZER:
			return payload;

		default:
			return state;
	}
};
