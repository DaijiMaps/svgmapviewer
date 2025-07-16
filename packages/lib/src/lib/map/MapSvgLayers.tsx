/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'
import { svgMapViewerConfig } from '../../config'
import { useLayout } from '../../style-xstate'
import { boxToViewBox2 } from '../box/prefixed'
import { RenderMapLayers } from '../carto'
import { useShadowRoot } from '../dom'
import { trunc2 } from '../utils'
import {
  MAP_SVG_LAYERS_CONTENT_ID,
  MAP_SVG_LAYERS_ROOT_ID,
} from './map-svg-react'

export function MapSvgLayers(): ReactNode {
  useShadowRoot(MAP_SVG_LAYERS_ROOT_ID, <MapSvgLayersContent />)

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
          <RenderMapLayers
            m={svgMapViewerConfig.mapCoord.matrix}
            mapLayers={cfg.getMapLayers()}
          />
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
