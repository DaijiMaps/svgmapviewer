/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'
import { svgMapViewerConfig } from '..'
import { SvgSymbolStyle } from '../../Style'
import { boxToViewBox2 } from '../box/prefixed'
import { RenderMapSymbols } from '../carto'
import { RenderMapAssetsDefault } from '../carto/assets'
import { useShadowRoot } from '../dom'
import { useLayout } from '../style-xstate'
import { trunc2 } from '../utils'
import {
  MAP_SVG_SYMBOLS_CONTENT_ID,
  MAP_SVG_SYMBOLS_ROOT_ID,
} from './map-svg-react'

export function MapSvgSymbols(): ReactNode {
  useShadowRoot(MAP_SVG_SYMBOLS_ROOT_ID, <MapSvgSymbolsContent />)

  return <div id={MAP_SVG_SYMBOLS_ROOT_ID} className="content svg" />
}

export function MapSvgSymbolsContent(): ReactNode {
  return (
    <>
      <MapSvgSymbolsSvg />
      <MapSvgSymbolsDefs />
      <style>{style}</style>
    </>
  )
}

const style = `
#map-svg-symbols-svg,
#map-svg-symbols1 {
  contain: content;
  pointer-events: none;
}
#map-svg-symbols-defs {
  display: none;
}
`

function MapSvgSymbolsSvg(): ReactNode {
  const { scroll, svg } = useLayout()

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
        <style>
          <SvgSymbolStyle />
        </style>
      </g>
    </svg>
  )
}
