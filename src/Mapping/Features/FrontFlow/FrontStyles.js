import {
  bezierSpline,
  lineSplit,
  distance,
  along,
  nearestPointOnLine,
} from "@turf/turf";
import { Circle, Style, Icon, Fill, Stroke } from "ol/style";
import { LineString, Point } from "ol/geom";
import {
  src1,
  src2,
  src3_1,
  src3_2,
  src8_1,
  src8_2,
  src9_1,
  src9_2,
  src10_1,
  src10_2,
} from "./data/images";

const line = {
  type: "Feature",
  geometry: {
    type: "LineString",
    coordinates: undefined,
  },
};

const splitedLineStyle = new Style({
  stroke: new Stroke({
    color: "blue",
    width: 2,
  }),
  geometry: new LineString([]),
});

const lineStyle = new Style({
  stroke: new Stroke({
    color: "blue",
    width: 2,
  }),
  geometry: new LineString([]),
});

//----------------------------//
const styleCache1 = [];
const styleCache2 = [];
const styleCache3_1 = [];
const styleCache3_2 = [];
const styleCache8_1 = [];
const styleCache8_2 = [];
const styleCache9_1 = [];
const styleCache9_2 = [];
const styleCache10_1 = [];
const styleCache10_2 = [];
//--------------------------//
const styleLineCache = [];

const point = {
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: undefined,
  },
};

function distance1(p1, p2) {
  let a = p1[0] - p2[0];
  let b = p1[1] - p2[1];
  return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
}

export const getClosestPointToCoords = (coordinates, point) => {
  let distances = [];
  let distance = 0;
  let min = 0;
  coordinates.forEach((element, id) => {
    if (element != null) {
      distance = distance1(point, coordinates[id]);
      distances[id] = distance;
    }
  });
  min = Math.min.apply(null, distances);
  return distances.indexOf(min);
};

function segmentsStyles(feature, curved) {
  const poignees = feature.getGeometry().getCoordinates();
  const coords = curved.geometry.coordinates;
  const styles = [];
  poignees.forEach((coord, id) => {
    if (
      id === poignees.length - 1 ||
      (poignees[id][0] === poignees[id + 1][0] &&
        poignees[id][1] === poignees[id + 1][1])
    )
      return;
    const index0 = getClosestPointToCoords(coords, poignees[id]);
    const index1 = getClosestPointToCoords(coords, poignees[id + 1]);
    const coordsSplit = [];
    for (var j = index0; j <= index1; j++) {
      coordsSplit.push(coords[j]);
    }
    let geometry = new LineString([]);
    let line = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: coordsSplit,
      },
    };
    const curved2 = bezierSpline(line);
    geometry.set("poignees", [poignees[id], poignees[id + 1]]);
    geometry.setCoordinates(curved2["geometry"]["coordinates"]);

    styleLineCache[id] = splitedLineStyle.clone();
    const lineSplitStyle = styleLineCache[id];
    lineSplitStyle.setGeometry(geometry);
    styles.push(lineSplitStyle);
  });
  return styles;
}

const getPoint = (feature, coordinates, index) => {
  const end = coordinates[index];
  const prev = coordinates[index - 1];
  const rotation = -Math.atan2(end[1] - prev[1], end[0] - prev[0]);
  const segPoint = getSelectedSegment(feature, end);
  return { end: end, rotation: rotation, seg: segPoint };
};

const getPointStyle = (styleCache, point, i, src) => {
  const imageStyle = new Style({
    image: new Icon({
      anchor: [0.9, 0.9],
      src: src,
      scale: 0.24,
    }),
    geometry: new Point([]),
  });
  if (styleCache.length - 1 < i) {
    styleCache[i] = imageStyle.clone();
  }
  const pointStyle = styleCache[i];
  if (pointStyle) {
    pointStyle.getGeometry().setCoordinates(point.end);
    pointStyle.getGeometry().set("seg", point.segPoint);
    pointStyle.getImage().setRotation(point.rotation);
    return pointStyle;
  }
};

function getShapeStyle(feature, coordinates, i, index, type) {
  const {
    end: end,
    rotation: rotation,
    seg: segPoint,
  } = getPoint(feature, coordinates, index);
  const {
    end: end2,
    rotation: rotation2,
    seg: segPoint2,
  } = getPoint(feature, coordinates, index + 7);

  const pointInfo = {
    end: end,
    rotation: rotation,
    seg: segPoint,
  };
  const pointInfo2 = {
    end: end2,
    rotation: rotation2,
    seg: segPoint2,
  };
  switch (type) {
    case 1:
      return getPointStyle(styleCache1, pointInfo, i, src1);

    case 2:
      return getPointStyle(styleCache2, pointInfo, i, src2);

    case 3:
      return [
        getPointStyle(styleCache3_1, pointInfo, i, src3_1),
        getPointStyle(styleCache3_2, pointInfo2, i, src3_2),
      ];

    case 8:
      return [
        getPointStyle(styleCache8_1, pointInfo, i, src8_1),
        getPointStyle(styleCache8_2, pointInfo2, i, src8_2),
      ];

    case 9:
      return [
        getPointStyle(styleCache9_1, pointInfo, i, src9_1),
        getPointStyle(styleCache9_2, pointInfo2, i, src9_2),
      ];

    case 10:
      return [
        getPointStyle(styleCache10_1, pointInfo, i, src10_1),
        getPointStyle(styleCache10_2, pointInfo2, i, src10_2),
      ];

    default:
      return getPointStyle(styleCache1, pointInfo, i, src1);
  }
}

export function frontStyles(feature, resolution) {
  const styles = [];
  if (feature.getGeometry().getType() === "LineString") {
    line.geometry.coordinates = feature.getGeometry().getCoordinates();
    const curved = bezierSpline(line);
    segmentsStyles(feature, curved).map((style) => styles.push(style)); //add the styles for each segment line
    lineStyle.getGeometry().setCoordinates(curved.geometry.coordinates);
    const curveGeometry = lineStyle.getGeometry();
    const lengthInPixels = curveGeometry.getLength() / resolution;
    const pointsNeeded = Math.ceil(lengthInPixels / 60);
    for (let i = 0; i < pointsNeeded; i++) {
      point.geometry.coordinates = curveGeometry.getCoordinateAt(
        (i + 0.5) / pointsNeeded
      );
      const split = lineSplit(curved, point);
      const coordinates = split.features[0].geometry.coordinates;
      const length = coordinates.length;
      const index = length - 15;
      const end = coordinates[index];
      let elm = getShapeStyle(feature, coordinates, i, index);
      styles.push(elm);
    }
  }
  return styles;
}

function segmentsStyles2(feature, curved, type) {
  const poignees = feature.getGeometry().getCoordinates();
  const coords = curved.geometry.coordinates;
  const styles = [];
  poignees.forEach((coord, id) => {
    if (
      id === poignees.length - 1 ||
      (poignees[id][0] === poignees[id + 1][0] &&
        poignees[id][1] === poignees[id + 1][1])
    )
      return;
    const index0 = getClosestPointToCoords(coords, poignees[id]);
    const index1 = getClosestPointToCoords(coords, poignees[id + 1]);
    const coordsSplit = [];
    for (var j = index0; j <= index1; j++) {
      coordsSplit.push(coords[j]);
    }
    let geometry = new LineString([]);
    let line = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: coordsSplit,
      },
    };
    const curved2 = bezierSpline(line);
    geometry.setCoordinates(curved2["geometry"]["coordinates"]);
    styleLineCache[id] = splitedLineStyle.clone();
    switch (type[id]) {
      case 1:
        styleLineCache[id].getStroke().setColor("blue");
        break;
      case 2:
        styleLineCache[id].getStroke().setColor("red");
        break;
      case 3:
        styleLineCache[id].getStroke().setColor("#ef00c3");
        break;
      case 8:
        styleLineCache[id].getStroke().setColor("#7f00ff");
        break;
      case 9:
        styleLineCache[id].getStroke().setColor("#7f00ff");
        break;
      case 10:
        styleLineCache[id].getStroke().setColor("#7f00ff");
        break;
      default:
        styleLineCache[id].getStroke().setColor("blue");
        break;
    }
    const lineSplitStyle = styleLineCache[id];
    lineSplitStyle
      .getGeometry()
      .setCoordinates(curved2["geometry"]["coordinates"]);
    styles.push(lineSplitStyle);
  });
  return styles;
}

export function frontStyles2(feature, resolution, type, seg) {
  const styles = [];
  if (feature.getGeometry().getType() === "LineString") {
    line.geometry.coordinates = feature.getGeometry().getCoordinates();
    const curved = bezierSpline(line);
    const list = [];
    segmentsStyles2(feature, curved, type).map((style) => {
      styles.push(style);
      list.push(style);
    }); //add the styles for each segment line
    lineStyle.getGeometry().setCoordinates(curved.geometry.coordinates);
    const curveGeometry = lineStyle.getGeometry();
    const lengthInPixels = curveGeometry.getLength() / resolution;
    const pointsNeeded = Math.ceil(lengthInPixels / 60);
    for (let i = 0; i < pointsNeeded; i++) {
      point.geometry.coordinates = curveGeometry.getCoordinateAt(
        (i + 0.5) / pointsNeeded
      );
      const split = lineSplit(curved, point);
      const coordinates = split.features[0].geometry.coordinates;
      const length = coordinates.length;
      const index = length - 15;
      const end = coordinates[index];
      /*****************************************/
      const segPoint = getSelectedSegment(feature, end);
      // console.log('type in styles',type);
      let elm = getShapeStyle(
        feature,
        coordinates,
        i,
        index,
        type[segPoint - 1]
      );

      if (elm && Array.isArray(elm)) {
        console.log("type is 3 elm arr is", elm);
        elm.map((style) => styles.push(style));
      } else styles.push(elm);
    }
  }
  return styles;
}

export const getSelectedSegment = (feature, point) => {
  let bool = false;
  let seg;
  line.geometry.coordinates = feature.getGeometry().getCoordinates();
  const curved = bezierSpline(line);
  const poignees = feature.getGeometry().getCoordinates();
  const coords = curved.geometry.coordinates;
  const indexPt = getClosestPointToCoords(coords, point);
  poignees.map((elm, id) => {
    if (id === poignees.length - 1) return;
    let idx = coords.indexOf(elm);
    let id2;
    if (!bool) {
      if (idx === -1) {
        idx = getClosestPointToCoords(coords, elm);
        id2 = getClosestPointToCoords(coords, poignees[id + 1]);
      }
      if (indexPt > idx && indexPt < id2) {
        seg = id + 1;
        bool = true;
      }
      if (indexPt > idx && indexPt < id2) {
        seg = id;
        bool = true;
      }
    }
  });
  return seg + 1;
};
