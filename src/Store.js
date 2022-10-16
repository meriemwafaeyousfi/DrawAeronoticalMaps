import { createStore, combineReducers } from 'redux';
import {
	map,
	option,
	modal,
	selectedFeature,
	mapCoordinate,
	centerResizer,
} from 'Pages/Production/CardDrawingTools/redux/reducers';

const reducers = {
	map,
	option,
	modal,
	selectedFeature,
	mapCoordinate,
	centerResizer,
};

const rootReducer = combineReducers(reducers);

export const configureStore = () => createStore(rootReducer);
