import { Array } from 'effect'
import type { ReactNode, RefObject } from 'react'
import type { VecVec } from 'svgmapviewer/vec'

function makeSeq(length: number, unit: number): number[] {
  const l = length / 2
  const n = l / unit
  return Array.range(-n, n)
}

interface GridProps {
  ref: RefObject<null | SVGGraphicsElement>
  size: VecVec
  unit: number
}

const h = (l: number, u: number, i: number) => `M-${l / 2},${i * u}h${l}`
const v = (l: number, u: number, i: number) => `M${i * u},-${l / 2}v${l}`

export function Grid(props: Readonly<GridProps>): ReactNode {
  const {
    size: { x, y },
    unit,
  } = props
  const hs = makeSeq(x, unit).map((i) => h(x, unit, i))
  const vs = makeSeq(y, unit).map((i) => v(x, unit, i))

  return (
    // eslint-disable-next-line react-hooks/refs
    <g ref={props.ref} id="grid">
      <path d={hs.concat(vs).join('')} stroke="black" strokeWidth={0.05} />
    </g>
  )
}
