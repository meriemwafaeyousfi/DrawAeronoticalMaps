import { createStore, combineReducers } from 'redux';
import {
	cloudyAreaModal,
	selectedFeature,
} from './Pages/Production/Features/CloudyArea/reducers';
import { option } from './Pages/Production/NewCarte/Tools/reducer';
const reducers = { cloudyAreaModal, option, selectedFeature };

const rootReducer = combineReducers(reducers);

export const configureStore = () => createStore(rootReducer);
