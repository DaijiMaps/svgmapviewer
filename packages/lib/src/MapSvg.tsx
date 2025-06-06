/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'
import { RenderMapCommon } from './lib/carto'
import { useMapSvgRendered } from './lib/map-svg-react'
import { useLayout } from './lib/style-xstate'
import './MapSvg.css'
import { MapSvgStyle } from './MapSvgStyle'

export function MapSvg(): ReactNode {
  // eslint-disable-next-line functional/no-expression-statements
  useMapSvgRendered()

  const { scroll } = useLayout()

  // viewBox will be updated by syncViewBox()
  return (
    <>
      <svg
        id="map-svg-svg"
        viewBox="0 0 1 1"
        width={scroll.width}
        height={scroll.height}
      >
        <RenderMapCommon />
      </svg>
      <MapSvgStyle />
    </>
  )
}
