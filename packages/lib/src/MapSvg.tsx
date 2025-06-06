/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'
import { RenderMapCommon } from './lib/carto'
import { useMapSvgRendered } from './lib/map-svg-react'
import './MapSvg.css'
import { MapSvgStyle } from './MapSvgStyle'

export function MapSvg(): ReactNode {
  // eslint-disable-next-line functional/no-expression-statements
  useMapSvgRendered()

  // viewBox will be updated by syncViewBox()
  return (
    <>
      <svg id="map-svg-svg" viewBox="0 0 1 1" width="100%" height="100%">
        <RenderMapCommon />
      </svg>
      <MapSvgStyle />
    </>
  )
}
