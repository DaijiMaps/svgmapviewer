/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'
import { RenderMapCommon } from './lib/carto'
import { isShadowRootRendered } from './lib/dom'
import { MAP_SVG_LAYERS_ROOT_ID } from './lib/map-svg-react'
import { MapHtml } from './MapHtml'
import { MapSvgLabels } from './MapSvgLabels'
import { MapSvgLayers } from './MapSvgLayers'
import { MapSvgMarkers } from './MapSvgMarkers'
import { MapSvgObjects } from './MapSvgObjects'
import { MapSvgSymbols } from './MapSvgSymbols'

export function RenderMap(): ReactNode {
  return RenderMapCommon()
}

export function RenderMapDefault(): ReactNode {
  return <></>
}

export function RenderMapOsmDefault(): ReactNode {
  return (
    <>
      <MapSvgLayers />
      <MapSvgObjects />
      <MapSvgSymbols />
      <MapSvgMarkers />
      <MapSvgLabels />
      <MapHtml />
    </>
  )
}

export function isMapRenderedOsmDefault(): boolean {
  return isShadowRootRendered(MAP_SVG_LAYERS_ROOT_ID)
}
