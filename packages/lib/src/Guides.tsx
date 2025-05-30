import { type ReactNode } from 'react'
import './Guides.css'
import { useLayout } from './lib/style-xstate'
import { useOpenCloseBalloon } from './lib/ui-xstate'

export function Guides(): ReactNode {
  return (
    <svg className="guides">
      <Measure />
    </svg>
  )
}

function Measure(): ReactNode {
  return (
    <g>
      <text id="longitude">E 135.123456</text>
      <text id="latitude">N 35.123456</text>
      <g className="distance-x">
        {INDEXES.map((i, idx) => (
          <text key={idx} id={`distance-x-${i}`}>
            {(i + 1) * 10 + `m`}
          </text>
        ))}
      </g>
      <g className="distance-y">
        {INDEXES.map((i, idx) => (
          <text key={idx} id={`distance-y-${i}`}>
            {(i + 1) * 10 + `m`}
          </text>
        ))}
      </g>
      <path id="measure" stroke="black" strokeWidth="0.15px" fill="none" d="" />
    </g>
  )
}

export function MeasureStyle(): ReactNode {
  const {
    container: { width, height },
  } = useLayout()
  const { open, animating } = useOpenCloseBalloon()

  const horizontal = `M0,${height / 2} h${width}`
  const vertical = `M${width / 2},0 v${height}`
  const rings = INDEXES.map((i) => {
    const r = 100 * (i + 1)
    return `M${width / 2},${height / 2} m-${r},0 a${r},${r} 0,1,0 ${r * 2},0 a${r},${r} 0,1,0 -${r * 2},0`
  }).join(' ')
  // XXX no newlines allowed
  const d = `${horizontal} ${vertical} ${rings}`
  const pathStyle = `
#measure {
  d: path("${d}");
}
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

  const distanceXStyle = INDEXES.map((i) => {
    const r = 100 * (i + 1)
    return `
#distance-x-${i} {
  transform: translate(${width / 2 + 2 + r}px, ${height / 2 + 8}px) scale(0.5);
  font-size: medium;
  font-weight: lighter;
  text-anchor: start;
}
`
  })

  const distanceYStyle = INDEXES.map((i) => {
    const r = 100 * (i + 1)
    return `
#distance-y-${i} {
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
