import type { SvgMapViewerConfigUser } from 'svgmapviewer'
import { SvgMapViewer as SvgMapViewerCommon } from 'svgmapviewer-astro-floors'

import { makeRenderInfo } from '../../utils/react'
import { infoRenderers } from './render'

const RenderInfo = makeRenderInfo(infoRenderers)

export function SvgMapViewer(config: Readonly<SvgMapViewerConfigUser>) {
  return <SvgMapViewerCommon {...config} renderInfo={RenderInfo} />
}
