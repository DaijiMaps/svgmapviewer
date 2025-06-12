/* eslint-disable functional/functional-parameters */
import { type ReactNode, useEffect } from 'react'
import { svgMapViewerConfig } from './lib'
import { boxToViewBox2 } from './lib/box/prefixed'
import { RenderMapMarkers } from './lib/carto'
import { RenderMapAssetsDefault } from './lib/carto/assets'
import { renderShadowRoot } from './lib/dom'
import {
  MAP_SVG_MARKERS_CONTENT_ID,
  MAP_SVG_MARKERS_ROOT_ID,
} from './lib/map-svg-react'
import { useLayout } from './lib/style-xstate'
import { trunc2 } from './lib/utils'
import { MapSvgMarkersStyle } from './MapSvgStyle'

export function MapSvgMarkersRoot(): ReactNode {
  // eslint-disable-next-line functional/no-expression-statements
  useEffect(
    // eslint-disable-next-line functional/no-return-void
    () => renderShadowRoot(MAP_SVG_MARKERS_ROOT_ID, <MapSvgMarkers />),
    []
  )

  return <div id={MAP_SVG_MARKERS_ROOT_ID} className="content svg" />
}

export function MapSvgMarkers(): ReactNode {
  return (
    <>
      <MapSvgMarkersSvg />
      <MapSvgMarkersDefs />
      <style>
        {`
#map-svg-markers-svg,
#map-svg-markers1 {
  contain: content;
  pointer-events: none;
}
#map-svg-markers-defs {
  display: none;
}
`}
      </style>
    </>
  )
}

function MapSvgMarkersSvg(): ReactNode {
  const { scroll, svg } = useLayout()

  // viewBox will be updated by syncViewBox()
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
      <g id="map-svg-markers1">
        <defs>
          <RenderMapAssetsDefault />
        </defs>
        <RenderMapMarkers mapMarkers={svgMapViewerConfig.getMapMarkers()} />
        <MapSvgMarkersStyle />
      </g>
    </svg>
  )
}
