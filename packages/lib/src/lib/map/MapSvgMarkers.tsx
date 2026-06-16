/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */
import {
  Fragment,
  useMemo,
  useRef,
  type PropsWithChildren,
  type ReactNode,
} from 'react'

import { type OsmRenderMapProps } from '../../types'
import { boxToViewBox2 } from '../box/prefixed'
import { RenderMapMarkers } from '../carto'
import { RenderMarkerUses } from '../carto/markers'
import { entryToVs } from '../carto/point'
import { useShadowRoot } from '../dom'
import { useLayoutConfig, useLayoutSvg } from '../style/style-react'
import { trunc2 } from '../utils'
import { type VecVec } from '../vec/prefixed'
import { useLayoutStyleRef } from '../viewer/layout/style'
import {
  MAP_SVG_MARKERS_CONTENT_ID,
  MAP_SVG_MARKERS_ROOT_ID,
} from './map-svg-react'
import { useNames } from './names'

export function MapSvgMarkers(props: Readonly<OsmRenderMapProps>): ReactNode {
  const ref = useRef(null)
  useLayoutStyleRef(ref, 'map-svg-markers-root')
  useShadowRoot(MAP_SVG_MARKERS_ROOT_ID, <MapSvgMarkersRoot {...props} />)

  return <div ref={ref} id={MAP_SVG_MARKERS_ROOT_ID} className="content svg" />
}

export function MapSvgMarkersRoot(
  props: Readonly<OsmRenderMapProps>
): ReactNode {
  return (
    <>
      <MapSvgMarkersSvg />
      <MapSvgMarkersDefs {...props}>
        <g id="map-svg-markers1">
          <MapSvgMarkersUses />
          <use href="#position" />
        </g>
      </MapSvgMarkersDefs>
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
  const svg = useLayoutSvg()

  return (
    <svg
      id={MAP_SVG_MARKERS_CONTENT_ID}
      className="content-svg"
      viewBox={boxToViewBox2(svg)}
    >
      <use href="#map-svg-markers1" />
      <style>{style1}</style>
    </svg>
  )
}

const style1 = `
#${MAP_SVG_MARKERS_CONTENT_ID} {
  width: var(--layout-scroll-width);
  height: var(--layout-scroll-height);
}`

function MapSvgMarkersDefs(
  props: Readonly<PropsWithChildren<OsmRenderMapProps>>
): ReactNode {
  const ref = useRef(null)
  const { fontSize } = useLayoutConfig()
  const sz = useMemo(() => 25 / fontSize, [fontSize])

  useLayoutStyleRef(ref, 'map-svg-markers')

  return (
    <svg ref={ref} id="map-svg-markers-defs">
      <RenderMapMarkers
        {...props}
        m={props.data.mapCoord.matrix}
        mapMarkers={props.render.getMapMarkers()}
        fontSize={fontSize}
      >
        {props.render.getMapMarkers().map((entry, i) => (
          <g key={i}>
            <RenderMarkerUses
              m={props.data.mapCoord.matrix}
              sz={sz}
              name={entry.name}
              href={entry.name} // XXX XXX XXX
              vs={entryToVs(props.data.mapData, entry)}
            />
          </g>
        ))}
      </RenderMapMarkers>
      {props.children}
    </svg>
  )
}

function MapSvgMarkersUses(): ReactNode {
  const { pointNames } = useNames()

  return (
    <g>
      {pointNames
        .map((p) => ({ ...p }))
        .map(({ coord }, idx) => (
          <Fragment key={idx}>
            <MapSvgMarkersUse coord={coord} />
          </Fragment>
        ))}
    </g>
  )
}

function MapSvgMarkersUse(
  props: Readonly<{
    coord: VecVec
  }>
): ReactNode {
  const {
    coord: { x, y },
  } = props

  return (
    <use
      href="#point-name-marker"
      style={{
        transform: `translate(${trunc2(x)}px, ${trunc2(y)}px)`,
      }}
    />
  )
}
