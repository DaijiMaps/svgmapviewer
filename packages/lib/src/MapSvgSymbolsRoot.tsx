/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */
import { type ReactNode, useEffect } from 'react'
import { renderShadowRoot } from './lib/dom'
import { MAP_SVG_SYMBOLS_ROOT_ID } from './lib/map-svg-react'
import { MapSvgSymbols } from './MapSvgSymbols'
import './MapSvgSymbolsRoot.css'

export function MapSvgSymbolsRoot(): ReactNode {
  useEffect(
    () => renderShadowRoot(MAP_SVG_SYMBOLS_ROOT_ID, <MapSvgSymbols />),
    []
  )

  return <div id={MAP_SVG_SYMBOLS_ROOT_ID} className="content svg" />
}
