import { SvgMapViewerConfigUser } from 'svgmapviewer'
import { RenderFloors as renderMap, isFloorsRendered as isMapRendered } from 'svgmapviewer/map'
import floor1f from './1f.svg'
import floor2f from './2f.svg'

const mapConfig: SvgMapViewerConfigUser = {
  cartoConfig: {
    backgroundColor: 'grey',
  },
  renderMap,
  isMapRendered,
  origViewBox : {
    x: 0,
    y: 0,
    width: 200,
    height: 300,
  },
  floorsConfig: {
    floors: [
      { name: "1F", href: floor1f },
      { name: "2F", href: floor2f },
    ],
    fidx: 0,
  },
}

export default mapConfig
