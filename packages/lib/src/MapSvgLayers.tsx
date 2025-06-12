/* eslint-disable functional/functional-parameters */
import { type ReactNode, useEffect } from 'react'
import { svgMapViewerConfig } from './lib'
import { boxToViewBox2 } from './lib/box/prefixed'
import { RenderMapLayers } from './lib/carto'
import { renderShadowRoot } from './lib/dom'
import {
  MAP_SVG_LAYERS_CONTENT_ID,
  MAP_SVG_LAYERS_ROOT_ID,
} from './lib/map-svg-react'
import { useLayout } from './lib/style-xstate'
import { trunc2 } from './lib/utils'

export function MapSvgLayersRoot(): ReactNode {
  // eslint-disable-next-line functional/no-expression-statements, functional/no-return-void
  useEffect(
    () => renderShadowRoot(MAP_SVG_LAYERS_ROOT_ID, <MapSvgLayers />),
    []
  )

  return <div id={MAP_SVG_LAYERS_ROOT_ID} className="content svg" />
}

export function MapSvgLayers(): ReactNode {
  return (
    <>
      <MapSvgLayersSvg />
      <MapSvgLayersDefs />
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

function MapSvgLayersSvg(): ReactNode {
  const { scroll, svg } = useLayout()

  // viewBox will be updated by syncViewBox()
  return (
    <svg
      id={MAP_SVG_LAYERS_CONTENT_ID}
      viewBox={boxToViewBox2(svg)}
      width={trunc2(scroll.width)}
      height={trunc2(scroll.height)}
    >
      <use href="#map1" />
    </svg>
  )
}

function MapSvgLayersDefs(): ReactNode {
  const cfg = svgMapViewerConfig

  return (
    <svg id="map-svg-defs" viewBox="0 0 1 1">
      <defs>
        <g id={cfg.map} className="map">
          <RenderMapLayers mapLayers={cfg.getMapLayers()} />
          <style>{cfg.mapSvgStyle}</style>
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
