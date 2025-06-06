/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'
import { MAP_SVG_CONTENT_ID, useMapSvgRendered } from './lib/map-svg-react'
import { useLayout } from './lib/style-xstate'
import { RenderMap } from './Map'
import { MapSvgStyle } from './MapSvgStyle'

export function MapSvg(): ReactNode {
  return (
    <>
      <MapSvgRender />
      <MapSvgSvg />
    </>
  )
}

function MapSvgRender(): ReactNode {
  return (
    <svg viewBox="0 0 1 1" style={{ display: 'none' }}>
      <defs>
        <RenderMap />
      </defs>
    </svg>
  )
}

function MapSvgSvg(): ReactNode {
  // eslint-disable-next-line functional/no-expression-statements
  useMapSvgRendered()

  const { scroll } = useLayout()

  // viewBox will be updated by syncViewBox()
  return (
    <>
      <svg
        id={MAP_SVG_CONTENT_ID}
        viewBox="0 0 1 1"
        width={scroll.width}
        height={scroll.height}
      >
        <use href="#map1" />
      </svg>
      <MapSvgStyle />
    </>
  )
}
