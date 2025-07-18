import { type ReactNode } from 'react'
import { type V } from '../tuple'
import { entryToVs } from './point'
import type { MapObjects } from './types'

export function RenderMapObjects(
  props: Readonly<{
    m: DOMMatrixReadOnly
    mapObjects: MapObjects[]
  }>
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
            vs={entryToVs(entry)}
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
