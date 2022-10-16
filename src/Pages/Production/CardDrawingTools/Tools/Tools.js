import React, { useCallback, useEffect, useState } from "react";
import "./Tools.css";
import { DragPan } from "ol/interaction";
import UndoRedo from "ol-ext/interaction/UndoRedo";
import {
  translateOff,
  translateOn,
  endDrawing,
  selectOff,
  selectOn,
  zoomingInAndCenter,
  zoomingOutAndCenter,
  dragPanOff,
  save,
  dragPanOn,
} from "../../../../Mapping/Map";
import { cloudDrawingON } from "../../../../Mapping/Features/Clouds/Clouds";
import { frontFlowDrawingON } from "../../../../Mapping/Features/FrontFlow/FrontFlow";
import { useDispatch, useSelector } from "react-redux";
import { setMapCoordinate, setModal, setOption } from "../redux/actions";
import { jetDrawingON } from "../../../../Mapping/Features/Jet/Jet";
import { centreActionDrawingON } from "../../../../Mapping/Features/CentreAction/CentreAction";
import { CATDrawingON } from "Mapping/Features/CAT/CAT";

function Tools() {
  const map = useSelector((state) => state.map);
  const modal = useSelector((state) => state.modal);
  const option = useSelector((state) => state.option);
  const mapCoordinate = useSelector((state) => state.mapCoordinate);

  const dispatch = useDispatch();

  const [undoRedo, setUndoRedo] = useState(null);

  const doubleClick = useCallback(
    (event) => {
      console.log("double click");
      dispatch(setModal(""));
      map.forEachFeatureAtPixel(
        map.getEventPixel(event),
        (feature) => {
          if (feature.getGeometry().getType() !== "Point") {
            dispatch(setModal(feature.get("feature_type")));
            dispatch(setOption(""));
          }
        },
        { hitTolerance: 10 }
      );
    },
    [dispatch, map]
  );

  const click = useCallback(
    (event) => {
      dispatch(setMapCoordinate(event.coordinate));
      dispatch(setModal("centre_action"));
      dispatch(setOption(""));
    },
    [dispatch]
  );

  useEffect(() => {
    if (map) {
      dragPanOff(map);
      const ur = new UndoRedo({
        maxLength: 10,
      });
      setUndoRedo(ur);
      map.addInteraction(ur);
    }
  }, [map]);

  useEffect(() => {
    if (map) {
      switch (option) {
        case "zoom_in":
          map.on("singleclick", zoomingInAndCenter);
          document.querySelector("#map-container").style.cursor = "zoom-in";
          break;
        case "zoom_out":
          map.on("singleclick", zoomingOutAndCenter);
          document.querySelector("#map-container").style.cursor = "zoom-out";
          break;
        case "drag":
          dragPanOn(map);
          translateOn(map);
          document.querySelector("#map-container").style.cursor = "grab";
          break;
        case "zone_texte":
          console.log("not defined yet");
          break;
        case "zone_nuageuse":
          cloudDrawingON(map);
          break;
        case "jet":
          jetDrawingON(map);
          break;
        case "courant_front":
          frontFlowDrawingON(map);
          break;
        case "CAT":
          CATDrawingON(map);
          break;
        case "ligne":
          console.log("not defined yet");
          break;
        case "fleche":
          console.log("not defined yet");
          break;
        case "centres_action":
          if (!mapCoordinate) map.on("click", click);
          centreActionDrawingON(map);
          break;
        case "volcan":
          console.log("not defined yet");
          break;
        case "tropopause":
          console.log("not defined yet");
          break;
        case "condition_en_surface":
          console.log("not defined yet");
          break;
        case "select":
          selectOn(map);
          map.getViewport().addEventListener("dblclick", doubleClick);
          break;
        default:
          break;
      }
    }
    return () => {
      if (map) {
        map.getViewport().removeEventListener("dblclick", doubleClick);
        map.un("click", click);
        map.un("singleclick", zoomingInAndCenter);
        map.un("singleclick", zoomingOutAndCenter);
        dragPanOff(map);
        endDrawing(map);
        selectOff(map);
        translateOff(map);
        document.querySelector("#map-container").style.cursor = "unset";
      }
    };
  }, [doubleClick, click, map, option, mapCoordinate]);

  const items = [
    {
      id: "zoom_in",
      icon: "/Icons/Clouds/magnifying-glass-plus-solid.svg",
      alt: "Zoom In icon",
      title: "zoom_in",
      command: () => {
        option !== "zoom_in"
          ? dispatch(setOption("zoom_in"))
          : dispatch(setOption("select"));
      },
    },
    {
      id: "zoom_out",
      icon: "/Icons/Clouds/magnifying-glass-minus-solid.svg",
      alt: "Zoom Out icon",
      title: "zoom_out",
      command: () => {
        option !== "zoom_out"
          ? dispatch(setOption("zoom_out"))
          : dispatch(setOption("select"));
      },
    },
    {
      id: "drag",
      icon: "/Icons/Clouds/hand-solid.svg",
      alt: "Drag icon",
      title: "drag",
      command: () => {
        option !== "drag"
          ? dispatch(setOption("drag"))
          : dispatch(setOption("select"));
      },
    },
    {
      id: "zone_texte",
      icon: "/Icons/Clouds/message-regular.svg",
      alt: "Zone de texte icon",
      title: "Zone de texte",
      command: () => {
        option !== "zone_texte"
          ? dispatch(setOption("zone_texte"))
          : dispatch(setOption("select"));
      },
    },
    {
      id: "zone_nuageuse",
      icon: "/Icons/Clouds/cloud-solid.svg",
      alt: "Zone nuageuse icon",
      title: "Zone nuageuse",
      command: () => {
        option !== "zone_nuageuse"
          ? dispatch(setOption("zone_nuageuse"))
          : dispatch(setOption("select"));
      },
    },
    {
      id: "jet",
      icon: "/Icons/Clouds/wind-solid.svg",
      alt: "Courant jet icon",
      title: "Courant jet",
      command: () => {
        option !== "jet"
          ? dispatch(setOption("jet"))
          : dispatch(setOption("select"));
      },
    },
    {
      id: "courant_front",
      icon: "/Icons/Front/graph.png",
      alt: "front icon",
      title: "Courant front",
      command: () => {
        option !== "courant_front"
          ? dispatch(setOption("courant_front"))
          : dispatch(setOption("select"));
      },
    },
    {
      id: "CAT",
      icon: "/Icons/CAT/dashed-line.png",
      alt: "Cat icon",
      title: "CAT",
      command: () => {
        option !== "CAT"
          ? dispatch(setOption("CAT"))
          : dispatch(setOption("select"));
      },
    },
    {
      id: "ligne",
      icon: "/Icons/Clouds/i-cursor-solid.svg",
      alt: "ligne icon",
      title: "Ligne",
      command: () => {
        option !== "ligne"
          ? dispatch(setOption("ligne"))
          : dispatch(setOption("select"));
      },
    },
    {
      id: "fleche",
      icon: "/Icons/Clouds/i-cursor-solid.svg",
      alt: "Flèche icon",
      title: "Flèche",
      command: () => {
        option !== "fleche"
          ? dispatch(setOption("fleche"))
          : dispatch(setOption("select"));
      },
    },
    {
      id: "centres_action",
      icon: "/Icons/Clouds/centre_action.png",
      alt: "Centres d'action icon",
      title: "Centres d'action",
      command: () => {
        option !== "centres_action"
          ? dispatch(setOption("centres_action"))
          : dispatch(setOption("select"));
      },
    },
    {
      id: "volcan",
      icon: "/Icons/Clouds/volcano-solid.svg",
      alt: "Volcan icon",
      title: "Volcan",
      command: () => {
        option !== "volcan"
          ? dispatch(setOption("volcan"))
          : dispatch(setOption("select"));
      },
    },
    {
      id: "tropopause",
      icon: "/Icons/Clouds/i-cursor-solid.svg",
      alt: "tropopause icon",
      title: "Tropopause",
      command: () => {
        option !== "tropopause"
          ? dispatch(setOption("tropopause"))
          : dispatch(setOption("select"));
      },
    },
    {
      id: "condition_en_surface",
      icon: "/Icons/Clouds/flag.png",
      alt: "text Zone icon",
      title: "Condition en surface",
      command: () => {
        option !== "condition_en_surface"
          ? dispatch(setOption("condition_en_surface"))
          : dispatch(setOption("select"));
      },
    },
  ];

  return (
    <div className="tools">
      <button
        onClick={() => {
          save(map);
        }}
        id={"save"}
        title="Sauvgarder"
      >
        <img
          src="/Icons/Clouds/floppy-disk-solid.svg"
          alt="save"
          height={20}
          width={20}
        />
      </button>
      <button
        onClick={() => {
          undoRedo.undo();
        }}
        id={"save"}
        title="Undo"
      >
        <img
          src="/Icons/Clouds/rotate-left-solid.svg"
          alt="undo"
          height={20}
          width={20}
        />
      </button>
      <button
        onClick={() => {
          undoRedo.redo();
        }}
        id={"save"}
        title="Redo"
      >
        <img
          src="/Icons/Clouds/rotate-right-solid.svg"
          alt="redo"
          height={20}
          width={20}
        />
      </button>
      {items.map((item, key) => (
        <button
          onClick={item.command}
          key={key}
          id={item.id}
          disabled={modal !== ""}
          className={option === item.id ? "active" : ""}
          title={item.title}
        >
          <img src={item.icon} alt={item.alt} height={20} width={20} />
        </button>
      ))}
    </div>
  );
}

export default Tools;
