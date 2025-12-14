/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'
import { RenderMapCommon } from '../carto'
import { isShadowRootRendered } from '../dom'
import { MAP_SVG_LAYERS_ROOT_ID } from './map-svg-react'
import { MapHtml } from './MapHtml'
import { MapSvgLabels } from './MapSvgLabels'
import { MapSvgLayers } from './MapSvgLayers'
import { MapSvgMarkers } from './MapSvgMarkers'
import { MapSvgObjects } from './MapSvgObjects'
import { MapSvgSymbols } from './MapSvgSymbols'
import type { DataConfig, RenderConfig } from '../../types'

export function RenderMap(
  props: Readonly<{ data: DataConfig; render: RenderConfig }>
): ReactNode {
  return RenderMapCommon(props)
}

export function RenderMapOsmDefault(
  props: Readonly<{ data: DataConfig; render: RenderConfig }>
): ReactNode {
  return (
    <>
      <MapSvgLayers {...props} />
      <MapSvgObjects {...props} />
      <MapSvgSymbols {...props} />
      <MapSvgMarkers {...props} />
      <MapSvgLabels />
      <MapHtml />
    </>
  )
}

export function isMapOsmDefaultRendered(): boolean {
  return isShadowRootRendered(MAP_SVG_LAYERS_ROOT_ID)
}
