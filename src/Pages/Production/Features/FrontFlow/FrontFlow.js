import React, { useCallback, useEffect, useState } from "react";
import {
  drawFrontFlow,
  frontFlowVectorLayer,
  modifyFrontFlow,
  selectFrontFlow,
  translateFrontFlow,
} from "Mapping/Features/FrontFlow/FrontFlow";
import { useDispatch, useSelector } from "react-redux";
import { endDrawing } from "Mapping/Map";
import {
  setModal,
  setOption,
  setSelectedFeature,
} from "Pages/Production/CardDrawingTools/redux/actions";
import Window from "./Window/Window";

function FrontFlow() {
  const map = useSelector((state) => state.map);
  const modal = useSelector((state) => state.modal);
  const [vectorLayer, setVectorLayer] = useState(null);

  const dispatch = useDispatch();
  const init = useCallback(() => {
    const ffvl = frontFlowVectorLayer();
    map.addLayer(ffvl);
    setVectorLayer(ffvl);
    const sff = selectFrontFlow(ffvl);
    sff.set("title", "courant_front:select");
    sff.setActive(false);
    sff.on("select", ({ selected }) => {
      if (selected[0]) {
        dispatch(setSelectedFeature(selected[0]));
      } else {
        dispatch(setSelectedFeature(null));
      }
    });
    map.addInteraction(sff);

    const djf = drawFrontFlow(ffvl.getSource());
    djf.set("title", "courant_front:draw");
    djf.setActive(false);
    djf.on("drawend", ({ feature }) => {
      //sff.getFeatures().clear();
      feature.set("feature_type", "courant_front");
      feature.set("number_seg", feature.getGeometry().getCoordinates() - 1);
      endDrawing(map);
      dispatch(setOption(""));
    });
    map.addInteraction(djf);

    ffvl.getSource().on("addfeature", ({ feature }) => {
      if (feature.get("feature_type") === "courant_front") {
        sff.getFeatures().clear();
        sff.getFeatures().push(feature);
        dispatch(setSelectedFeature(feature));
      }
    });

    const mff = modifyFrontFlow(sff);
    mff.set("title", "courant_front:modify");
    map.addInteraction(mff);

    const tff = translateFrontFlow(ffvl);
    tff.set("title", "courant_front:translate");
    tff.setActive(false);
    map.addInteraction(tff);
  }, [dispatch, map]);

  useEffect(() => {
    if (map) init();
  }, [init, map]);
  return modal === "courant_front" && <Window vectorLayer={vectorLayer} />;
}

export default FrontFlow;
