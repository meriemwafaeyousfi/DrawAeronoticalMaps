import React, { useCallback, useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import "./Window.css";
import { useDispatch, useSelector } from "react-redux";
import {
  setModal,
  setOption,
  setSelectedFeature,
} from "Pages/Production/CardDrawingTools/redux/actions";
import { Style, Icon } from "ol/style";
import { Point } from "ol/geom";
import { getSelectedSegment } from "Mapping/Features/FrontFlow/FrontStyles";
import {
  deleteFrontFeature,
  inverseFeature,
} from "Mapping/Features/FrontFlow/FrontFlow";

function Window({ vectorLayer }) {
  const src2 =
    "data:image/svg+xml,%3Csvg fill='white' width='60px' id='Layer_1' data-name='Layer 1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50 25'%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bfill:red;%7D%3C/style%3E%3C/defs%3E%3Ctitle%3E01%3C/title%3E%3Cpath class='cls-1' d='M50,36.5H0a25,25,0,0,1,50,0Z' transform='translate(0 -11.5)'/%3E%3C/svg%3E";

  const imageStyle = new Style({
    image: new Icon({
      anchor: [1, 1],
      src: src2,
      scale: 0.19,
    }),
    geometry: new Point([]),
  });

  const map = useSelector((state) => state.map);
  const selectedFeature = useSelector((state) => state.selectedFeature);
  const disptach = useDispatch();

  const [shapeTypes, setShapeTypes] = useState([]);
  useEffect(() => {
    if (selectedFeature) {
      const types = selectedFeature.get("type");
      let numSeg = selectedFeature?.getGeometry().getCoordinates().length - 1;
      if (types && types.length !== 0) {
        setShapeTypes(types);
      } else {
        setShapeTypes(new Array(numSeg).fill(1));
      }
    }
  }, [selectedFeature]);

  const [backupFeature, setBackupFeature] = useState(null);

  const [selectSeg, setSelectedSeg] = useState();
  const singleClick = useCallback(
    (event) => {
      map.forEachFeatureAtPixel(
        map.getEventPixel(event),
        (feature) => {
          if (feature.getGeometry().getType() != "Point") {
            if (feature.get("feature_type") === "courant_front") {
              const point = map.getEventCoordinate(event);
              const selectedSeg = getSelectedSegment(feature, point);
              console.log("now selected seg is", selectedSeg);
              setSelectedSeg(selectedSeg);
              selectedFeature.set("seg_selected", selectedSeg);
            }
          }
        },
        { hitTolerance: 10 }
      );
    },
    [selectedFeature, map]
  );

  const handleConfirm = useCallback(() => {
    disptach(setOption(""));
    disptach(setModal(""));
  }, [disptach]);

  const handleCancel = useCallback(() => {
    if (selectedFeature) {
      deleteFrontFeature(vectorLayer, selectedFeature);
      vectorLayer.getSource().addFeature(backupFeature);
      disptach(setSelectedFeature(backupFeature));
      disptach(setOption(""));
      disptach(setModal(""));
    }

    //map.getViewport().removeEventListener("click", singleClick);
  }, [backupFeature, disptach, map, selectedFeature, vectorLayer]);

  const handleChange = useCallback(
    (event) => {
      if (selectedFeature) {
        const seg = selectedFeature.get("seg_selected");
        let arr = [];
        setShapeTypes((state) => {
          arr = state.map((elm, index) => {
            if (index + 1 === seg) {
              return Number(event.target.value);
            } else return elm;
          });
          console.log("arr", arr);
          selectedFeature.set("type", arr);
          return arr;
        });
      }
    },
    [selectedFeature]
  );

  useEffect(() => {
    if (selectedFeature) {
      map.getViewport().removeEventListener("click", singleClick);
      map.getViewport().addEventListener("click", singleClick);
      setBackupFeature(selectedFeature.clone());
    } else {
      console.log("we go heere");
    }
  }, [selectedFeature]);

  const types = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const inverserHandler = useCallback(() => {
    if (selectedFeature) {
      inverseFeature(selectedFeature);
    }
  }, [selectedFeature]);
  return (
    <Dialog
      header="Front"
      headerClassName="cloudWindowHeader"
      contentClassName="cloudWindowContent"
      position="bottom-left"
      modal={false}
      visible={true}
      className="cloudWindow"
      keepInViewport={false}
      dismissableMask={false}
      closable={false}
    >
      <div className="content_container">
        <div className="col_4">
          <h4>Loc</h4>
        </div>
        <div className="col_4">
          <h4>Qté</h4>
        </div>
      </div>

      <div className="confirmation_buttons">
        <div>
          {types.map((type) => (
            <button value={type} onClick={handleChange}>
              type{type}
            </button>
          ))}
        </div>
        <div>
          <button onClick={inverserHandler}>reverse</button>
        </div>
        <div>
          <button onClick={handleConfirm}>Confirmer</button>
        </div>
        <div>
          <button onClick={handleCancel}>Annuler</button>
        </div>
      </div>
    </Dialog>
  );
}

export default Window;
