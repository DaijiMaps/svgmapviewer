/* eslint-disable functional/functional-parameters */
import { type ReactNode, useEffect } from 'react'
import { svgMapViewerConfig } from './lib'
import { boxToViewBox2 } from './lib/box/prefixed'
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
      <style>
        {`
#map-svg-symbols-svg,
#map-svg-symbols1 {
  contain: content;
  pointer-events: none;
}
#map-svg-symbols-defs {
  display: none;
}
`}
      </style>
    </>
  )
}

function MapSvgSymbolsSvg(): ReactNode {
  const { scroll, svg } = useLayout()

  // viewBox will be updated by syncViewBox()
  return (
    <svg
      id={MAP_SVG_SYMBOLS_CONTENT_ID}
      viewBox={boxToViewBox2(svg)}
      width={trunc2(scroll.width)}
      height={trunc2(scroll.height)}
    >
      <use href="#map-svg-symbols1" />
    </svg>
  )
}

function MapSvgSymbolsDefs(): ReactNode {
  return (
    <svg id="map-svg-symbols-defs">
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
