import { useSelector } from '@xstate/react'
import { selectFocus, selectMode, selectTouches } from './lib/react-pointer'
import { PointerRef } from './lib/xstate-pointer'

const CursorPath = (props: Readonly<{ x: number; y: number; r: number }>) => {
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

export const Cursor = (
  props: Readonly<{
    _pointerRef: PointerRef
    _r: number
  }>
) => {
  const { _pointerRef: pointerRef, _r: r } = props
  const mode = useSelector(pointerRef, selectMode)
  const focus = useSelector(pointerRef, selectFocus)
  const touches = useSelector(pointerRef, selectTouches)

  return (
    <>
      <CursorPath x={focus.x} y={focus.y} r={r} />
      {mode === 'pointing' && touches.points.length > 1 && (
        <polyline
          points={touches.points.map(({ x, y }) => `${x},${y}`).join(' ')}
          stroke="black"
          strokeWidth={r * 0.05}
        />
      )}
    </>
  )
}
