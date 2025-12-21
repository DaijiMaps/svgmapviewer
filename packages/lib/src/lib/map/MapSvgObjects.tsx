/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'
import { type OsmRenderMapProps } from '../../types'
import { boxToViewBox2 } from '../box/prefixed'
import { RenderMapObjects } from '../carto'
import { useShadowRoot } from '../dom'
import { useLayout } from '../style/style-react'
import { trunc2 } from '../utils'
import {
  MAP_SVG_OBJECTS_CONTENT_ID,
  MAP_SVG_OBJECTS_ROOT_ID,
} from './map-svg-react'

export function MapSvgObjects(props: Readonly<OsmRenderMapProps>): ReactNode {
  useShadowRoot(MAP_SVG_OBJECTS_ROOT_ID, <MapSvgObjectsRoot {...props} />)

  return <div id={MAP_SVG_OBJECTS_ROOT_ID} className="content svg" />
}

export function MapSvgObjectsRoot(
  props: Readonly<OsmRenderMapProps>
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

function MapSvgObjectsDefs(props: Readonly<OsmRenderMapProps>): ReactNode {
  return (
    <svg id="map-svg-objects-defs" viewBox="0 0 1 1">
      <defs>
        <g id="map-svg-objects1">
          <RenderMapObjects
            {...props}
            m={props.data.mapCoord.matrix}
            mapObjects={props.render.getMapObjects()}
          />
        </g>
      </defs>
      <style>
        {`
.map-paths,
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
