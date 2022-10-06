import Tile from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';

let BlankMap = new Tile({
	title: 'Blank Map',
	source: new TileWMS({
		url: 'https://geoserver.meteo.dz/cite/wms',
		params: {
			LAYERS: 'cite:MondeView',
			TILED: true,
			VERSION: '1.3.0',
			FORMAT: 'image/png8',
			WIDTH: 256,
			HEIGHT: 256,
			CRS: 'EPSG:3857',
		},
		serverType: 'geoserver',
	}),
	zIndex: 0,
});

export default BlankMap;
