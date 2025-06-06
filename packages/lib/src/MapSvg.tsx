/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'
import { svgMapViewerConfig } from './lib'
import { RenderMapCommon, RenderMapSymbols } from './lib/carto'
import { RenderMapAssetsDefault } from './lib/carto/assets'
import {
  MAP_SVG_CONTENT_ID,
  MAP_SVG_SYMBOLS_CONTENT_ID,
  useMapSvgRendered,
  useMapSvgSymbolsRendered,
} from './lib/map-svg-react'
import { useLayout } from './lib/style-xstate'
import { MapSvgStyle, MapSvgSymbolsStyle } from './MapSvgStyle'

function MapSvgRender(): ReactNode {
  return (
    <svg viewBox="0 0 1 1" style={{ display: 'none' }}>
      <defs>
        <RenderMapCommon />
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

export function MapSvg(): ReactNode {
  return (
    <>
      <MapSvgRender />
      <MapSvgSvg />
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
