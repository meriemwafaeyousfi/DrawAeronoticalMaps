import LineString from 'ol/geom/LineString'
import { transform } from 'ol/proj'
import {
	distance,
	lineString,
	along,
	bearing,
	destination,
	lineArc,
	point,
  bezier
} from '@turf/turf'

export const arc = (coordinates) => {
      let geometry = new LineString([])
      let line = {
      "type": "Feature",
      "properties": {
      },
      "geometry": {
        "type": "LineString",
        "coordinates": coordinates
      }
    }
    let curved = bezier(line)
    geometry.setCoordinates(curved["geometry"]["coordinates"])
  return geometry
}
