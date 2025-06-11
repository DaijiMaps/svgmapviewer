/* eslint-disable functional/functional-parameters */
import { Fragment, type ReactNode } from 'react'
import {
  useDistanceRadius,
  useLayoutContainer,
  useLonLat,
} from './lib/style-xstate'
import { useOpenCloseBalloon } from './lib/ui-xstate'

export function Measure(): ReactNode {
  return (
    <>
      <g className="measure">
        {/*
        XXX
        XXX
        XXX
        <MeasurePathUse />
        XXX
        XXX
        XXX
        */}
        <MeasurePath />
      </g>
    </>
  )
}

export function MeasureDistance(): ReactNode {
  const { svg } = useDistanceRadius()

  return (
    <div id="distance">
      <p id={`distance-origin`}>0m</p>
      {INDEXES.map((i) => (
        <Fragment key={i}>
          <p id={`distance-x-${i + 1}`} className="distance-x">
            {svg * (i + 1)}m
          </p>
          <p id={`distance-y-${i + 1}`} className="distance-y">
            {svg * (i + 1)}m
          </p>
        </Fragment>
      ))}
    </div>
  )
}

export function MeasureCoordinate(): ReactNode {
  const { lon, lat } = useLonLat()

  return (
    <div id="coordinate">
      {/* placeholder - updated by style lonlat */}
      <p id="longitude">{lon}</p>
      <p id="latitude">{lat}</p>
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

export function MeasurePath(): ReactNode {
  const { width, height } = useLayoutContainer()
  const { client } = useDistanceRadius()

  const horizontal = `M0,${height / 2} h${width}`
  const vertical = `M${width / 2},0 v${height}`
  const rings = INDEXES.map((i) => {
    const r = client * (i + 1)
    return ringPath({ width, height, r })
  }).join(' ')

  // XXX use
  return (
    <>
      <path
        id="measure-horizontal"
        stroke="black"
        strokeWidth="0.1px"
        fill="none"
        d={horizontal}
      />
      <path
        id="measure-vertical"
        stroke="black"
        strokeWidth="0.1px"
        fill="none"
        d={vertical}
      />
      <path
        id="measure-rings"
        stroke="black"
        strokeWidth="0.1px"
        fill="none"
        d={rings}
      />
    </>
  )
}

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

export function MeasureStyle(): ReactNode {
  const { width, height } = useLayoutContainer()
  const { client } = useDistanceRadius()
  const { open, animating } = useOpenCloseBalloon()

  const pathStyle = `
`

  // balloon is not open => guide is shown (== opacity: 1)
  const [oa, ob] = !open ? [0, 1] : [1, 0]
  const t = !open
    ? 'cubic-bezier(0.25, 0.25, 0.25, 1)'
    : 'cubic-bezier(0.75, 0, 0.75, 0.75)'

  const animationStyle = !animating
    ? `
#measure {
  opacity: ${ob};
  will-change: opacity;
}
`
    : `
#measure {
  animation: xxx-measure 300ms ${t};
  will-change: opacity;
}

@keyframes xxx-measure {
  from {
    opacity: ${oa};
  }
  to {
    opacity: ${ob};
  }
}
`

  const coordinateStyle = `
#distance,
#coordinate {
  position: absolute;
  left: 0;
  top: 0;
  width: ${width}px;
  height: ${height}px;
}
`

  const longitudeStyle = `
#longitude {
  position: absolute;
  right: 0;
  bottom: 0;
  margin: 0.1em;
  padding: 0;
  transform: translate(${-width / 2}px, ${-height / 2}px) scale(0.5);
  transform-origin: right bottom;
  font-weight: lighter;
}
`
  const latitudeStyle = `
#latitude {
  position: absolute;
  left: 0;
  bottom: 0;
  margin: 0.1em;
  padding: 0;
  transform: translate(${width / 2}px, ${-height / 2}px) scale(0.5);
  transform-origin: left bottom;
  font-weight: lighter;
}
`

  const distanceOriginStyle = `
#distance-origin {
  position: absolute;
  left: 0;
  top: 0;
  margin: 0.1em;
  padding: 0;
  transform: translate(${width / 2}px, ${height / 2}px) scale(0.5);
  transform-origin: left top;
  font-size: medium;
  font-weight: lighter;
}
`
  const distanceStyle = `
.distance-x,
.distance-y {
  position: absolute;
  left: 0;
  top: 0;
  margin: 0.1em;
  padding: 0;
  font-size: medium;
  font-weight: lighter;
  transform-origin: left top;
}
`
  const distanceXStyle = INDEXES.map((i) => {
    const r = client * (i + 1)
    return `
#distance-x-${i + 1} {
  transform: translate(${width / 2 + r}px, ${height / 2}px) scale(0.5);
}
`
  })

  const distanceYStyle = INDEXES.map((i) => {
    const r = client * (i + 1)
    return `
#distance-y-${i + 1} {
  transform: translate(${width / 2}px, ${height / 2 + r}px) scale(0.5);
}
`
  })

  return (
    <>
      {pathStyle}
      {animationStyle}
      {coordinateStyle}
      {longitudeStyle}
      {latitudeStyle}
      {distanceOriginStyle}
      {distanceStyle}
      {distanceXStyle}
      {distanceYStyle}
    </>
  )
}

// XXX
// XXX
// XXX
const INDEXES = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
]
// XXX
// XXX
// XXX
