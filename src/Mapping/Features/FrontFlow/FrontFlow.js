import { Draw, Modify, Select, Translate } from "ol/interaction";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { never, altKeyOnly } from "ol/events/condition";
import CircleStyle from "ol/style/Circle";
import { Style, Fill, Stroke } from "ol/style";
import { MultiPoint } from "ol/geom";
import { frontStyles, frontStyles2 } from "./FrontStyles";

export const frontFlowDrawingStartEvent = new CustomEvent(
  "courant_front:start"
);

export const frontFlowVectorLayer = () => {
  return new VectorLayer({
    title: "Front Flow Layer",
    source: new VectorSource(),
  });
};

export const drawFrontFlow = (vectorSource) => {
  return new Draw({
    source: vectorSource,
    type: "LineString",
    style: (feature) => {
      feature.setStyle((feature, resolution) => {
        if (feature.getGeometry().getType() === "LineString") {
          console.log("no me");
          if (feature.get("color")) {
            const color = feature.get("color");
            const type = feature.get("type");
            const seg = feature.get("seg_selected");
            console.log("fifiiiiiiii", new Style(frontStyles2(feature, resolution, color, type, seg)));
            return (frontStyles2(feature, resolution, color, type, seg));
          } else {
            console.log("draw first", new Style(frontStyles(feature, resolution)))
            return (frontStyles(feature, resolution));
          }
        }
      });
    },
  });
};

export const modifyFrontFlow = (select) => {
  return new Modify({
    features: select.getFeatures(),
    insertVertexCondition: never,
    removePoint: altKeyOnly,
    pixelTolerance: 10,
  });
};

export const selectFrontFlow = (vectorLayer) => {
  return new Select({
    layers: [vectorLayer],
    hitTolerance: 10,
    style: (feature, resolution) => {
      if (feature.getGeometry().getType() === "LineString") {
        const styles = [];

        if (feature.get("color")) {
          const color = feature.get("color");
          const type = feature.get("type");
          const seg = feature.get("seg_selected");

           frontStyles2(feature, resolution, color, type, seg).map((style) =>
               styles.push((style))
          );
          console.log("xxxxxx");
        } else {
          frontStyles(feature, resolution).map((style) => styles.push((style)));
          console.log("yyyyy");
        }
        const style = new Style({
          image: new CircleStyle({
            radius: 5,
            fill: new Fill({
              color: "#f59e0b",
            }),
            stroke: new Stroke({
              color: "#000000",
              width: 2,
            }),
          }),
          geometry: function (feature) {
            const coordinates = feature.getGeometry().getCoordinates();
            return new MultiPoint(coordinates);
          },
        });
        styles.push(style);
        return styles;
      }
    },
  });
};

export const translateFrontFlow = (vectorLayer) => {
  return new Translate({
    layers: [vectorLayer],
    hitTolerance: 10,
  });
};

export const frontFlowDrawingON = (map) => {
  map.getInteractions().forEach((interaction) => {
    if (interaction.get("title") === "courant_front:draw") {
      interaction.setActive(true);
    }
  });
};
