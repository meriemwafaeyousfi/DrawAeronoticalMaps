import React, { useEffect, useRef, useState } from "react";
import { ContextMenu as PrimeContextMenu } from "primereact/contextmenu";
import "./MapContextMenu.css";
import {
  addAHandle,
  deleteAHandle,
  deleteClouds,
} from "Mapping/Features/Clouds/Clouds";
import {
  deleteFrontFeature,
  addPoigneFrontHandle,
  deletePoigneFrontHandle,
} from "../../../../Mapping/Features/FrontFlow/FrontFlow";
import {
  copyFeature,
  cutFeature,
  pastFeature,
  verticesCheck,
} from "Mapping/Map";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedFeature } from "../redux/actions";

import { useCallback } from "react";

function MapContextMenu() {
  const map = useSelector((state) => state.map);
  const selectedFeature = useSelector((state) => state.selectedFeature);
  const disptach = useDispatch();
  const CMRef = useRef(null);
  const [rightClickedFeature, setRightClickedFeature] = useState(null);
  const [eventCoordiantes, setEventCoordinates] = useState(null);
  const [layer, setLayer] = useState();
  const [vertex, setVertex] = useState(false);

  const items = [
    {
      label: "Ajouter un poignée",
      icon: "ajouter-poingee",
      visible:
        !!rightClickedFeature &&
        (rightClickedFeature.get("feature_type") === "zone_nuageuse" ||
          rightClickedFeature.get("feature_type") === "courant_front") &&
        !vertex &&
        rightClickedFeature === selectedFeature,
      command: () => {
        if (rightClickedFeature.get("feature_type") === "zone_nuageuse")
          addAHandle(eventCoordiantes, rightClickedFeature);
        else if (rightClickedFeature.get("feature_type") === "courant_front")
          addPoigneFrontHandle(eventCoordiantes, rightClickedFeature);
      },
    },
    {
      label: "Supprimer le poignée",
      icon: "supprimer-poingee",
      visible:
        !!rightClickedFeature &&
        (rightClickedFeature.get("feature_type") === "zone_nuageuse" ||
          rightClickedFeature.get("feature_type") === "courant_front") &&
        vertex &&
        rightClickedFeature === selectedFeature,
      command: () => {
        deleteAHandle(eventCoordiantes, rightClickedFeature);
      },
    },
    {
      label: "Ajouter une zone de texte",
      icon: "ajouter-zone-text",
      visible:
        !!rightClickedFeature &&
        rightClickedFeature.get("feature_type") === "zone_nuageuse" &&
        rightClickedFeature === selectedFeature,
      command: () => {},
    },
    {
      label: "Supprimer la zone de texte",
      icon: "supprimer-zone-text",
      visible:
        !!rightClickedFeature &&
        rightClickedFeature.get("feature_type") === "zone_nuageuse" &&
        rightClickedFeature === selectedFeature,
      command: () => {},
    },
    {
      label: "Copier",
      icon: "copie-figure",
      disabled: !rightClickedFeature || rightClickedFeature !== selectedFeature,
      command: () => {
        copyFeature(map, rightClickedFeature);
      },
    },
    {
      label: "Couper",
      icon: "couper-figure",
      disabled: !rightClickedFeature || rightClickedFeature !== selectedFeature,
      command: () => {
        cutFeature(map, rightClickedFeature);
      },
    },
    {
      label: "Coller",
      icon: "coller-figure",
      disabled:
        !!map && !(map.get("feature_copiee") || map.get("feature_coupee")),
      command: () => {
        pastFeature(map, layer, eventCoordiantes);
      },
    },
    {
      label: "Supprimer la figure",
      icon: "supprimer-figure",
      disabled:
        !rightClickedFeature ||
        rightClickedFeature !== selectedFeature ||
        (rightClickedFeature.get("feature_type") !== "zone_nuageuse" &&
          rightClickedFeature.get("feature_type") !== "courant_front"),
      command: () => {
        deleteClouds(selectedFeature, layer);
        disptach(setSelectedFeature(null));
      },
    },
  ];

  useEffect(() => {
    if (map) {
      map.getViewport().addEventListener("contextmenu", (event) => {
        setEventCoordinates(null);
        setRightClickedFeature(null);
        setVertex(false);
        const eventCoordinate = map.getCoordinateFromPixel(
          map.getEventPixel(event)
        );
        setEventCoordinates(eventCoordinate);
        map.forEachFeatureAtPixel(
          map.getEventPixel(event),
          (feature, layer) => {
            if (feature.getGeometry().getType() !== "Point") {
              setLayer(layer);
              setRightClickedFeature(feature);
              setVertex(verticesCheck(eventCoordinate, feature));
            }
          },
          { hitTolerance: 10 }
        );
        CMRef.current.show(event);
      });
    }
  }, [map]);
  return (
    <PrimeContextMenu model={items} style={{ width: "260px" }} ref={CMRef} />
  );
}

export default MapContextMenu;
