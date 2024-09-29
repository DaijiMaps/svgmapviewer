import { useSelector } from '@xstate/react'
import { Cursor } from './Cursor'
import './Guides.css'
import { boxCenter } from './lib/box/prefixed'
import { Layout } from './lib/layout'
import { selectLayout, selectMode } from './lib/react-pointer'
import { Vec } from './lib/vec'
import { PointerRef } from './lib/xstate-pointer'

export interface GuideParams {
  c: Vec
  r: number
  w: number
}

function guideParams(layout: Layout): GuideParams {
  return {
    c: boxCenter(layout.container),
    r: layout.config.fontSize / 2,
    w: (layout.config.fontSize * 0.05) / 2,
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
  const layout = useSelector(pointerRef, selectLayout)
  const p = guideParams(layout)

  return (
    <svg className="guides">
      <Cursor _pointerRef={props._pointerRef} _r={p.r} />
      {mode === 'panning' && <PanningGuides _p={p} />}
    </svg>
  )
}
