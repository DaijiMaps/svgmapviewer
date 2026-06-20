/* eslint-disable functional/no-expression-statements */

import { Fragment, useRef, type ReactNode } from 'react'

import {
  type Floor,
  type FloorsConfig,
  type LabelsMap,
  type LabelsTexts,
  type OsmRenderMapProps,
} from '../../../types'
import { useFloorRef } from '../../viewer/floors/style'
import { useLayoutStyleRef } from '../../viewer/layout/style'
import { RenderFloorLabels } from './FloorsHtmlLabels'

export function RenderFloorsHtml(
  props: Readonly<OsmRenderMapProps>
): ReactNode {
  const ref = useRef(null)
  useLayoutStyleRef(ref, 'map-floors-html-content')
  return (
    <div ref={ref} className="content map-floors-html-content">
      <RenderFloorsHtmlContent {...props} />
      <style>{htmlStyle}</style>
    </div>
  )
}

function RenderFloorsHtmlContent({
  floors,
}: Readonly<OsmRenderMapProps>): ReactNode {
  const ref = useRef(null)
  useLayoutStyleRef(ref, 'map-floors-html')
  return (
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
  labelsMap?: FloorsConfig['labelsMap']
}>): ReactNode {
  const ref = useRef(null)
  useFloorRef(ref, `html-${fidx}`)
  return (
    <div ref={ref} className={`floor fidx-${fidx}`}>
      <RenderFloorLabels
        fidx={fidx}
        labels={
          floor.labels ?? getLabelsMap(labelsMap, floor.name.toLowerCase())
        }
      />
    </div>
  )
}

const labelsMapCache = new Set<LabelsMap>()

function getLabelsMap(
  labelsMap: Readonly<FloorsConfig['labelsMap']> | undefined,
  k: string
): LabelsTexts | undefined {
  if (labelsMap === undefined) return undefined
  const vs = Array.from(labelsMapCache.values())
  if (vs.length === 1) return vs[0].get(k)
  const m =
    labelsMap instanceof Map
      ? labelsMap
      : new Map(
          labelsMap instanceof Array ? labelsMap : Object.entries(labelsMap)
        )
  // eslint-disable-next-line functional/immutable-data
  labelsMapCache.add(m)
  return m.get(k)
}
