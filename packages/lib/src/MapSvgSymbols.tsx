/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'
import { svgMapViewerConfig } from './lib'
import { RenderMapSymbols } from './lib/carto'
import { RenderMapAssetsDefault } from './lib/carto/assets'
import {
  MAP_SVG_SYMBOLS_CONTENT_ID,
  useMapSvgSymbolsRendered,
} from './lib/map-svg-react'
import { useLayout } from './lib/style-xstate'
import { MapSvgSymbolsStyle } from './MapSvgStyle'

export function MapSvgSymbols(): ReactNode {
  // eslint-disable-next-line functional/no-expression-statements
  useMapSvgSymbolsRendered()

  const { scroll } = useLayout()

  // viewBox will be updated by syncViewBox()
  return (
    <>
      <svg
        id={MAP_SVG_SYMBOLS_CONTENT_ID}
        viewBox="0 0 1 1"
        width={scroll.width}
        height={scroll.height}
      >
        <defs>
          <RenderMapAssetsDefault />
        </defs>
        <RenderMapSymbols mapSymbols={svgMapViewerConfig.getMapSymbols()} />
      </svg>
      <MapSvgSymbolsStyle />
    </>
  )
}
