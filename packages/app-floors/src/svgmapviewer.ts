/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { svgmapviewer, type SvgMapViewerConfigUser } from 'svgmapviewer'
import {
  isFloorsRendered as isMapRendered,
  RenderFloors as renderMap,
} from 'svgmapviewer/map-floors'

export function svgmapviewerFloors(
  config: Readonly<SvgMapViewerConfigUser>
): void {
  svgmapviewer({
    renderMap,
    isMapRendered,
    ...config,
  })
}
