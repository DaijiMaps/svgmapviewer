import {
  calcScale,
  svgMapViewerConfig,
  svgmapviewer,
} from '@daijimaps/svgmapviewer'
import { RenderMap } from './map'
import { mapData } from './map-data'
import { RenderInfo } from './render'
import { workerSearchStart } from './search'

const { mapConv, mapViewBox } = calcScale(mapData)

// eslint-disable-next-line functional/no-expression-statements
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

// eslint-disable-next-line functional/no-expression-statements
svgMapViewerConfig.searchCbs.add(workerSearchStart)

// eslint-disable-next-line functional/no-expression-statements, functional/immutable-data
document.title = `svgmapviewer @ ${window.location.host}`
