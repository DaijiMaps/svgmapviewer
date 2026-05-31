import type { SvgMapViewerConfigUser } from 'svgmapviewer'
import { SvgMapViewer } from 'svgmapviewer-astro-floors'

import { RenderInfo } from '../app/render'

export function Main(config: Readonly<SvgMapViewerConfigUser>) {
  return <SvgMapViewer {...config} renderInfo={RenderInfo} />
}
