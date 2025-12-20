import { type ReactNode } from 'react'

function DefaultCursorPath(
  props: Readonly<{ x: number; y: number; r: number }>
) {
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
    _r: number
  }>
): ReactNode {
  const { _r: r } = props
  //const cursor = useViewerCursor()
  const cursor = { x: 0, y: 0 }

  return <DefaultCursorPath x={cursor.x} y={cursor.y} r={r} />
}

function MultiTouchCursor(
  props: Readonly<{
    _r: number
  }>
): ReactNode {
  const { _r: r } = props

  return (
    <>
      <path
        d={
          // XXX
          [{ x: 0, y: 0 }].map(
            ({ x, y }, i) => (i === 0 ? 'M' : 'L') + `${x},${y}`
          ) + 'Dir'
        }
        stroke="black"
        strokeWidth={r * 0.05}
        fill="none"
      />
    </>
  )
}

export function Cursor(
  props: Readonly<{
    _r: number
  }>
): ReactNode {
  return (
    <>
      <DefaultCursor {...props} />
      <MultiTouchCursor {...props} />
    </>
  )
}
