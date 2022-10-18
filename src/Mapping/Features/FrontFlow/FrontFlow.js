import { Draw, Modify, Select, Translate } from "ol/interaction";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { never, altKeyOnly } from "ol/events/condition";
import CircleStyle from "ol/style/Circle";
import { Style, Fill, Stroke } from "ol/style";
import { MultiPoint, LineString } from "ol/geom";
import { frontStyles, frontStyles2 } from "./FrontStyles";
import { distance } from "ol/coordinate";

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
          if (feature.get("type") ||feature.get("arrow"))  {
            const type = feature.get("type");
            const seg = feature.get("seg_selected");
            return frontStyles2(feature, resolution);
          } else {
            return frontStyles(feature, resolution);
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
        if (feature.get("type") ||feature.get("arrow"))  {
          const type = feature.get("type");
          const seg = feature.get("seg_selected");
          frontStyles2(feature, resolution).map((style) =>
            styles.push(style)
          );
          console.log("we entered to frontStyles2");
        } else {
          frontStyles(feature, resolution).map((style) => styles.push(style));
          console.log("we entered to frontStyles normal");
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

export const deleteFrontFeature = (layer, feature) => {
  layer.getSource().removeFeature(feature);
  // add delete flech of speed with text
};

export const addPoigneFrontHandle = (point, feature) => {
  const pointOnFeature = feature.getGeometry().getClosestPoint(point);
  let newCoordinates = [feature.getGeometry().getCoordinates()[0]];
  let index = 0;
  let bool = false;
  feature.getGeometry().forEachSegment((start, end) => {
    const segement = new LineString([start, end]);
    const pointOnSegement = segement.getClosestPoint(point);
    const distanceBetweenTheTwoPoint = distance(
      pointOnFeature,
      pointOnSegement
    );
    if (distanceBetweenTheTwoPoint === 0) {
      newCoordinates.push(pointOnFeature);
      newCoordinates.push(end);
       bool = true;
    } else {
      newCoordinates.push(end);
    }
    if(!bool) index++;
  });
  feature.getGeometry().setCoordinates(newCoordinates);
  feature.get("type").splice(index+1 ,0,feature.get("type")[index])
  feature.getGeometry().setCoordinates(newCoordinates);
  feature.get("arrow").splice(index+1 ,0,feature.get("arrow")[index])
}

export const deletePoigneFrontHandle = (point, feature) => {
  let newCoordinates = [];
  feature
    .getGeometry()
    .getCoordinates()
    .forEach((coord) => {
      if (distance(point, coord) >= 350000) {
        newCoordinates.push(coord);
      }
    });
  feature.getGeometry().setCoordinates(newCoordinates);
};

export const inverseFeature = (feature) => {
  console.log("feature ",feature);
	feature
		.getGeometry()
		.setCoordinates(feature.getGeometry().getCoordinates().reverse());
};

