/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'
import { svgMapViewerConfig } from './lib'
import { boxToViewBox2 } from './lib/box/prefixed'
import { RenderMapLayers } from './lib/carto'
import { useShadorRoot } from './lib/dom'
import {
  MAP_SVG_LAYERS_CONTENT_ID,
  MAP_SVG_LAYERS_ROOT_ID,
} from './lib/map-svg-react'
import { useLayout } from './lib/style-xstate'
import { trunc2 } from './lib/utils'

export function MapSvgLayers(): ReactNode {
  useShadorRoot(MAP_SVG_LAYERS_ROOT_ID, <MapSvgLayersContent />)

  return <div id={MAP_SVG_LAYERS_ROOT_ID} className="content svg" />
}

export function MapSvgLayersContent(): ReactNode {
  return (
    <>
      <MapSvgLayersSvg />
      <MapSvgLayersDefs />
      <style>{style}</style>
    </>
  )
}

const style = `
#map-svg-svg,
#map1 {
  contain: content;
  pointer-events: none;
}
#map-svg-defs {
  display: none;
}
`

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
