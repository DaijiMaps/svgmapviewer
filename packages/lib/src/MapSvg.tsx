/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'
import { svgMapViewerConfig } from './lib'
import { boxMap, boxToViewBox } from './lib/box/prefixed'
import { MAP_SVG_CONTENT_ID, useMapSvgRendered } from './lib/map-svg-react'
import { useLayout } from './lib/style-xstate'
import { trunc2 } from './lib/utils'
import { RenderMap } from './Map'

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
  const { x, y, width, height } = boxMap(svgMapViewerConfig.origViewBox, trunc2)

  // viewBox will be updated by syncViewBox()
  return (
    <svg
      id={MAP_SVG_CONTENT_ID}
      viewBox="0 0 1 1"
      width={trunc2(scroll.width)}
      height={trunc2(scroll.height)}
    >
      <svg
        viewBox={boxToViewBox({ x, y, width, height })}
        x={x}
        y={y}
        width={width}
        height={height}
      >
        <use href="#map1" />
      </svg>
    </svg>
  )
}
