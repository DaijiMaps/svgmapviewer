import { SvgMapViewerConfigUser } from 'svgmapviewer'
import { RenderFloors as renderMap, isFloorsRendered as isMapRendered } from 'svgmapviewer/map'
import floor1f from './1f.inkscape.svg'
import floor2f from './2f.inkscape.svg'

const origViewBox = {
  x: 0,
  y: 0,
  width: 1000,
  height: 1000,
}

const userConfig: SvgMapViewerConfigUser = {
  title: 'Example Floor Map',
  zoomFactor: 2,
  cartoConfig: {
    backgroundColor: 'grey',
  },
  renderMap,
  isMapRendered,
  origViewBox,
  floorsConfig: {
    floors: [
      { name: "1F", href: floor1f },
      { name: "2F", href: floor2f },
    ],
    fidx: 0,
  },
}

export default userConfig
