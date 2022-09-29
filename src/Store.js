import { createStore, combineReducers } from 'redux';
import { cloudyAreaModal } from './Pages/Production/Features/CloudyArea/reducers';
const reducers = { cloudyAreaModal };

const rootReducer = combineReducers(reducers);

export const configureStore = () => createStore(rootReducer);
