/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'

import { type OsmRenderMapProps } from '../../types'
import { RenderMapCommon } from '../carto'
import { isShadowRootRendered } from '../dom'
import { MAP_SVG_PATHS_ROOT_ID } from './map-svg-react'
import { MapHtml } from './MapHtml'
import { MapSvgLabels } from './MapSvgLabels'
import { MapSvgMarkers } from './MapSvgMarkers'
import { MapSvgObjects } from './MapSvgObjects'
import { MapSvgPaths } from './MapSvgPaths'
import { MapSvgSymbols } from './MapSvgSymbols'

export function OsmRenderMap(props: Readonly<OsmRenderMapProps>): ReactNode {
  return RenderMapCommon(props)
}

export function RenderMapOsmDefault(
  props: Readonly<OsmRenderMapProps>
): ReactNode {
  return (
    <>
      <MapSvgPaths {...props} />
      <MapSvgObjects {...props} />
      <MapSvgSymbols {...props} />
      <MapSvgMarkers {...props} />
      <MapSvgLabels {...props} />
      <MapHtml {...props} />
    </>
  )
}

export function isMapOsmDefaultRendered(): boolean {
  return isShadowRootRendered(MAP_SVG_PATHS_ROOT_ID)
}
