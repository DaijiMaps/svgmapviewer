/* eslint-disable functional/functional-parameters */
import { type ReactNode, useEffect } from 'react'
import { boxToViewBox2 } from './lib/box/prefixed'
import { renderShadowRoot } from './lib/dom'
import { MAP_SVG_CONTENT_ID, MAP_SVG_ROOT_ID } from './lib/map-svg-react'
import { useLayout } from './lib/style-xstate'
import { trunc2 } from './lib/utils'
import { RenderMap } from './Map'
import './MapSvg.css'

export function MapSvgRoot(): ReactNode {
  // eslint-disable-next-line functional/no-expression-statements, functional/no-return-void
  useEffect(() => renderShadowRoot(MAP_SVG_ROOT_ID, <MapSvg />), [])

  return <div id={MAP_SVG_ROOT_ID} className="content svg" />
}

export function MapSvg(): ReactNode {
  return (
    <>
      <MapSvgSvg />
      <MapSvgDefs />
      <style>{`
#map-svg-svg,
#map1 {
  contain: content;
}
#map-svg-defs {
  display: none;
}
`}</style>
    </>
  )
}

function MapSvgSvg(): ReactNode {
  const { scroll, svg } = useLayout()

  // viewBox will be updated by syncViewBox()
  return (
    <svg
      id={MAP_SVG_CONTENT_ID}
      viewBox={boxToViewBox2(svg)}
      width={trunc2(scroll.width)}
      height={trunc2(scroll.height)}
    >
      <use href="#map1" />
    </svg>
  )
}

function MapSvgDefs(): ReactNode {
  return (
    <svg id="map-svg-defs" viewBox="0 0 1 1">
      <defs>
        <RenderMap />
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
