import {Point ,Polygon} from 'ol/geom';

export const pictoGeometryFunction = function (Coordinate) {
	return new Point(Coordinate);
   
};

export const polyGeom=function(coordinate,distance){
   var t= distance/ Math.cos(Math.PI / 4)
   var y= t*Math.cos(Math.PI / 4) + coordinate[1]
   var x= t*Math.sin(Math.PI / 4) +  coordinate[0]
   var p1= [x,y]
   var p2= [x-t,y]
   var p3=[x,y-t]
   var p4=[x-t,y-t]
   return [p1,p2,p4,p3];
}

