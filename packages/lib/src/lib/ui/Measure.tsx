/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-conditional-statements */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */
import { Fragment, useMemo, useRef, type ReactNode } from 'react'

import {
  position_absolute_left_0_bottom_0,
  position_absolute_left_0_top_0,
  position_absolute_right_0_bottom_0,
} from '../css'
import type { DistanceRadius } from '../distance-types'
import { useStyleRef, type StyleRefMap } from '../style/ref'
import { useDistanceRadius, useLayoutContainer } from '../style/style-react'
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
  const { svg } = useDistanceRadius()

  useStyleRef(distanceRefs, ref, 'distance')

  return (
    <div ref={ref} id="distance">
      <p id={`distance-origin`} className="distance">
        0m
      </p>
      {INDEXES.map((i) => (
        <Fragment key={i}>
          <p id={`distance-x-${i + 1}`} className="distance distance-x">
            {svg * (i + 1)}m
          </p>
          <p id={`distance-y-${i + 1}`} className="distance distance-y">
            {svg * (i + 1)}m
          </p>
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

export function MeasurePaths(): ReactNode {
  const { width, height } = useLayoutContainer()
  const { client } = useDistanceRadius()

  // XXX use cache

  const horizontal = useMemo(
    () => `M0,${height / 2} h${width}`,
    [height, width]
  )
  const vertical = useMemo(() => `M${width / 2},0 v${height}`, [height, width])
  const rings = useMemo(
    () =>
      INDEXES.map((i) => {
        const r = client * (i + 1)
        return ringPath({ width, height, r })
      }),
    [client, height, width]
  )

  // XXX use
  return (
    <>
      <path
        id="measure-horizontal"
        className="measure-line"
        stroke="black"
        strokeWidth="0.1px"
        fill="none"
        d={horizontal}
      />
      <path
        id="measure-vertical"
        className="measure-line"
        stroke="black"
        strokeWidth="0.1px"
        fill="none"
        d={vertical}
      />
      {rings.map((d, idx) => (
        <path
          key={idx}
          id={`measure-ring-${idx + 1}`}
          className="measure-line"
          stroke="black"
          strokeWidth="0.1px"
          fill="none"
          d={d}
        />
      ))}
    </>
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

const coordinateStyle = `
#distance,
#coordinate {
  ${position_absolute_left_0_top_0}
  width: var(--layout-container-width);
  height: var(--layout-container-height);
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
  transform: translate(calc(var(--layout-container-width) / -2), calc(var(--layout-container-height) / 2)) scale(0.5);
}
`
const latitudeStyle = `
#latitude {
  ${position_absolute_left_0_bottom_0}
  margin: 0.1em;
  padding: 0;
  font-weight: lighter;
  transform-origin: left bottom;
  transform: translate(calc(var(--layout-container-width) / 2)), calc(var(--layout-container-height) / -2)) scale(0.5);
}
`

const distanceRefs: StyleRefMap<HTMLDivElement> = new Map()

export function updateDistanceRefs({ client }: Readonly<DistanceRadius>): void {
  Array.from(distanceRefs, ([, e]) => {
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
  transform: translate(calc(var(--layout-container-width) / 2), calc(var(--layout-container-height) / 2)) scale(0.5);
}
`
const distanceXStyle = INDEXES.map((i) => {
  const width = `var(--layout-container-width)`
  const height = `var(--layout-container-height)`
  const r = `var(--distance-radius-client) * (${i} + 1)`
  const x = `calc(${width} / 2 + ${r})`
  const y = `calc(${height} / 2)`
  return `
#distance-x-${i + 1} {
  transform: translate(${x}, ${y}) scale(0.5);
}
`
})

const distanceYStyle = INDEXES.map((i) => {
  const width = `var(--layout-container-width)`
  const height = `var(--layout-container-height)`
  const r = `var(--distance-radius-client) * (${i} + 1)`
  const x = `calc(${width} / 2)`
  const y = `calc(${height} / 2 + ${r})`
  return `
#distance-y-${i + 1} {
  transform: translate(${x}, ${y}) scale(0.5);
}
`
})
