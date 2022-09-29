import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Routing from './Routing';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; //theme
import 'primereact/resources/primereact.min.css'; //core css
import 'primeicons/primeicons.css';
import { Provider } from 'react-redux'; //icons
import { configureStore } from './Store';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<Provider store={configureStore()}>
		<Routing />
	</Provider>
);
