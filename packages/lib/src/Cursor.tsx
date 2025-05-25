import { useSelector } from '@xstate/react'
import { PointerRef, selectCursor } from './lib/pointer-xstate'

const DefaultCursorPath = (
  props: Readonly<{ x: number; y: number; r: number }>
) => {
  const { x, y, r } = props

  return (
    <path
      d={`
M${x},${y}
m${-r},0
h${r * 2}
m${-r},${-r}
v${r * 2}
M${x},${y - r}
a${r},${r} 0,0,1 0,${r * 2}
a${r},${r} 0,0,1 0,${-r * 2}
`}
      fill="none"
      stroke="black"
      strokeWidth={r * 0.05}
    />
  )
}

function DefaultCursor(
  props: Readonly<{
    _pointerRef: PointerRef
    _r: number
  }>
) {
  const { _pointerRef: pointerRef, _r: r } = props
  const cursor = useSelector(pointerRef, selectCursor)

  return <DefaultCursorPath x={cursor.x} y={cursor.y} r={r} />
}

function MultiTouchCursor(
  props: Readonly<{
    _pointerRef: PointerRef
    _r: number
  }>
) {
  const { _r: r } = props

  return (
    <>
      <path
        d={
          // XXX
          [{ x: 0, y: 0 }].map(
            ({ x, y }, i) => (i === 0 ? 'M' : 'L') + `${x},${y}`
          ) + 'Z'
        }
        stroke="black"
        strokeWidth={r * 0.05}
        fill="none"
      />
    </>
  )
}

export const Cursor = (
  props: Readonly<{
    _pointerRef: PointerRef
    _r: number
  }>
) => {
  return (
    <>
      <DefaultCursor {...props} />
      <MultiTouchCursor {...props} />
    </>
  )
}
