/* eslint-disable functional/functional-parameters */
import type { SvgMapViewerConfigUser } from 'svgmapviewer'
import { SvgMapViewer as SvgMapViewerCommon } from 'svgmapviewer-astro-floors'

import { makeRenderInfo } from '../../utils/react'
import { infoRenderers } from './render'

const RenderInfo = makeRenderInfo(infoRenderers)

declare global {
  interface Window {
    __svgMapViewerConfigUser__: SvgMapViewerConfigUser
  }
}

export function SvgMapViewer() {
  return (
    <SvgMapViewerCommon
      {...window.__svgMapViewerConfigUser__}
      RenderInfo={RenderInfo}
    />
  )
}
