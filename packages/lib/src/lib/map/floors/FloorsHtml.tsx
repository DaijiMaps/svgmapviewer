/* eslint-disable functional/no-expression-statements */

import { Fragment, useRef, type ReactNode } from 'react'

import {
  type Floor,
  type FloorsConfig,
  type OsmRenderMapProps,
} from '../../../types'
import { RenderMapMarkers2 } from '../../carto/markers'
import { useShadowRoot } from '../../dom'
import { useFloorRef } from '../../viewer/floors/style'
import { useLayoutStyleRef } from '../../viewer/layout/style'
import { MapSvgMarkersDefs } from '../MapHtml'
import { RenderFloorLabels } from './FloorsHtmlLabels'
import { getLabels } from './labels'

export function RenderFloorsHtml(
  props: Readonly<OsmRenderMapProps>
): ReactNode {
  const ref = useRef(null)
  useLayoutStyleRef(ref, 'map-floors-html-content')
  useShadowRoot('map-floors-html', <RenderFloorsHtmlRoot {...props} />)
  return <div ref={ref} id="map-floors-html" className="content" />
}

function RenderFloorsHtmlRoot(props: Readonly<OsmRenderMapProps>): ReactNode {
  return (
    <div className="map-floors-html-content">
      <RenderFloorsHtmlContent {...props} />
      <style>{htmlStyle}</style>
    </div>
  )
}

function RenderFloorsHtmlContent(
  props: Readonly<OsmRenderMapProps>
): ReactNode {
  const ref = useRef(null)
  useLayoutStyleRef(ref, 'map-floors-html')
  return (
    <div ref={ref} className="map-floors-html">
      {props.floors?.floors.map((floor, fidx) => (
        <Fragment key={fidx}>
          <RenderFloorHtml
            fidx={fidx}
            floor={floor}
            labelsMap={props.floors?.labelsMap}
          />
        </Fragment>
      ))}
      <MapSvgMarkersDefs />
      {props.data.mapCoord.matrix && (
        <RenderMapMarkers2
          {...props}
          m={props.data.mapCoord.matrix}
          mapMarkers={props.render.getMapMarkers()}
          fontSize={16}
        />
      )}
    </div>
  )
}

const htmlStyle = `
.map-floors-html {
  position: absolute;
  left: 0;
  top: 0;
  width: var(--layout-scroll-width);
  height: var(--layout-scroll-height);
  transform: var(--layout-svg-to-content-matrix) !important;
  transform-origin: 0% 0% !important;
}
.label {
  --poi-scale: 0.05;
}
.map-symbol {
  --poi-scale: 0.02;
}
.map-symbol,
.label {
  color: black;
  font-weight: bold;
  position: absolute;
  left: 0;
  top: 0;
  transform-origin: 0% 0%;
  transform:
    translate(var(--poi-x), var(--poi-y))
    scale(
      calc(
        var(--layout-fontsize) *
        var(--layout-svgscale) *
        var(--poi-scale))
      )
    translate(-50%, -50%);
}
`

function RenderFloorHtml({
  fidx,
  floor,
  labelsMap,
}: Readonly<{
  fidx: number
  floor: Floor
  labelsMap?: FloorsConfig['labelsMap']
}>): ReactNode {
  const ref = useRef(null)
  useFloorRef(ref, `html-${fidx}`)
  return (
    <div ref={ref} className={`floor fidx-${fidx}`}>
      <RenderFloorLabels
        fidx={fidx}
        labels={floor.labels ?? getLabels(labelsMap, floor.name.toLowerCase())}
      />
    </div>
  )
}
