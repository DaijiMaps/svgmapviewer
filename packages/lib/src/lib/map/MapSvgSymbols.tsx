/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'
import { SvgSymbolStyle } from '../style/Style'
import { useLayout } from '../style/style-react'
import { boxToViewBox2 } from '../box/prefixed'
import { RenderMapSymbols } from '../carto'
import { RenderMapAssetsDefault } from '../carto/assets'
import { useShadowRoot } from '../dom'
import { trunc2 } from '../utils'
import {
  MAP_SVG_SYMBOLS_CONTENT_ID,
  MAP_SVG_SYMBOLS_ROOT_ID,
} from './map-svg-react'
import { type OsmRenderMapProps } from '../../types'

export function MapSvgSymbols(props: Readonly<OsmRenderMapProps>): ReactNode {
  useShadowRoot(MAP_SVG_SYMBOLS_ROOT_ID, <MapSvgSymbolsContent {...props} />)

  return <div id={MAP_SVG_SYMBOLS_ROOT_ID} className="content svg" />
}

export function MapSvgSymbolsContent(
  props: Readonly<OsmRenderMapProps>
): ReactNode {
  return (
    <>
      <MapSvgSymbolsSvg />
      <MapSvgSymbolsDefs {...props} />
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

function MapSvgSymbolsDefs(props: Readonly<OsmRenderMapProps>): ReactNode {
  return (
    <svg id="map-svg-symbols-defs">
      <g id="map-svg-symbols1">
        <defs>
          <RenderMapAssetsDefault />
        </defs>
        <RenderMapSymbols
          {...props}
          m={props.data.mapCoord.matrix}
          mapSymbols={props.render.getMapSymbols()}
        />
        <style>
          <SvgSymbolStyle />
        </style>
      </g>
    </svg>
  )
}
