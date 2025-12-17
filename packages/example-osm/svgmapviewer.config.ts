import { SvgMapViewerConfigUser } from 'svgmapviewer'

const userConfig: SvgMapViewerConfigUser = {
  title: 'Yugyoji',
  copyright: '@ Daiji Maps | map data @ OpenStreetMap contributers',
  zoomFactor: 3,
}

document.title = `svgmapviewer @ ${window.location.host}`

export default userConfig
