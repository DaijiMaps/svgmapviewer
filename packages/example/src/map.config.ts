import { SvgMapViewerConfigUser } from 'svgmapviewer'
import {
  isFloorsRendered as isMapRendered,
  RenderFloors as renderMap,
} from 'svgmapviewer/map-floors'
import floor1f from './assets/1f.svg'
import floor2f from './assets/2f.svg'

const mapConfig: SvgMapViewerConfigUser = {
  backgroundColor: 'grey',
  renderMap,
  isMapRendered,
  origViewBox: {
    x: 0,
    y: 0,
    width: 200,
    height: 300,
  },
  floorsConfig: {
    floors: [
      { name: '1F', href: floor1f },
      { name: '2F', href: floor2f },
    ],
    fidx: 0,
  },
}

export default mapConfig
