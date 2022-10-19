import React, { useCallback, useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import "./Window.css";
import { useDispatch, useSelector } from "react-redux";
import {
  setModal,
  setOption,
  setSelectedFeature,
} from "Pages/Production/CardDrawingTools/redux/actions";
import { getSelectedSegment } from "Mapping/Features/FrontFlow/FrontStyles";
import {
  deleteFrontFeature,
  inverseFeature,
} from "Mapping/Features/FrontFlow/FrontFlow";
import type1 from "../Window/images/multiTriangle.svg"
import type2 from "../Window/images/multiHalfCircles.svg";
import type3 from"../Window/images/circleTrianglePink.svg";
import type4 from "../Window/images/circleTriangleUpDown.svg";
import type5 from "../Window/images/inclinedMultiLines.svg";
import type6 from "../Window/images/line.svg";
import type7 from "../Window/images/twoLines.svg";
import type8 from "../Window/images/circleTrianglePurple.svg";
import type9 from "../Window/images/circleTriangleNotFillPurple.svg";
import type10 from"../Window/images/circleNotFillTrinaglePurple.svg"

function Window({ vectorLayer }) {
  const directions = [
    0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160,
    170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310,
    320, 330, 340, 350, 360,
  ];

  const types = [1,2,3,4,5,6,7,8,9,10]
  console.log("types are", types)
  const map = useSelector((state) => state.map);
  const selectedFeature = useSelector((state) => state.selectedFeature);
  const disptach = useDispatch();
  const [backupFeature, setBackupFeature] = useState(null);
  const [selectedSeg, setSelectedSeg] = useState(1);
  const [editState, setEdit] = useState("one");
  const [shapeTypes, setShapeTypes] = useState([]);
  const [reverseBtn, setReverseBtn] = useState(false);
  const [arrowInfo, setArrowInfo] = useState([
    {
      direction: 0,
      speed: null,
      color: "#000",
    },
  ]);
  const [reverse, setReverse] = useState([]);

  const editHandler = (event) => {
    const { value } = event.target;
    setEdit(value);
  };

  useEffect(() => {
    if (selectedFeature) {
      const types = selectedFeature.get("type");
      let numSeg = selectedFeature?.getGeometry().getCoordinates().length - 1;
      // types ------------------------
      if (types && types.length !== 0) {
        setShapeTypes(types);
      } else {
        selectedFeature.set("type", new Array(numSeg).fill(1));
        setShapeTypes(new Array(numSeg).fill(1));
      }
      // arrow------------------------
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
      //reverse ----------------------------------
      const reverse = selectedFeature.get("reverse");
      if (reverse && reverse.length !== 0) {
        setReverse(reverse);
      } else {
        selectedFeature.set("reverse", new Array(numSeg).fill(false));
        setReverse(new Array(numSeg).fill(false));
      }
    }
  }, [selectedFeature]);

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
  }, [backupFeature, disptach, map, selectedFeature, vectorLayer]);

  const handleChange = useCallback(
    (val) => {
      if (selectedFeature) {
    
        const seg = selectedFeature.get("seg_selected");
        console.log("event val",val);
        let arr = [];
        setShapeTypes((state) => {
          arr = state.map((elm, index) => {
            if (editState === "all") {
              return (val);
            } else {
              if (index + 1 === seg) {
                return (val);
              } else return elm;
            }
          });
          selectedFeature.set("type", arr);
          return arr;
        });
      }
    },
    [selectedFeature, editState]
  );

  const arrowHandleChange = useCallback(
    (event) => {
      const { id, value } = event.target;
      const seg = selectedFeature.get("seg_selected");
      let arr = [];
      setArrowInfo((state) => {
        arr = state.map((elm, index) => {
          if (editState === "all") {
            return { ...elm, [id]: id === "direction" ? Number(value) : value };
          } else if (index + 1 === seg) {
            return { ...elm, [id]: id === "direction" ? Number(value) : value };
          } else return elm;
        });
        selectedFeature.set("arrow", arr);
        return arr;
      });
    },
    [selectedFeature, editState]
  );

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

  const reverseHandler = useCallback(
    (event) => {
      const seg = selectedFeature.get("seg_selected");
      let arr = [];
      setReverse((state) => {
        arr = state.map((elm, index) => {
          if (editState === "all") {
            return !elm;
          } else {
            if (index + 1 === seg) {
              return !elm;
            } else return elm;
          }
        });
        selectedFeature.set("reverse", arr);
        return arr;
      });
    },
    [selectedFeature, editState]
  );

  return (
    <Dialog
      header="Front"
      headerClassName="frontWindowHeader"
      contentClassName="frontWindowContent"
      position="bottom-left"
      modal={false}
      visible={true}
      className="frontWindow"
      keepInViewport={false}
      dismissableMask={false}
      closable={false}
    >
      <div className="frontWindowContent">
        <div className="typesContainer">
          
            
              <button value={1} onClick={() => handleChange(1)}>
                 <img src={type1} />
              </button>
              <button value={2} onClick={() => handleChange(2)}>
                 <img src={type2} />
              </button>
              <button value={3} onClick={() => handleChange(3)}>
                 <img src={type3} />
              </button>
              <button value={4} onClick={() => handleChange(4)}>
                 <img src={type4} />
              </button>
              <button value={5} onClick={() => handleChange(5)}>
                 <img src={type5} />
              </button>
              <button value={6} onClick={() => handleChange(6)}>
                 <img src={type6} />
              </button>
              <button value={7} onClick={() => handleChange(7)}>
                <img src={type7} />
              </button>
              <button value={8} onClick={() => handleChange(8)}>
                <img src={type8} />
              </button>
              <button value={9} onClick={() => handleChange(9)}>
                <img src={type9} />
              </button>
              <button value={10} onClick={() => handleChange(10)}>
                <img src={type10} />
              </button>
        </div>
        <div>
          <div className="title">Appliquer à ce :</div>
          <div className="input-field-front" onChange={editHandler}>
            <input
              type="radio"
              value="one"
              name="group1"
              checked={editState === "one"}
            />
            <label htmlFor="color" className="form-control">
              ce Segment
            </label>

            <input
              type="radio"
              value="all"
              name="group1"
              checked={editState === "all"}
            />
            <label htmlFor="color" className="form-control">
              Tout le front
            </label>
          </div>
          <div className="title">coleur du text</div>
          <div className="input-field-front">
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
          <div className="title">direction</div>
          <div className="input-field-front">
            <select
              id="direction"
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
        <div className="title">vitesse</div>
        <div className="input-field-front">
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
          <button onClick={reverseHandler} className="inverse-btn">
            inverser
          </button>
        </div>
        <div className="confirmation_buttons">
          <div>
            <button onClick={handleConfirm}>Confirmer</button>
          </div>
          <div>
            <button onClick={handleCancel}>Annuler</button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

export default Window;
