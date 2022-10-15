import React, { useCallback, useEffect, useState } from "react";
import {
  centreActionVectorLayer,
  createCentreAction,
  modifyCentreAction,
  selectCentreAction,
  translateCentreAction,
} from "../../../../Mapping/Features/CentreAction/CentreAction";
import {
  displayResizer,
  createResizer,
} from "../../../../Mapping/Features/CentreAction/Resizer";
import * as extent from "ol/extent";
import { useDispatch, useSelector } from "react-redux";
import { endDrawing } from "Mapping/Map";
import {
  setOption,
  setSelectedFeature,
} from "../../CardDrawingTools/redux/actions";
import Overlay from "ol/Overlay";
import Resizer from "./Resizer/Resizer";
import Window from "./Window/Window";
import { Rnd } from "react-rnd";

function CentreAction() {
  const [resizeActive, setResizeActive] = useState(false);
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);
  const [widthResizer, setWidthResizer] = useState(80);
  const [heightResizer, setHeightResizer] = useState(80);
  const [widthImg, setWidthImg] = useState(80);
  const [heightImg, setHeightImg] = useState(100);

  const [nameCentre, setNameCentre] = useState("c");
  const [vitesse, setVitesse] = useState(null);
  const [texte, setTexte] = useState("");
  const [direction, setDirection] = useState(0);

  const map = useSelector((state) => state.map);
  const dispatch = useDispatch();
  const modal = useSelector((state) => state.modal);
  const mapCoordinate = useSelector((state) => state.mapCoordinate);
  const selectedFeature = useSelector((state) => state.selectedFeature);

  const init = useCallback(() => {
    const feature = createResizer(map, mapCoordinate);
    dispatch(setSelectedFeature(feature));
  }, [dispatch, map]);

  useEffect(() => {
    if (map) init();
  }, [init, map]);

  useEffect(() => {
    if (!mapCoordinate) return;
    displayResizer(selectedFeature, mapCoordinate);
  }, [dispatch, mapCoordinate]);

  const resizerOverlayDiv = () => {
    const display = modal === "centre_action" ? "block" : "none";
    return (
      <div id="resizer" style={{ display: { display } }}>
        <Resizer
          nameCentre={nameCentre}
          vitesse={vitesse}
          direction={direction}
          texte={texte}
          resizeActive={resizeActive}
          setResizeActive={setResizeActive}
          setWidthImg={setWidthImg}
          setHeightImg={setHeightImg}
          widthImg={widthImg}
          heightImg={heightImg}
          top={top}
          left={left}
          setTop={setTop}
          setLeft={setLeft}
          widthResizer={widthResizer}
          setWidthResizer={setWidthResizer}
          heightResizer={heightResizer}
          setHeightResizer={setHeightResizer}
        ></Resizer>
      </div>
    );
  };

  return (
    <div>
      {resizerOverlayDiv()}{" "}
      {modal === "centre_action" && (
        <Rnd className="snapshotDialog" style={{ zIndex: 6 }}>
          <Window
            nameCentre={nameCentre}
            setNameCentre={setNameCentre}
            vitesse={vitesse}
            setVitesse={setVitesse}
            direction={direction}
            setDirection={setDirection}
            texte={texte}
            setTexte={setTexte}
          />
        </Rnd>
      )}
    </div>
  );
}

export default CentreAction;
