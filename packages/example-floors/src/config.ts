import { type SvgMapViewerConfigUser } from 'svgmapviewer'
import {
  isFloorsRendered as isMapRendered,
  RenderFloors as renderMap,
} from 'svgmapviewer/map-floors'

export const floorsCommonConfig: SvgMapViewerConfigUser = {
  renderMap,
  isMapRendered,
}
