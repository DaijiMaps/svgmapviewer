/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'
import { type OsmRenderMapProps } from '../../types'
import { boxToViewBox2 } from '../box/prefixed'
import { RenderMapPaths } from '../carto'
import { useShadowRoot } from '../dom'
import { useLayout } from '../style/style-react'
import { trunc2 } from '../utils'
import {
  MAP_SVG_PATHS_CONTENT_ID,
  MAP_SVG_PATHS_ROOT_ID,
} from './map-svg-react'

export function MapSvgPaths(props: Readonly<OsmRenderMapProps>): ReactNode {
  useShadowRoot(MAP_SVG_PATHS_ROOT_ID, <MapSvgPathsRoot {...props} />)

  return <div id={MAP_SVG_PATHS_ROOT_ID} className="content svg" />
}

export function MapSvgPathsRoot(props: Readonly<OsmRenderMapProps>): ReactNode {
  return (
    <>
      <MapSvgPathsSvg />
      <MapSvgPathsDefs {...props} />
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

function MapSvgPathsSvg(): ReactNode {
  const { scroll, svg } = useLayout()

  return (
    <svg
      id={MAP_SVG_PATHS_CONTENT_ID}
      viewBox={boxToViewBox2(svg)}
      width={trunc2(scroll.width)}
      height={trunc2(scroll.height)}
    >
      <use href="#map1" />
    </svg>
  )
}

function MapSvgPathsDefs(props: Readonly<OsmRenderMapProps>): ReactNode {
  return (
    <svg id="map-svg-defs" viewBox="0 0 1 1">
      <defs>
        <g id="map1" className="map">
          <RenderMapPaths
            {...props}
            m={props.data.mapCoord.matrix}
            mapPaths={props.render.getMapPaths()}
          />
          <style>{props.render.mapSvgStyle}</style>
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
