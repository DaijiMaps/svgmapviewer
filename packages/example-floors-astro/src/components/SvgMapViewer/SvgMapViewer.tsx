import type { SvgMapViewerConfigUser } from 'svgmapviewer'
import { SvgMapViewer as SvgMapViewerCommon } from 'svgmapviewer-astro-floors'

import { RenderInfo } from './render'

export function SvgMapViewer(config: Readonly<SvgMapViewerConfigUser>) {
  return <SvgMapViewerCommon {...config} renderInfo={RenderInfo} />
}
