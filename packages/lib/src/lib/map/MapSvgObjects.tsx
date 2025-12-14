/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'
import { useLayout } from '../../style-xstate'
import { boxToViewBox2 } from '../box/prefixed'
import { RenderMapObjects } from '../carto'
import { useShadowRoot } from '../dom'
import { trunc2 } from '../utils'
import {
  MAP_SVG_OBJECTS_CONTENT_ID,
  MAP_SVG_OBJECTS_ROOT_ID,
} from './map-svg-react'
import type { DataConfig, RenderConfig } from '../../types'

export function MapSvgObjects(
  props: Readonly<{ data: DataConfig; render: RenderConfig }>
): ReactNode {
  useShadowRoot(MAP_SVG_OBJECTS_ROOT_ID, <MapSvgObjectsContent {...props} />)

  return <div id={MAP_SVG_OBJECTS_ROOT_ID} className="content svg" />
}

export function MapSvgObjectsContent(
  props: Readonly<{ data: DataConfig; render: RenderConfig }>
): ReactNode {
  return (
    <>
      <MapSvgObjectsSvg />
      <MapSvgObjectsDefs {...props} />
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

function MapSvgObjectsSvg(): ReactNode {
  const { scroll, svg } = useLayout()

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

function MapSvgObjectsDefs(
  props: Readonly<{ data: DataConfig; render: RenderConfig }>
): ReactNode {
  return (
    <svg id="map-svg-objects-defs" viewBox="0 0 1 1">
      <defs>
        <g id="map-svg-objects1">
          <RenderMapObjects
            m={props.data.mapCoord.matrix}
            mapObjects={props.render.getMapObjects()}
          />
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
