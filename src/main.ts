import marche from './assets/marche.svg'
import { svgMapViewerConfig } from './lib/config'
import { geoJsonViewBox } from './lib/map/geojson'
import { RenderMap } from './main-map'
import { RenderInfo } from './main-render'
import { workerSearchStart } from './main-search'
import { svgmapviewer } from './svgmapviewer'

svgmapviewer({
  root: 'root',
  map: 'map1',
  href: marche,
  origViewBox: geoJsonViewBox,
  zoomFactor: 2,
  renderMap: RenderMap,
  renderInfo: RenderInfo,
  copyright: '@ Daiji Maps | map data @ OpenStreetMap contributers',
})

svgMapViewerConfig.searchCbs.add(workerSearchStart)

document.title = `svgmapviewer @ ${window.location.host}`
