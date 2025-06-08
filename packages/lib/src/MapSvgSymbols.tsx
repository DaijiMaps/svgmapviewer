/* eslint-disable functional/functional-parameters */
import { type ReactNode, useEffect } from 'react'
import { svgMapViewerConfig } from './lib'
import { boxMap, boxToViewBox } from './lib/box/prefixed'
import { RenderMapSymbols } from './lib/carto'
import { RenderMapAssetsDefault } from './lib/carto/assets'
import { renderShadowRoot } from './lib/dom'
import {
  MAP_SVG_SYMBOLS_CONTENT_ID,
  MAP_SVG_SYMBOLS_ROOT_ID,
} from './lib/map-svg-react'
import { useLayout } from './lib/style-xstate'
import { trunc2 } from './lib/utils'
import { MapSvgSymbolsStyle } from './MapSvgStyle'
import './MapSvgSymbols.css'

export function MapSvgSymbolsRoot(): ReactNode {
  // eslint-disable-next-line functional/no-expression-statements
  useEffect(
    // eslint-disable-next-line functional/no-return-void
    () => renderShadowRoot(MAP_SVG_SYMBOLS_ROOT_ID, <MapSvgSymbols />),
    []
  )

  return <div id={MAP_SVG_SYMBOLS_ROOT_ID} className="content svg" />
}

export function MapSvgSymbols(): ReactNode {
  return (
    <>
      <MapSvgSymbolsSvg />
      <MapSvgSymbolsDefs />
    </>
  )
}

function MapSvgSymbolsSvg(): ReactNode {
  const { scroll } = useLayout()
  const { x, y, width, height } = boxMap(svgMapViewerConfig.origViewBox, trunc2)

  // viewBox will be updated by syncViewBox()
  return (
    <svg
      id={MAP_SVG_SYMBOLS_CONTENT_ID}
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
        <use href="#map-svg-symbols1" />
      </svg>
    </svg>
  )
}

function MapSvgSymbolsDefs(): ReactNode {
  return (
    <svg>
      <g id="map-svg-symbols1">
        <defs>
          <RenderMapAssetsDefault />
        </defs>
        <RenderMapSymbols mapSymbols={svgMapViewerConfig.getMapSymbols()} />
        <MapSvgSymbolsStyle />
      </g>
    </svg>
  )
}
