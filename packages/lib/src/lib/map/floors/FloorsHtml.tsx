/* eslint-disable functional/no-expression-statements */

import { Fragment, useRef, type ReactNode } from 'react'

import {
  type Floor,
  type LabelsMap,
  type OsmRenderMapProps,
} from '../../../types'
import { useFloorRef } from '../../viewer/floors/style'
import { useLayoutStyleRef } from '../../viewer/layout/style'
import { RenderFloorLabels } from './FloorsHtmlLabels'

export function RenderFloorsHtml({
  floors,
}: Readonly<OsmRenderMapProps>): ReactNode {
  const ref = useRef(null)
  useLayoutStyleRef(ref, 'map-floors-html')
  return (
    <div className="content">
      <div ref={ref} className="map-floors-html">
        {floors?.floors.map((floor, fidx) => (
          <Fragment key={fidx}>
            <RenderFloorHtml
              fidx={fidx}
              floor={floor}
              labelsMap={floors?.labelsMap}
            />
          </Fragment>
        ))}
      </div>
      <style>{htmlStyle}</style>
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
`

function RenderFloorHtml({
  fidx,
  floor,
  labelsMap,
}: Readonly<{
  fidx: number
  floor: Floor
  labelsMap: LabelsMap | undefined
}>): ReactNode {
  const ref = useRef(null)
  useFloorRef(ref, `html-${fidx}`)
  return (
    <div ref={ref} className={`floor fidx-${fidx}`}>
      <RenderFloorLabels
        fidx={fidx}
        labels={floor.labels ?? labelsMap?.get(floor.name.toLowerCase())}
      />
    </div>
  )
}
