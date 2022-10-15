import { Draw, Modify, Select, Translate } from "ol/interaction";
import {
  Stroke,
  Style,
  Fill,
  RegularShape,
  Icon,
  Text as olText,
} from "ol/style";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import CircleStyle from "ol/style/Circle";
import { Point, MultiPoint, LineString } from "ol/geom";
import {
  never,
  altKeyOnly,
  click,
  shiftKeyOnly,
  doubleClick,
} from "ol/events/condition";
import { distance } from "ol/coordinate";
import { feature } from "@turf/turf";
import Overlay from "ol/Overlay";
import { setSelectedFeature } from "../../../Pages/Production/NewCarte/redux/actions";

export const centreActionVectorLayer = () => {
  return new VectorLayer({
    title: "Centre Action",
    source: new VectorSource(),
  });
};

export const createCentreAction = (map, mapCoordinate) => {
  const resizer = document.getElementById("resizer");
  resizer.style.display = "none";
  let c = document.getElementById("mnode").firstChild;
  let cc = c.cloneNode(true);
  cc.className = "Resizer";
  cc.firstChild.className = "varbox content2";
  let element = cc;
  let overlayElt = new Overlay({
    position: mapCoordinate,
    element: element,
    stopEvent: false,
  });
  let clickTimes = 0;
  let timer = null;
  clearTimeout(timer);
  element.onclick = (e) => {
    //on single click
    timer = setTimeout(() => {
      if (clickTimes == 1) {
        console.log("signle click");
        setSelectedFeature(overlayElt);
        clearTimeout(timer);
        selectCentreAction(map, overlayElt);
        clickTimes = 0;
      }
    }, 200);
    clickTimes++;
    //on double click
    if (clickTimes == 2) {
      console.log("dblclickkkkkkkkkkk");
      setSelectedFeature(overlayElt);
      clearTimeout(timer);
      clickTimes = 0;
    }
  };
  overlayElt.set("feature_type", "centre_action");
  map.addOverlay(overlayElt);
  return overlayElt;
};

export const drawCentreAction = (vectorSource) => {
  return;
};

export const modifyCentreAction = (select, cvl) => {
  return;
};

export const selectCentreAction = (vectorLayer) => {
  return;
};

export const centreActionDrawingON = (map) => {
  let element = document.getElementById("resizer");
  let overlayElt = new Overlay({
    //  position: props.mapCoord,
    element: element,
    stopEvent: false,
  });
  map.addOverlay(overlayElt);
};
