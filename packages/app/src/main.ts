import { svgMapViewerConfig, svgmapviewer } from '@daijimaps/svgmapviewer'
import { calcScale } from '@daijimaps/svgmapviewer/map'
import { RenderMap } from './map'
import { mapData } from './map-data'
import { RenderInfo } from './render'
import { workerSearchStart } from './search'

const { mapCoord, mapViewBox } = calcScale(mapData)

svgmapviewer({
  root: 'root',
  map: 'map1',
  origViewBox: mapViewBox,
  zoomFactor: 2,
  renderMap: RenderMap,
  renderInfo: RenderInfo,
  copyright: '@ Daiji Maps | map data @ OpenStreetMap contributers',
  mapData: mapData,
  mapCoord: mapCoord,
})

svgMapViewerConfig.searchCbs.add(workerSearchStart)

document.title = `svgmapviewer @ ${window.location.host}`
