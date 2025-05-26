import { useSelector } from '@xstate/react'
import { useMemo } from 'react'
import { Cursor } from './Cursor'
import './Guides.css'
import { boxCenter } from './lib/box/prefixed'
import { type LayoutConfig } from './lib/layout'
import {
  type PointerRef,
  selectLayoutConfig,
  selectMode,
} from './lib/pointer-xstate'
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

function PanningGuides(props: Readonly<{ _p: GuideParams }>) {
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

export interface GuidesProps {
  _pointerRef: PointerRef
}

export function Guides(props: Readonly<GuidesProps>) {
  const { _pointerRef: pointerRef } = props
  const mode = useSelector(pointerRef, selectMode)
  const config = useSelector(pointerRef, selectLayoutConfig)
  const p = useMemo(() => guideParams(config), [config])

  return (
    <svg className="guides">
      <Cursor _pointerRef={props._pointerRef} _r={p.r} />
      {mode === 'panning' && <PanningGuides _p={p} />}
    </svg>
  )
}
