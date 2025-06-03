/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'
import { svgMapViewerConfig as cfg } from '../config'
import { usePosition } from '../geo'
import { useLayoutConfig, useLayoutSvgScaleS } from '../map-xstate'
import { type V } from '../tuple'
import type { MapMarker } from './types'

export function RenderMapMarkers(): ReactNode {
  const config = useLayoutConfig()
  const s = useLayoutSvgScaleS()

  const sz = s * config.fontSize * 0.9

  return (
    <g className="map-markers">
      {/*
      {props.mapMarkers.map((entry, i) => (
        <g key={i}>
          <RenderMarkers sz={sz} name={entry.name} vs={entryToVs(entry)} />
        </g>
      ))}
      */}
      <RenderPosition sz={sz} />
      <style>
        <RenderPositionStyle />
      </style>
    </g>
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
        .map(({ name, x, y }, idx) => (
          <path
            key={idx}
            className={name}
            fill="white"
            fillOpacity="1"
            stroke="gray"
            strokeWidth={r / 20}
            d={`M 0,0 l ${-h},${-h} a ${r},${r} 0,1,1 ${2 * h},0 z`.replaceAll(
              /([.]\d\d)\d*/g,
              '$1'
            )}
            style={{
              transform: `translate(${x}px, ${y}px)`.replaceAll(
                /([.]\d\d)\d*/g,
                '$1'
              ),
            }}
          />
        ))}
    </>
  )
}

export function RenderMarker(
  props: Readonly<{ sz: number; name: string; m: MapMarker; o: V }>
): ReactNode {
  const { name } = props.m
  const [x, y] = props.o
  const h = 1
  const r = Math.sqrt(2) * h
  return (
    <path
      className={name}
      fill="white"
      fillOpacity="1"
      stroke="gray"
      strokeWidth={r / 20}
      d={`M ${x},${y} l ${-h},${-h} a ${r},${r} 0,1,1 ${2 * h},0 z`.replaceAll(
        /([.]\d\d)\d*/g,
        '$1'
      )}
    />
  )
}

export function RenderPosition(props: Readonly<{ sz: number }>): ReactNode {
  // XXX
  // XXX
  // XXX
  const r = props.sz / 2
  const h = r / Math.sqrt(2)
  // XXX
  // XXX
  // XXX

  return (
    <path
      className="position"
      id="position"
      fill="red"
      fillOpacity="1"
      stroke="none"
      d={`
M 0,0
l ${-h},${-h}
a ${r},${r} 0,1,1 ${2 * h},0
z
m 0,${-h - r / 4}
a ${r / 2},${r / 2} 0,1,0 0,${-r}
a ${r / 2},${r / 2} 0,1,0 0,${r}
`.replaceAll(/([.]\d\d)\d*/g, '$1')}
    />
  )
}

export function RenderPositionStyle(): ReactNode {
  const position = usePosition()

  if (position === null) {
    return (
      <>{`
#position {
  display: none;
}`}</>
    )
  }

  const { x, y } = cfg.mapCoord.matrix.transformPoint({
    x: position.coords.longitude,
    y: position.coords.latitude,
  })

  return (
    <>{`
#position {
  display: initial !important;
  transform: translate(${x}px, ${y}px) scale(2);
}
`}</>
  )
}
