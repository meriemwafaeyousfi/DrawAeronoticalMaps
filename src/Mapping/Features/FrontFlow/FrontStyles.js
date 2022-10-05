import { bezierSpline, lineSplit } from "@turf/turf";
import { Circle, Style, Icon, Fill, Stroke } from "ol/style";
import { LineString, Point } from "ol/geom";

const src =
  "data:image/svg+xml,%3Csvg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' fill='blue' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='50px' height='50px' viewBox='0 0 120 120' enable-background='new 0 0 120 120' xml:space='preserve' %3E%3Cpolygon  points='0.233,106.52 60,3 119.768,106.52 ' /%3E%3C/svg%3E";
const src2 =
  "data:image/svg+xml,%3Csvg fill='white' width='60px' id='Layer_1' data-name='Layer 1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 50 25'%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bfill:red;%7D%3C/style%3E%3C/defs%3E%3Ctitle%3E01%3C/title%3E%3Cpath class='cls-1' d='M50,36.5H0a25,25,0,0,1,50,0Z' transform='translate(0 -11.5)'/%3E%3C/svg%3E";

const imageStyle0 = new Style({
  image: new Icon({
    anchor: [1, 1],
    src: src2,
    scale: 0.19,
  }),
  geometry: new Point([]),
});

const imageStyle = new Style({
  image: new Icon({
    anchor: [1, 1],
    src: src,
    scale: 0.25,
  }),
  geometry: new Point([]),
});

const drawStyle = new Style({
  image: new Circle({
    radius: 5,
    fill: new Fill({
      color: "red",
    }),
  }),
});

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

const styleCache = [];
const styleCache2 = [];
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

function getClosestPointToCoords(coordinates, point) {
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
}

function segmentsStyles(feature, curved) {
  const poignees = feature.getGeometry().getCoordinates();
  const coords = curved.geometry.coordinates;
  const styles = [];
  poignees.forEach((coord,id) => {
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
    const lineSplitStyle = styleLineCache[id];
    lineSplitStyle
      .getGeometry()
      .setCoordinates(curved2["geometry"]["coordinates"]);
    styles.push(lineSplitStyle);
  });
  return styles;
}

function getShapeStyle (coordinates, styleCache, imageStyle, i, index)  {
  const end = coordinates[index];
  const prev = coordinates[index -1];
  const rotation = -Math.atan2(end[1] - prev[1], end[0] - prev[0]);

  if (styleCache.length - 1 < i) {
    styleCache[i] = imageStyle.clone();
  }
  const pointStyle = styleCache[i];
  pointStyle.getGeometry().setCoordinates(end);
  pointStyle.getImage().setRotation(rotation);
  return pointStyle;
};

export function frontStyles(feature, resolution) {
  const styles = [];
  if (feature.getGeometry().getType() === "LineString") {
    line.geometry.coordinates = feature.getGeometry().getCoordinates();
    const curved = bezierSpline(line);
    segmentsStyles(feature, curved).map((style) => styles.push(style)); //add the styles for each segment line
    lineStyle.getGeometry().setCoordinates(curved.geometry.coordinates);
    const curveGeometry = lineStyle.getGeometry();
    const lengthInPixels = curveGeometry.getLength() / resolution;
    const pointsNeeded = Math.ceil(lengthInPixels / 50);
    for (let i = 0; i < pointsNeeded; i++) {
      point.geometry.coordinates = curveGeometry.getCoordinateAt(
        (i + 0.5) / pointsNeeded
      );
      const split = lineSplit(curved, point);
      const coordinates = split.features[0].geometry.coordinates;
      const length = coordinates.length;
      const index = length - 15;
      let elm = getShapeStyle(coordinates, styleCache, imageStyle, i, index); // add style for first shape
      styles.push(elm);
    /* if (split.features[1]) {
         elm = getShapeStyle(coordinates, styleCache2, imageStyle0, i , length - 1); // add style for second shape
        styles.push(elm);
      }*/

    }
  }
  return styles;
}
