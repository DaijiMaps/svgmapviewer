import { SvgMapViewerConfigUser } from 'svgmapviewer'
import {
  isFloorsRendered as isMapRendered,
  RenderFloors as renderMap,
} from 'svgmapviewer/map-floors'
import { floorsConfig } from './floors.config.ts'

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
  floorsConfig,
}

export default mapConfig
