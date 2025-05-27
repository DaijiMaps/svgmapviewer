import { type ReactNode, useMemo } from 'react'
import { Cursor } from './Cursor'
import './Guides.css'
import { boxCenter } from './lib/box/prefixed'
import { type LayoutConfig } from './lib/layout'
import { type Vec } from './lib/vec'
import { useViewerLayoutConfig, useViewerMode } from './lib/viewer-xstate'

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
  const mode = useViewerMode()
  const config = useViewerLayoutConfig()
  const p = useMemo(() => guideParams(config), [config])

  return (
    <svg className="guides">
      <Cursor _r={p.r} />
      {mode === 'panning' && <PanningGuides _p={p} />}
    </svg>
  )
}
