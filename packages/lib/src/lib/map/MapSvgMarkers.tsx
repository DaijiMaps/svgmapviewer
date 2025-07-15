/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */
import { Fragment, type ReactNode } from 'react'
import { svgMapViewerConfig } from '..'
import { SvgSymbolStyle } from '../../Style'
import { boxToViewBox2 } from '../box/prefixed'
import { RenderMapMarkers } from '../carto'
import { useShadowRoot } from '../dom'
import { useNames } from '../names'
import { useLayout } from '../style-xstate'
import { trunc2 } from '../utils'
import type { VecVec } from '../vec/prefixed'
import {
  MAP_SVG_MARKERS_CONTENT_ID,
  MAP_SVG_MARKERS_ROOT_ID,
} from './map-svg-react'
import { useLayoutConfig, useLayoutSvgScaleS } from './map-xstate'

export function MapSvgMarkers(): ReactNode {
  useShadowRoot(MAP_SVG_MARKERS_ROOT_ID, <MapSvgMarkersContent />)

  return <div id={MAP_SVG_MARKERS_ROOT_ID} className="content svg" />
}

export function MapSvgMarkersContent(): ReactNode {
  return (
    <>
      <MapSvgMarkersSvg />
      <MapSvgMarkersDefs />
      <style>{style}</style>
    </>
  )
}

const style = `
#map-svg-markers-svg,
#map-svg-markers1 {
  contain: content;
  pointer-events: none;
}
#map-svg-markers-defs {
  display: none;
}
`

function MapSvgMarkersSvg(): ReactNode {
  const { scroll, svg } = useLayout()

  return (
    <svg
      id={MAP_SVG_MARKERS_CONTENT_ID}
      viewBox={boxToViewBox2(svg)}
      width={trunc2(scroll.width)}
      height={trunc2(scroll.height)}
    >
      <use href="#map-svg-markers1" />
    </svg>
  )
}

function MapSvgMarkersDefs(): ReactNode {
  const { fontSize } = useLayoutConfig()
  const s = useLayoutSvgScaleS()

  return (
    <svg id="map-svg-markers-defs">
      <RenderMapMarkers
        mapMarkers={svgMapViewerConfig.getMapMarkers()}
        fontSize={fontSize}
        s={s}
      />
      <g id="map-svg-markers1">
        <MapSvgMarkersUses />
        <style>
          <SvgSymbolStyle />
        </style>
        <use href="#position" />
      </g>
    </svg>
  )
}

function MapSvgMarkersUses(): ReactNode {
  const { pointNames } = useNames()

  return (
    <g>
      {pointNames.map(({ pos }, idx) => (
        <Fragment key={idx}>
          <MapSvgMarkersUse pos={pos} />
        </Fragment>
      ))}
    </g>
  )
}

function MapSvgMarkersUse(
  props: Readonly<{
    pos: VecVec
  }>
): ReactNode {
  const { pos } = props

  return (
    <use
      href="#point-name-marker"
      style={{
        transform: `translate(${trunc2(pos.x)}px, ${trunc2(pos.y)}px)`,
      }}
    />
  )
}
