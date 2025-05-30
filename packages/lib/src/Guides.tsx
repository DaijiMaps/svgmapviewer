import { type ReactNode } from 'react'
import './Guides.css'
import { boxCenter } from './lib/box/prefixed'
import { type LayoutConfig } from './lib/layout'
import { useLayout } from './lib/style-xstate'
import { useOpenCloseBalloon } from './lib/ui-xstate'
import { type Vec } from './lib/vec'

export interface GuideParams {
  c: Vec
  r: number
  w: number
}

function guideParams(config: LayoutConfig): GuideParams {
  return {
    c: boxCenter(config.container),
    r: config.fontSize / 2,
    w: (config.fontSize * 0.05) / 2,
  }
}

function PanningGuides(props: Readonly<{ _p: GuideParams }>): ReactNode {
  const { c, r, w } = props._p

  return (
    <path
      d={`
M${c.x},${c.y}
m${r * -20},0
h${r * 40}
m${r * -20},${r * -20}
v${r * 40}
`}
      stroke="black"
      strokeWidth={w}
    />
  )
}

export interface GuidesProps {}

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
  const rings = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  ]
    .map((i) => {
      const r = 100 * (i + 1)
      return `M${width / 2},${height / 2} m-${r},0 a${r},${r} 0,1,0 ${r * 2},0 a${r},${r} 0,1,0 -${r * 2},0`
    })
    .join(' ')
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

  return (
    <>
      {pathStyle}
      {animationStyle}
    </>
  )
}
