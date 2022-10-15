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
} from "../../../../Mapping/Map";
import { cloudDrawingON } from "../../../../Mapping/Features/Clouds/Clouds";
import { jetFlowDrawingON } from "../../../../Mapping/Features/JetFlow/JetFlow";
import { frontFlowDrawingON } from "../../../../Mapping/Features/FrontFlow/FrontFlow";
import { useDispatch, useSelector } from "react-redux";
import { setMapCoordinate, setModal, setOption } from "../redux/actions";
import { jetDrawingON } from "../../../../Mapping/Features/Jet/Jet";
import { centreActionDrawingON } from "../../../../Mapping/Features/CentreAction/CentreAction";
import { click } from "ol/events/condition";
import { getSelectedSegment } from "../../../../Mapping/Features/FrontFlow/FrontStyles";

function Tools() {
  const map = useSelector((state) => state.map);
  const modal = useSelector((state) => state.modal);
  const option = useSelector((state) => state.option);
  const mapCoordinate = useSelector((state) => state.mapCoordinate);
  const selectedFeature = useSelector((state) => state.selectedFeature);

  const dispatch = useDispatch();

  const [undoRedo, setUndoRedo] = useState(null);

  const doubleClick = useCallback(
    (event) => {
      dispatch(setModal(""));
      map.forEachFeatureAtPixel(
        map.getEventPixel(event),
        (feature) => {
          if (feature.getGeometry().getType() !== "Point") {
            dispatch(setModal(feature.get("feature_type")));
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
      map.un("click", click);
    },
    [dispatch, map]
  );

  const nothing = useCallback(() => {
    if (map) {
      map.un("singleclick", zoomingInAndCenter);
      map.un("singleclick", zoomingOutAndCenter);
      map.un("click", click);
      map.getViewport().removeEventListener("dblclick", doubleClick);

      dragPanOff(map);
      endDrawing(map);
      selectOff(map);
      translateOff(map);
      document.querySelector("#map-container").style.cursor = "unset";
    }
  }, [doubleClick, click, map]);

  const toggleToolsOption = useCallback(
    (drawingFunction) => {
      nothing();
      drawingFunction(map);
    },
    [map, nothing]
  );

  const dragAndTranslate = useCallback(() => {
    nothing();
    map.getInteractions().forEach((interaction) => {
      if (interaction instanceof DragPan) {
        interaction.setActive(true);
      }
    });
    translateOn(map);
    document.querySelector("#map-container").style.cursor = "grab";
  }, [map, nothing]);

  const zoom = useCallback(
    (opt, action) => {
      nothing();
      map.on("singleclick", action);
      document.querySelector("#map-container").style.cursor =
        opt === "zoom_in" ? "zoom-in" : "zoom-out";
    },
    [map, nothing]
  );
  useEffect(() => {
    if (map) {
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
          zoom("zoom_in", zoomingInAndCenter);
          break;
        case "zoom_out":
          zoom("zoom_out", zoomingOutAndCenter);
          break;
        case "drag":
          dragAndTranslate();
          break;
        case "zone_texte":
          toggleToolsOption(jetFlowDrawingON);
          break;
        case "zone_nuageuse":
          toggleToolsOption(cloudDrawingON);
          break;
        case "jet":
          toggleToolsOption(jetDrawingON);
          break;
        case "courant_front":
          toggleToolsOption(frontFlowDrawingON);
          break;
        case "cat":
          toggleToolsOption(jetFlowDrawingON);
          break;
        case "ligne":
          toggleToolsOption(jetFlowDrawingON);
          break;
        case "fleche":
          toggleToolsOption(jetFlowDrawingON);
          break;
        case "centres_action":
          toggleToolsOption(centreActionDrawingON);
          map.on("click", click);
          break;
        case "volcan":
          toggleToolsOption(jetFlowDrawingON);
          break;
        case "tropopause":
          toggleToolsOption(jetFlowDrawingON);
          break;
        case "condition_en_surface":
          toggleToolsOption(jetFlowDrawingON);
          break;
        case "select":
          toggleToolsOption(selectOn);
          map.getViewport().addEventListener("dblclick", doubleClick);
          break;
        default:
          nothing();
          break;
      }
    }
  }, [
    doubleClick,
    click,
    dragAndTranslate,
    map,
    option,
    selectedFeature,
    toggleToolsOption,
    zoom,
  ]);
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
      icon: "/Icons/Clouds/i-cursor-solid.svg",
      alt: "front icon",
      title: "Courant front",
      command: () => {
        option !== "courant_front"
          ? dispatch(setOption("courant_front"))
          : dispatch(setOption("select"));
      },
    },
    {
      id: "cat",
      icon: "/Icons/Clouds/i-cursor-solid.svg",
      alt: "Cat icon",
      title: "Cat",
      command: () => {
        option !== "cat"
          ? dispatch(setOption("cat"))
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
