/* eslint-disable functional/no-expression-statements */

import { Fragment, useRef, type ReactNode } from 'react'

import {
  type Floor,
  type LabelsMap,
  type OsmRenderMapProps,
} from '../../../types'
import {
  useFloors,
  type UseFloorsReturn,
} from '../../viewer/floors/floors-react'
import { useFloorRef } from '../../viewer/floors/style'
import { RenderFloorLabels } from './FloorsHtmlLabels'

export function RenderFloorsHtml({
  floors,
  ...rest
}: Readonly<OsmRenderMapProps>): ReactNode {
  const ctx = useFloors()
  return (
    <div className="content">
      <div className="map-floors-html">
        {(floors?.floors ?? []).map((floor, idx) => (
          <Fragment key={idx}>
            <RenderFloorHtml
              floors={floors}
              {...rest}
              ctx={ctx}
              floor={floor}
              idx={idx}
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
  transform-origin: left top !important;
}
`

function RenderFloorHtml({
  data: { origViewBox },
  ctx: { urls },
  floor,
  idx,
  labelsMap,
}: Readonly<
  OsmRenderMapProps & { ctx: UseFloorsReturn } & {
    floor: Floor
    idx: number
    labelsMap: LabelsMap | undefined
  }
>): ReactNode {
  const ref = useRef(null)
  useFloorRef(ref, `html-${idx}`)
  return (
    <div ref={ref} className={`floor fidx-${idx}`}>
      <RenderFloorLabels
        origViewBox={origViewBox}
        idx={idx}
        url={urls.get(idx)}
        labels={floor.labels ?? labelsMap?.get(floor.name.toLowerCase())}
      />
    </div>
  )
}
