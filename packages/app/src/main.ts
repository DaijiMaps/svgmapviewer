import {
  calcScale,
  svgMapViewerConfig,
  svgmapviewer,
} from '@daijimaps/svgmapviewer'
import { RenderMap } from './main-map'
import { mapData } from './main-map-data'
import { RenderInfo } from './main-render'
import { workerSearchStart } from './main-search'

const { mapConv, mapViewBox } = calcScale(mapData)

svgmapviewer({
  root: 'root',
  map: 'map1',
  origViewBox: mapViewBox,
  zoomFactor: 2,
  renderMap: RenderMap,
  renderInfo: RenderInfo,
  copyright: '@ Daiji Maps | map data @ OpenStreetMap contributers',
  mapData: mapData,
  mapConv: mapConv,
})

svgMapViewerConfig.searchCbs.add(workerSearchStart)

document.title = `svgmapviewer @ ${window.location.host}`
