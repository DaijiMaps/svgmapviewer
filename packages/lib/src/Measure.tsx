/* eslint-disable functional/functional-parameters */
import { Fragment, type ReactNode } from 'react'
import { useDistanceRadius, useLayoutContainer } from './lib/style-xstate'
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
      <g className="distance">
        <text id={`distance-origin`}>0m</text>
        {INDEXES.map((i) => (
          <Fragment key={i}>
            <text id={`distance-x-${i + 1}`} />
            <text id={`distance-y-${i + 1}`} />
          </Fragment>
        ))}
      </g>
      <g className="coordinate">
        {/* placeholder - updated by style lonlat */}
        <text id="longitude" />
        <text id="latitude" />
      </g>
    </>
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

export function ringPath({
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

  const longitudeStyle = `
#longitude {
  transform: translate(${width / 2 + 2}px, ${height / 2 - 2}px) scale(0.5);
  font-size: medium;
  font-weight: lighter;
  text-anchor: start;
}
`
  const latitudeStyle = `
#latitude {
  transform: translate(${width / 2 - 2}px, ${height / 2 - 2}px) scale(0.5);
  font-size: medium;
  font-weight: lighter;
  text-anchor: end;
}
`

  const distanceOriginStyle = `
#distance-origin {
  transform: translate(${width / 2 + 2}px, ${height / 2 + 8}px) scale(0.5);
  font-size: medium;
  font-weight: lighter;
  text-anchor: start;
}
`
  const distanceXStyle = INDEXES.map((i) => {
    const r = client * (i + 1)
    return `
#distance-x-${i + 1} {
  transform: translate(${width / 2 + 2 + r}px, ${height / 2 + 8}px) scale(0.5);
  font-size: medium;
  font-weight: lighter;
  text-anchor: start;
}
`
  })

  const distanceYStyle = INDEXES.map((i) => {
    const r = client * (i + 1)
    return `
#distance-y-${i + 1} {
  transform: translate(${width / 2 + 2}px, ${height / 2 + 8 + r}px) scale(0.5);
  font-size: medium;
  font-weight: lighter;
  text-anchor: start;
}
`
  })

  return (
    <>
      {pathStyle}
      {animationStyle}
      {longitudeStyle}
      {latitudeStyle}
      {distanceOriginStyle}
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
