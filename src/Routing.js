import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './Routing.css';
import NavBar from './Components/NavBar/NavBar';
import NewCard from './Pages/Production/NewCarte/NewCard';

function Routing() {
	return (
		<BrowserRouter>
			<NavBar />
			<div className="pageContent">
				<Routes>
					<Route path="/production">
						<Route path="nouvelle_carte" element={<NewCard />} />
					</Route>
				</Routes>
			</div>
		</BrowserRouter>
	);
}

export default Routing;
