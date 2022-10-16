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

import Feature from "ol/Feature";
import { LineString } from "ol/geom";
import { preventDefault } from "ol/events/Event";

function Window({ vectorLayer, sff }) {
  const src2 =
    "data:image/svg+xml,%3Csvg fill='white' width='60px' id='Layer_1' data-name='Layer 1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50 25'%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bfill:red;%7D%3C/style%3E%3C/defs%3E%3Ctitle%3E01%3C/title%3E%3Cpath class='cls-1' d='M50,36.5H0a25,25,0,0,1,50,0Z' transform='translate(0 -11.5)'/%3E%3C/svg%3E";
  const directions = [
    0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160,
    170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310,
    320, 330, 340, 350, 360,
  ];

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
  const [speed, setSpeed] = useState();
  const [direction, setDirection] = useState("20");
  const [color, setColor] = useState();
  const arrow = {
    direction: undefined,
    speed: null,
    color: "#000",
  };
  const [arrowInfo, setArrowInfo] = useState([
    {
      direction: 0,
      speed: null,
      color: "#000",
    },
  ]);

  useEffect(() => {
    if (selectedFeature) {
      const types = selectedFeature.get("type");
      let numSeg = selectedFeature?.getGeometry().getCoordinates().length - 1;
      if (types && types.length !== 0) {
        setShapeTypes(types);
      } else {
        selectedFeature.set("type", new Array(numSeg).fill(1));
        setShapeTypes(new Array(numSeg).fill(1));
      }
      const arrow = selectedFeature.get("arrow");
      if (arrow && types.length !== 0) {
        setArrowInfo(arrow);
      } else {
        setArrowInfo(
          new Array(numSeg).fill({
            direction: 0,
            speed: null,
            color: "#000",
          })
        );
        selectedFeature.set(
          "arrow",
          new Array(numSeg).fill({
            direction: 0,
            speed: null,
            color: "#000",
          })
        );
      }
    }
  }, [selectedFeature]);

  const [backupFeature, setBackupFeature] = useState(null);

  const [selectedSeg, setSelectedSeg] = useState(1);
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
  const arrowHandleChange = useCallback((event) => {
    const { id, value } = event.target;
    const seg = selectedFeature.get("seg_selected");
    console.log("seg is", seg);
    let arr = [];
    setArrowInfo((state) => {
      arr = state.map((elm, index) => {
        if (index + 1 === seg) {
          return { ...elm, [id]: id === "direction" ? Number(value) : value };
        } else return elm;
      });
      console.log("arr", arr);
      selectedFeature.set("arrow", arr);
      return arr;
    });
  }, []);

  const directionHandleChange = (event) => {
    const { value } = event.target;
    console.log("value direction", value);
    setDirection(event.target.value);
  };
  const speedHandleChange = useCallback((event) => {}, []);
  const addArrowHandler = useCallback(() => {
    if (selectedFeature) {
    }
  }, [selectedFeature]);

  useEffect(() => {
    if (selectedFeature) {
      map.getViewport().removeEventListener("click", singleClick);
      map.getViewport().addEventListener("click", singleClick);
      setBackupFeature(selectedFeature.clone());
      console.log("arrowInfo", arrowInfo);
    } else {
      console.log("we go heere");
    }
  }, [selectedFeature, arrowInfo]);

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
      <div className="cloudWindowContent">
        <div>
          {types.map((type) => (
            <button value={type} onClick={handleChange}>
              type{type}
            </button>
          ))}
        </div>
        <div>
          <div className="text">Appliquer à ce :</div>
          <form>
            <fieldset
              id="group1"
              //value={props.inverseSeg}
              // onChange={(e) => {props.setInverseSeg(e.target.value);console.log("inverseg in radio",props.inverseSeg) }
            >
              <label htmlFor="color">ce Segment</label>
              <input
                type="radio"
                value="one"
                name="group1"
                label="ce segment"
              />
              <label htmlFor="color">Tout le front</label>
              <input
                type="radio"
                value="all"
                name="group1"
                label="tout le front"
              />
            </fieldset>
          </form>
          <div className="input_field">
            <label htmlFor="color">Couleur</label>
            <input
              type="color"
              id="color"
              value={
                arrowInfo[selectedSeg - 1]
                  ? arrowInfo[selectedSeg - 1].color
                  : "#000"
              }
              onChange={arrowHandleChange}
            />
          </div>
          <div className="input_field">
            <label>Direction</label>
            <select
              id="direction"
              style={{ width: "100px" }}
              label="Style"
              value={
                arrowInfo[selectedSeg - 1]
                  ? arrowInfo[selectedSeg - 1].direction
                  : undefined
              }
              onChange={arrowHandleChange}
            >
              {directions.map((elet, index) => {
                return (
                  <option key={index} value={elet} id="direction">
                    {elet}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div className="input_field">
          <label htmlFor="width">vitesse</label>
          <input
            type="number"
            id="speed"
            autoComplete="off"
            value={
              arrowInfo[selectedSeg - 1] ? arrowInfo[selectedSeg - 1].speed : 0
            }
            onChange={arrowHandleChange}
          />
        </div>
        <div>
          <button onClick={inverserHandler}>inverser</button>
        </div>
        <div>
          <button>add arrow speed</button>
        </div>
        <div className="confirmation_buttons">
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
