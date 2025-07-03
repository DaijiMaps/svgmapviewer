/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */
import { Fragment, type ReactNode } from 'react'
import { svgMapViewerConfig } from './lib'
import { boxToViewBox2 } from './lib/box/prefixed'
import { RenderMapMarkers } from './lib/carto'
import { useShadowRoot } from './lib/dom'
import {
  MAP_SVG_MARKERS_CONTENT_ID,
  MAP_SVG_MARKERS_ROOT_ID,
} from './lib/map-svg-react'
import { useNames } from './lib/names'
import { useLayout } from './lib/style-xstate'
import { trunc2 } from './lib/utils'
import type { VecVec } from './lib/vec/prefixed'
import { SvgSymbolStyle } from './Style'

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
  return (
    <svg id="map-svg-markers-defs">
      <RenderMapMarkers mapMarkers={svgMapViewerConfig.getMapMarkers()} />
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
