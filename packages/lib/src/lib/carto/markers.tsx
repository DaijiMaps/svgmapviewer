import { type ReactNode } from 'react'
import { usePosition } from '../geo'
import { type V } from '../tuple'
import { trunc2 } from '../utils'
import { entryToVs } from './point'
import type { MapMarker, RenderMapMarkersProps } from './types'
import type { OsmRenderMapProps } from '../../types'

export function RenderMapMarkers(
  props: Readonly<OsmRenderMapProps & RenderMapMarkersProps>
): ReactNode {
  const sz = 25 / props.fontSize

  return (
    <defs className="map-markers">
      {props.mapMarkers.map((entry, i) => (
        <g key={i}>
          <RenderUses
            m={props.m}
            sz={sz}
            name={entry.name}
            href={entry.name} // XXX XXX XXX
            vs={entryToVs(props.data.mapData, entry)}
          />
        </g>
      ))}
      <RenderCircle sz={sz} />
      <RenderPosition sz={sz} />
      <style>
        <RenderPositionStyle {...props} />
      </style>
    </defs>
  )
}

function RenderUses(
  props: Readonly<{
    m: DOMMatrixReadOnly
    sz: number
    name: string
    href: string
    vs: V[]
  }>
): ReactNode {
  return (
    <>
      {props.vs
        .map(([x, y]) => props.m.transformPoint({ x, y }))
        .map(({ x, y }, j) => (
          <use
            key={j}
            className={`${props.name}-${j}`}
            href={props.href}
            style={{
              transform:
                `translate(${trunc2(x)}px, ${trunc2(y)}px)` +
                `scale(var(${props.sz}))`,
            }}
          />
        ))}
    </>
  )
}

export function RenderMarkers(
  props: Readonly<{ sz: number; name: string; vs: MapMarker[] }>
): ReactNode {
  const h = (props.sz * 1.5) / 2
  const r = Math.sqrt(2) * h
  return (
    <>
      {props.vs
        .flatMap((m) =>
          m.data === undefined
            ? []
            : [{ name: m.name, href: m.href, x: m.data[0], y: m.data[1] }]
        )
        .map(({ name }, idx) => (
          <path
            key={idx}
            className={name}
            fill="white"
            fillOpacity="1"
            stroke="gray"
            strokeWidth={r / 20}
            d={markerPathD(h, r).replaceAll(/([.]\d\d)\d*/g, '$1')}
          />
        ))}
    </>
  )
}

export function RenderCircle(props: Readonly<{ sz: number }>): ReactNode {
  const r = props.sz / 2
  return (
    <path
      id="point-name-marker"
      fill="white"
      fillOpacity="0.5"
      stroke="none"
      strokeWidth={r / 20}
      d={circlePathD(r).replaceAll(/([.]\d\d)\d*/g, '$1')}
    />
  )
}

export function RenderPosition(props: Readonly<{ sz: number }>): ReactNode {
  const r = props.sz / 2
  const h = r / Math.sqrt(2)
  return (
    <path
      id="position"
      className="position"
      fill="red"
      fillOpacity="1"
      stroke="none"
      d={positionPathD(h, r).replaceAll(/([.]\d\d)\d*/g, '$1')}
    />
  )
}

function circlePathD(r: number): string {
  return `
M 0,0
m ${-r},0
a ${r},${r} 0,1,1 ${2 * r},0
a ${r},${r} 0,1,1 ${-2 * r},0
z
`
}

function markerPathD(h: number, r: number): string {
  return `
M 0,0
l ${-h},${-h}
a ${r},${r} 0,1,1 ${2 * h},0
z
`
}

function positionPathD(h: number, r: number): string {
  return `
${markerPathD(h, r)}
m 0,${-h - r / 4}
a ${r / 2},${r / 2} 0,1,0 0,${-r}
a ${r / 2},${r / 2} 0,1,0 0,${r}
z
`
}

export function RenderPositionStyle(
  props: Readonly<
    OsmRenderMapProps & {
      fontSize: number
      s: number
    }
  >
): ReactNode {
  const position = usePosition()
  const sz = props.s * props.fontSize * 0.9

  if (position === null) {
    return (
      <>{`
#position {
  display: none;
}`}</>
    )
  }

  const { x, y } = props.data.mapCoord.matrix.transformPoint({
    x: position.coords.longitude,
    y: position.coords.latitude,
  })

  return (
    <>{`
#position {
  display: initial !important;
  transform: translate(${x}px, ${y}px) scale(${sz});
}
`}</>
  )
}
