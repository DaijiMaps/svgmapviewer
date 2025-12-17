import { SvgMapViewerConfigUser } from 'svgmapviewer'

import { mapData } from './src/data/all'

const userConfig: SvgMapViewerConfigUser = {
  root: 'root',
  title: 'Yugyoji',
  copyright: '@ Daiji Maps | map data @ OpenStreetMap contributers',
  zoomFactor: 3,
  mapData,
}

document.title = `svgmapviewer @ ${window.location.host}`

export default userConfig
