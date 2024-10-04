import marche from './assets/marche.svg'
import { svgMapViewerConfig } from './lib/config'
import { RenderInfo } from './main-render'
import { workerSearchStart } from './main-search'
import { svgmapviewer } from './svgmapviewer'

svgmapviewer({
  root: 'root',
  map: 'map1',
  href: marche,
  width: 793.70079,
  height: 1122.5197,
  zoomFactor: 3,
  renderInfo: RenderInfo,
})

svgMapViewerConfig.searchCbs.add(workerSearchStart)

document.title = `svgmapviewer @ ${window.location.host}`
