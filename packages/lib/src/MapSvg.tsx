/* eslint-disable functional/functional-parameters */
import { type ReactNode, useEffect } from 'react'
import { svgMapViewerConfig } from './lib'
import { boxMap, boxToViewBox } from './lib/box/prefixed'
import { renderShadowRoot } from './lib/dom'
import {
  MAP_SVG_CONTENT_ID,
  MAP_SVG_ROOT_ID,
  useMapSvgRendered,
} from './lib/map-svg-react'
import { useLayout } from './lib/style-xstate'
import { trunc2 } from './lib/utils'
import { RenderMap } from './Map'
import './MapSvg.css'

export function MapSvgRoot(): ReactNode {
  // eslint-disable-next-line functional/no-expression-statements, functional/no-return-void
  useEffect(() => renderShadowRoot(MAP_SVG_ROOT_ID, <MapSvg />), [])

  return <div id={MAP_SVG_ROOT_ID} className="content svg" />
}

export function MapSvg(): ReactNode {
  return (
    <>
      <MapSvgSvg />
      <MapSvgDefs />
    </>
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

function MapSvgDefs(): ReactNode {
  return (
    <svg viewBox="0 0 1 1" style={{ display: 'none' }}>
      <defs>
        <RenderMap />
      </defs>
      <style>
        {`
.map-layers,
.map-objects,
.map-symbols,
path {
  contain: content;
}
`}
      </style>
    </svg>
  )
}
