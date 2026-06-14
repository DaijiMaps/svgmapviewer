/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-conditional-statements */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */
import { Fragment, useRef, type ReactNode } from 'react'

import {
  position_absolute_left_0_bottom_0,
  position_absolute_left_0_top_0,
  position_absolute_right_0_bottom_0,
} from '../css'
import type { DistanceRadius } from '../distance-types'
import { useStyleRef, type StyleRefMap } from '../style/ref'
import { trunc7 } from '../utils'
import type { VecVec } from '../vec/prefixed'

// XXX
// XXX
// XXX
const INDEXES = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
]
// XXX
// XXX
// XXX

export function Measure(): ReactNode {
  return (
    <>
      <g id="measure">
        {/*
        XXX
        XXX
        XXX
        <MeasurePathUse />
        XXX
        XXX
        XXX
        */}
        <MeasurePaths />
      </g>
    </>
  )
}

export function MeasureDistance(): ReactNode {
  const ref = useRef(null)

  useStyleRef(distanceRefs, ref, 'distance')

  return (
    <div ref={ref} id="distance">
      <p id={`distance-origin`} className="distance">
        0m
      </p>
      {INDEXES.map((i) => (
        <Fragment key={i}>
          <p id={`distance-x-${i + 1}`} className="distance distance-x"></p>
          <p id={`distance-y-${i + 1}`} className="distance distance-y"></p>
        </Fragment>
      ))}
      <style>
        <DistanceStyle />
      </style>
    </div>
  )
}

const coordRefs: StyleRefMap<HTMLDivElement> = new Map()

export function updateCoordRefs(pgeo: VecVec): void {
  const ew = pgeo.x > 0 ? 'E' : 'W'
  const ns = pgeo.y > 0 ? 'N' : 'S'
  const lon = `${ew} ${trunc7(Math.abs(pgeo.x))}`
  const lat = `${ns} ${trunc7(Math.abs(pgeo.y))}`
  Array.from(coordRefs, ([name, e]) => {
    if (name === 'lon') e.textContent = lon
    if (name === 'lat') e.textContent = lat
  })
}

export function MeasureCoordinate(): ReactNode {
  const lonRef = useRef(null)
  const latRef = useRef(null)

  useStyleRef(coordRefs, lonRef, 'lon')
  useStyleRef(coordRefs, latRef, 'lat')

  return (
    <div id="coordinate">
      {/* placeholder - updated by style coord */}
      <p ref={lonRef} id="longitude"></p>
      <p ref={latRef} id="latitude"></p>
      <style>
        <CoordinateStyle />
      </style>
    </div>
  )
}

export function MeasurePathUse(): ReactNode {
  return (
    <>
      <use href="#measure-horizontal" />
      <use href="#measure-vertical" />
      <use href="#measure-rings" />
    </>
  )
}

const measureRefs: StyleRefMap<SVGPathElement> = new Map()

export function updateMeasureRefs(
  width: number,
  height: number,
  client: number
): void {
  const horizontal = `M0,${height / 2} h${width}`
  const vertical = `M${width / 2},0 v${height}`
  const h = measureRefs.get('horizontal')
  if (h) h.setAttribute('d', horizontal)
  const v = measureRefs.get('vertical')
  if (v) v.setAttribute('d', vertical)
  INDEXES.forEach((i) => {
    const e = measureRefs.get(`ring${i}`)
    if (!e) return
    const r = client * (i + 1)
    const d = ringPath({ width, height, r })
    e.setAttribute('d', d)
  })
}

export function MeasurePaths(): ReactNode {
  const horizontalRef = useRef(null)
  const vertcalRef = useRef(null)

  useStyleRef(measureRefs, horizontalRef, `horizontal`)
  useStyleRef(measureRefs, vertcalRef, `vertical`)

  // XXX use cache

  // XXX use
  return (
    <>
      <path
        ref={horizontalRef}
        id="measure-horizontal"
        className="measure-line"
        stroke="black"
        strokeWidth="0.1px"
        fill="none"
      />
      <path
        ref={vertcalRef}
        id="measure-vertical"
        className="measure-line"
        stroke="black"
        strokeWidth="0.1px"
        fill="none"
      />
      {INDEXES.map((_, idx) => (
        <Fragment key={idx}>
          <RingPath idx={idx} />
        </Fragment>
      ))}
    </>
  )
}

function RingPath({ idx }: Readonly<{ idx: number }>): ReactNode {
  const ref = useRef(null)
  useStyleRef(measureRefs, ref, `ring${idx}`)
  return (
    <path
      ref={ref}
      id={`measure-ring-${idx + 1}`}
      className="measure-line"
      stroke="black"
      strokeWidth="0.1px"
      fill="none"
    />
  )
}

// XXX
// XXX
// XXX
// XXX
// XXX
function ringPath({
  width,
  height,
  r,
}: Readonly<{
  width: number
  height: number
  r: number
}>): string {
  return `M${width / 2},${height / 2} m-${r},0 a${r},${r} 0,1,0 ${r * 2},0 a${r},${r} 0,1,0 -${r * 2},0`.replaceAll(
    /([.]\d)\d*/g,
    '$1'
  )
}
// XXX
// XXX
// XXX
// XXX
// XXX

export function CoordinateStyle(): ReactNode {
  return (
    <>
      {coordinateStyle}
      {longitudeStyle}
      {latitudeStyle}
    </>
  )
}

const width = `var(--layout-container-width)`
const height = `var(--layout-container-height)`
const client = `var(--distance-radius-client)`

const coordinateStyle = `
#distance,
#coordinate {
  ${position_absolute_left_0_top_0}
  width: ${width};
  height: ${height};
  transform: translate3d(0, 0, 0);
}
`
const longitudeStyle = `
#longitude {
  ${position_absolute_right_0_bottom_0}
  margin: 0.1em;
  padding: 0;
  font-weight: lighter;
  transform-origin: right bottom;
  transform: translate(calc(${width} / -2), calc(${height} / -2)) scale(0.5);
}
`
const latitudeStyle = `
#latitude {
  ${position_absolute_left_0_bottom_0}
  margin: 0.1em;
  padding: 0;
  font-weight: lighter;
  transform-origin: left bottom;
  transform: translate(calc(${width} / 2), calc(${height} / -2)) scale(0.5);
}
`

const distanceRefs: StyleRefMap<HTMLDivElement> = new Map()

export function updateDistanceRefs({
  svg,
  client,
}: Readonly<DistanceRadius>): void {
  Array.from(distanceRefs, ([, e]) => {
    // 1. update <p></p>
    Array.from(e.children, (child) => {
      // id must be like: 'distance-x-1'
      const ss = child.id.split(/-/g)
      if (ss.length !== 3 || ss[0] !== 'distance' || !ss[1].match(/^[xy]$/))
        return
      const idx = Number(ss[2])
      if (typeof idx !== 'number') return
      child.textContent = `${svg * idx}m`
    })
    // 2. update style property
    const p = e.style.setProperty.bind(e.style)
    p('--distance-radius-client', `${client}px`)
  })
}

export function DistanceStyle(): ReactNode {
  return (
    <>
      {distanceOriginStyle}
      {distanceStyle}
      {distanceXStyle}
      {distanceYStyle}
    </>
  )
}

const distanceStyle = `
.distance {
  ${position_absolute_left_0_top_0}
  margin: 0.1em;
  padding: 0;
  font-weight: lighter;
  transform-origin: left top;
}
`
const distanceOriginStyle = `
#distance-origin {
  transform: translate(calc(${width} / 2), calc(${height} / 2)) scale(0.5);
}
`
const distanceXStyle = INDEXES.map((i) => {
  const r = `${client} * (${i} + 1)`
  const x = `${width} / 2 + ${r}`
  const y = `${height} / 2`
  return `
#distance-x-${i + 1} {
  transform: translate(calc(${x}), calc(${y})) scale(0.5);
}
`
})

const distanceYStyle = INDEXES.map((i) => {
  const r = `${client} * (${i} + 1)`
  const x = `${width} / 2`
  const y = `${height} / 2 + ${r}`
  return `
#distance-y-${i + 1} {
  transform: translate(calc(${x}), calc(${y})) scale(0.5);
}
`
})
