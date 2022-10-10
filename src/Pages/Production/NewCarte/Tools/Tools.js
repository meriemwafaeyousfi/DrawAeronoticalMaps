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
import { setModal, setOption } from "../redux/actions";
import { getSelectedSegment } from "../../../../Mapping/Features/FrontFlow/FrontStyles";

function Tools() {
  const map = useSelector((state) => state.map);
  const modal = useSelector((state) => state.modal);
  const option = useSelector((state) => state.option);
  const selectedFeature = useSelector((state) => state.selectedFeature);

  const dispatch = useDispatch();

  const [undoRedo, setUndoRedo] = useState(null);

  const singleClick = useCallback(
	(event) => {
    map.forEachFeatureAtPixel(
	  map.getEventPixel(event),
	   (feature) => {
       if (feature.getGeometry().getType() != "Point") {
		if(feature.get("feature_type") === "courant_front") {
		/*	const point = map.getEventCoordinate(event);
			console.log("feature in single",feature, "point",point);
			const selectedSeg = getSelectedSegment(feature, point);
			console.log("new selectedSeg",selectedSeg)
			selectedFeature.set("seg_selected", selectedSeg);
           dispatch(setModal(feature.get("feature_type")));*/
           console.log("hiiiiiiiiiiiiiiiiiiiiiiii")
		}
      }
    },
	{ hitTolerance: 10 }
	);
  }, [selectedFeature, map]);

  const doubleClick = useCallback(
    (event) => {
      dispatch(setModal(""));
	 // map.getViewport().removeEventListener("click", singleClick);
      map.forEachFeatureAtPixel(
        map.getEventPixel(event),
        (feature) => {
          if (feature.getGeometry().getType() !== "Point") {
            if (feature.get("feature_type") === "courant_front") {
              /*const point = map.getEventCoordinate(event);
              const selectedSeg = getSelectedSegment(feature, point);
              selectedFeature.set("seg_selected", selectedSeg);*/
			       // map.getViewport().addEventListener("click", singleClick);
              dispatch(setModal(feature.get("feature_type")));
            } else {
              dispatch(setModal(feature.get("feature_type")));
            }
			
          
          }
        },
        { hitTolerance: 10 }
      );
    },
    [dispatch, selectedFeature, singleClick, map]
  );

  
  
  const nothing = useCallback(() => {
    if (map) {
      map.un("singleclick", zoomingInAndCenter);
      map.un("singleclick", zoomingOutAndCenter);
	//  map.un("singleclick", singleClick);
      map.getViewport().removeEventListener("dblclick", doubleClick);
	 //map.getViewport().removeEventListener("click", singleClick);
      dragPanOff(map);
      endDrawing(map);
      selectOff(map);
      translateOff(map);
      document.querySelector("#map-container").style.cursor = "unset";
    }
  }, [doubleClick, singleClick, map]);

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
        case "courant_jet":
          toggleToolsOption(jetFlowDrawingON);
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
          toggleToolsOption(jetFlowDrawingON);
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

        default:
          toggleToolsOption(selectOn);
          if (selectedFeature)
            map.getViewport().addEventListener("dblclick", doubleClick);
          break;
      }
    }
  }, [
    doubleClick,
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
      command: () => {
        option !== "zoom_in"
          ? dispatch(setOption("zoom_in"))
          : dispatch(setOption(""));
      },
    },
    {
      id: "zoom_out",
      icon: "/Icons/Clouds/magnifying-glass-minus-solid.svg",
      alt: "Zoom Out icon",
      command: () => {
        option !== "zoom_out"
          ? dispatch(setOption("zoom_out"))
          : dispatch(setOption(""));
      },
    },
    {
      id: "drag",
      icon: "/Icons/Clouds/hand-solid.svg",
      alt: "Drag icon",
      command: () => {
        option !== "drag"
          ? dispatch(setOption("drag"))
          : dispatch(setOption(""));
      },
    },
    {
      id: "zone_texte",
      icon: "/Icons/Clouds/message-regular.svg",
      alt: "Zone de texte icon",
      command: () => {
        option !== "zone_texte"
          ? dispatch(setOption("zone_texte"))
          : dispatch(setOption(""));
      },
    },
    {
      id: "zone_nuageuse",
      icon: "/Icons/Clouds/cloud-solid.svg",
      alt: "Zone nuageuse icon",
      command: () => {
        option !== "zone_nuageuse"
          ? dispatch(setOption("zone_nuageuse"))
          : dispatch(setOption(""));
      },
    },
    {
      id: "courant_jet",
      icon: "/Icons/Clouds/wind-solid.svg",
      alt: "Courant jet icon",
      command: () => {
        option !== "courant_jet"
          ? dispatch(setOption("courant_jet"))
          : dispatch(setOption(""));
      },
    },
    {
      id: "courant_front",
      icon: "/Icons/Clouds/i-cursor-solid.svg",
      alt: "front icon",
      command: () => {
        option !== "courant_front"
          ? dispatch(setOption("courant_front"))
          : dispatch(setOption(""));
      },
    },
    {
      id: "cat",
      icon: "/Icons/Clouds/i-cursor-solid.svg",
      alt: "Cat icon",
      command: () => {
        option !== "cat" ? dispatch(setOption("cat")) : dispatch(setOption(""));
      },
    },
    {
      id: "ligne",
      icon: "/Icons/Clouds/i-cursor-solid.svg",
      alt: "ligne icon",
      command: () => {
        option !== "ligne"
          ? dispatch(setOption("ligne"))
          : dispatch(setOption(""));
      },
    },
    {
      id: "fleche",
      icon: "/Icons/Clouds/i-cursor-solid.svg",
      alt: "Flèche icon",
      command: () => {
        option !== "fleche"
          ? dispatch(setOption("fleche"))
          : dispatch(setOption(""));
      },
    },
    {
      id: "centres_action",
      icon: "/Icons/Clouds/i-cursor-solid.svg",
      alt: "Centres d'action icon",
      command: () => {
        option !== "centres_action"
          ? dispatch(setOption("centres_action"))
          : dispatch(setOption(""));
      },
    },
    {
      id: "volcan",
      icon: "/Icons/Clouds/volcano-solid.svg",
      alt: "Volcan icon",
      command: () => {
        option !== "volcan"
          ? dispatch(setOption("volcan"))
          : dispatch(setOption(""));
      },
    },
    {
      id: "tropopause",
      icon: "/Icons/Clouds/i-cursor-solid.svg",
      alt: "tropopause icon",
      command: () => {
        option !== "tropopause"
          ? dispatch(setOption("tropopause"))
          : dispatch(setOption(""));
      },
    },
    {
      id: "condition_en_surface",
      icon: "/Icons/Clouds/i-cursor-solid.svg",
      alt: "text Zone icon",
      command: () => {
        option !== "condition_en_surface"
          ? dispatch(setOption("condition_en_surface"))
          : dispatch(setOption(""));
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
        >
          <img src={item.icon} alt={item.alt} height={20} width={20} />
        </button>
      ))}
    </div>
  );
}

export default Tools;
