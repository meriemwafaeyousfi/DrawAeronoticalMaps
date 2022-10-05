import { createStore, combineReducers } from 'redux';
import { map, option, modal } from './Pages/Production/NewCarte/redux/reducers';
import { selectedFeature } from './Pages/Production/Features/CloudyArea/redux/reducers';
const reducers = { map, option, modal, selectedFeature };

const rootReducer = combineReducers(reducers);

export const configureStore = () => createStore(rootReducer);
