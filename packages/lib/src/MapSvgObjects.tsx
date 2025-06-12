/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */
import { type ReactNode, useEffect } from 'react'
import { svgMapViewerConfig } from './lib'
import { boxToViewBox2 } from './lib/box/prefixed'
import { RenderMapObjects } from './lib/carto'
import { renderShadowRoot } from './lib/dom'
import {
  MAP_SVG_OBJECTS_CONTENT_ID,
  MAP_SVG_OBJECTS_ROOT_ID,
} from './lib/map-svg-react'
import { useLayout } from './lib/style-xstate'
import { trunc2 } from './lib/utils'

export function MapSvgObjectsRoot(): ReactNode {
  useEffect(
    () => renderShadowRoot(MAP_SVG_OBJECTS_ROOT_ID, <MapSvgObjects />),
    []
  )

  return <div id={MAP_SVG_OBJECTS_ROOT_ID} className="content svg" />
}

export function MapSvgObjects(): ReactNode {
  return (
    <>
      <MapSvgObjectsSvg />
      <MapSvgObjectsDefs />
      <style>{`
#map-svg-svg,
#map1 {
  contain: content;
}
#map-svg-defs {
  display: none;
}
${style}
`}</style>
    </>
  )
}

function MapSvgObjectsSvg(): ReactNode {
  const { scroll, svg } = useLayout()

  // viewBox will be updated by syncViewBox()
  return (
    <svg
      id={MAP_SVG_OBJECTS_CONTENT_ID}
      viewBox={boxToViewBox2(svg)}
      width={trunc2(scroll.width)}
      height={trunc2(scroll.height)}
    >
      <use href="#map-svg-objects1" />
    </svg>
  )
}

function MapSvgObjectsDefs(): ReactNode {
  const cfg = svgMapViewerConfig
  return (
    <svg id="map-svg-objects-defs" viewBox="0 0 1 1">
      <defs>
        <g id="map-svg-objects1">
          <RenderMapObjects mapObjects={cfg.getMapObjects()} />
        </g>
      </defs>
      <style>
        {`
.map-layers,
.map-objects,
.map-symbols,
path {
  contain: content;
}
`}
      </style>
    </svg>
  )
}

const style = `
.content.svg {
  /*
  transform: translate3d(0px, 0px, 0px);
  */
}

.map,
.map > * {
  contain: content;
}
`
