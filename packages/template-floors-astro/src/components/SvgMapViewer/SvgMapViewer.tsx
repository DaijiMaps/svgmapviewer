import type { SvgMapViewerConfigUser } from 'svgmapviewer'
import { SvgMapViewer as SvgMapViewerCommon } from 'svgmapviewer-astro-floors'

import { makeRenderInfo } from '../../utils/react'
import { xinfoRenderers } from './render'

const RenderInfo = makeRenderInfo(xinfoRenderers)

export function SvgMapViewer(config: Readonly<SvgMapViewerConfigUser>) {
  return <SvgMapViewerCommon {...config} RenderInfo={RenderInfo} />
}
