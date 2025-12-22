/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
import { createAtom } from '@xstate/store'
import { useAtom } from '@xstate/store/react'
import type { ReactNode } from 'react'
import type { VecVec } from 'svgmapviewer/vec'
import { makeID, type ID } from './ids'

type PointMap = Map<ID, VecVec>

const pointsAtom = createAtom<PointMap>(new Map())

export function pointsAdd(p: VecVec): ID {
  const id = makeID()
  const m = pointsAtom.get()
  m.set(id, p)
  pointsAtom.set(new Map(m))
  return id
}

export function usePoints(): PointMap {
  return useAtom(pointsAtom)
}

export function Points({
  grid,
  points,
}: Readonly<{
  grid: SVGGraphicsElement
  points: PointMap
}>): ReactNode {
  const ctm = grid.getScreenCTM()
  const m = ctm ? DOMMatrixReadOnly.fromMatrix(ctm).inverse() : undefined

  return m === undefined ? (
    <></>
  ) : (
    <g>
      {Array.from(points).map(([id, p]) => {
        const pp = m.transformPoint(p)
        return (
          <circle
            key={id}
            cx={pp.x}
            cy={pp.y}
            r={0.5}
            fill="none"
            stroke="green"
            strokeWidth={0.125}
          />
        )
      })}
    </g>
  )
}
