import { type ReactNode } from 'react'

import { type OsmRenderMapProps } from '../../types'
import { type V } from '../tuple'
import { entryToVs } from './point'
import { type OsmMapObjects } from './types'

export function RenderMapObjects(
  props: Readonly<
    OsmRenderMapProps & {
      m: DOMMatrixReadOnly
      mapObjects: readonly OsmMapObjects[]
    }
  >
): ReactNode {
  return (
    <g className="map-objects">
      {props.mapObjects.map((entry, i) => (
        <g key={i}>
          <RenderObjects
            m={props.m}
            name={entry.name}
            path={entry.path}
            width={entry.width}
            vs={entryToVs(props.data.mapData, entry)}
          />
        </g>
      ))}
    </g>
  )
}

export function RenderObjects(
  props: Readonly<{
    m: DOMMatrixReadOnly
    name: string
    width: number
    path: string
    vs: V[]
  }>
): ReactNode {
  return (
    <path
      className={props.name}
      fill="none"
      stroke="black"
      strokeWidth={props.width}
      d={props.vs
        .map(([x, y]) => props.m.transformPoint({ x, y }))
        .map(
          ({ x, y }) =>
            `M ${x},${y}`.replaceAll(/([.]\d\d)\d*/g, '$1') + props.path
        )
        .join('')}
    />
  )
}
