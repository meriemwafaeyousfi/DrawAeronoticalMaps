export const CLOUD_MODAL = 'CLOUD_MODAL';
export const cloudModal = (boolean) => ({
	type: CLOUD_MODAL,
	payload: boolean,
});

export const SELECT_FEATURE = 'SELECT_FEATURE';
export const selectFeature = (feature) => ({
	type: SELECT_FEATURE,
	payload: feature,
});
