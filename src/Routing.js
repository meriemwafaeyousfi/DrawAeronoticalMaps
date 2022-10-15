import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./Routing.css";
import NavBar from "Components/NavBar/NavBar";
import NewCard from "Pages/Production/NewCard/NewCard";
import SavedCards from "Pages/Production/SavedCards/SavedCards";
import CardDrawingTools from "./Pages/Production/CardDrawingTools/CardDrawingTools";

function Routing() {
  return (
    <BrowserRouter>
      <NavBar />
      <div className="pageContent">
        <Routes>
          <Route path="/production">
            <Route path="nouvelle_carte" element={<CardDrawingTools />} />
            <Route path="carte_sauvegardee" element={<SavedCards />} />
            <Route path="carte/:cardid" element={<CardDrawingTools />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default Routing;
