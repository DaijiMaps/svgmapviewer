/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'
import { svgMapViewerConfig } from './lib'
import { RenderMapCommon, RenderMapSymbols } from './lib/carto'
import { RenderMapAssetsDefault } from './lib/carto/assets'
import {
  useMapSvgRendered,
  useMapSvgSymbolsRendered,
} from './lib/map-svg-react'
import { useLayout } from './lib/style-xstate'
import { MapSvgStyle, MapSvgSymbolsStyle } from './MapSvgStyle'

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

export function MapSvgSymbols(): ReactNode {
  // eslint-disable-next-line functional/no-expression-statements
  useMapSvgSymbolsRendered()

  const { scroll } = useLayout()

  // viewBox will be updated by syncViewBox()
  return (
    <>
      <svg
        id="map-svg-svg-symbols"
        viewBox="0 0 1 1"
        width={scroll.width}
        height={scroll.height}
      >
        <RenderMapAssetsDefault />
        <RenderMapSymbols mapSymbols={svgMapViewerConfig.getMapSymbols()} />
      </svg>
      <MapSvgSymbolsStyle />
    </>
  )
}
