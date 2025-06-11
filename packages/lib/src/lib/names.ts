/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */
import { number, option, readonlyArray } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'
import { none, some } from 'fp-ts/lib/Option'
import { useMemo } from 'react'
import { useConfigMapNames } from './config-xstate'
import { type POI } from './geo'
import { useSvgRange } from './style-xstate'
import type { Range } from './types'
import type { VecVec } from './vec/prefixed'

export interface Names {
  readonly pointNames: readonly POI[]
  readonly areaNames: readonly POI[]
  readonly sizeMap: Readonly<Map<number, number>>
  readonly sizes: readonly number[]
}

// XXX
// XXX
// XXX
export function useNames(): Readonly<Names> {
  const mapNames = useConfigMapNames()

  const pointNames = useMemo(() => {
    return mapNames.filter(
      ({ id, area }) => id !== undefined && area === undefined
    )
  }, [mapNames])

  const areaNames = useMemo(() => {
    return mapNames.flatMap(({ id, name, pos, area }) => {
      return id === undefined || area === undefined
        ? []
        : [
            {
              id,
              name,
              pos,
              area,
              size: Math.sqrt(area),
            },
          ]
    })
  }, [mapNames])

  const { sizeMap, sizes } = useMemo(() => getSizes(areaNames), [areaNames])

  return { pointNames, areaNames, sizeMap, sizes }
}
// XXX
// XXX
// XXX

function getSizes(names: readonly POI[]): Pick<Names, 'sizeMap' | 'sizes'> {
  const xs: readonly [number, number][] = pipe(
    names,
    readonlyArray.filterMap(({ id, size }) =>
      id === null ? option.none : option.some({ id, size })
    ),
    readonlyArray.map(({ id, size }) => [id, Math.round(Math.log2(size))])
  )
  const sizeMap = new Map<number, number>(xs)
  const sizes = pipe(
    sizeMap.values(),
    (xs) => Array.from(xs),
    readonlyArray.sort(number.Ord),
    readonlyArray.uniq(number.Eq)
  )
  return { sizeMap, sizes }
}

type NameRangeMap = {
  insides: Set<number>
  outsides: Set<number>
}
interface Ranges {
  pointRange: NameRangeMap
  areaRange: NameRangeMap
}

export function useNameRanges(): Ranges {
  const svgRange = useSvgRange()
  const { pointNames, areaNames } = useNames()

  const pointRange = useMemo(
    () => namesToRange(pointNames, svgRange),
    [pointNames, svgRange]
  )
  const areaRange = useMemo(
    () => namesToRange(areaNames, svgRange),
    [areaNames, svgRange]
  )

  return { pointRange, areaRange }
}

function namesToRange(
  names: readonly POI[],
  svgRange: Readonly<Range>
): NameRangeMap {
  const xs = pipe(
    names,
    readonlyArray.map(({ id, pos }) => ({ id, inout: inRange(pos, svgRange) }))
  )
  const insides = pipe(
    xs,
    readonlyArray.filterMap(({ id, inout }) =>
      id !== null && inout ? some(id) : none
    ),
    (xs) => new Set(xs)
  )
  const outsides = pipe(
    xs,
    readonlyArray.filterMap(({ id, inout }) =>
      id !== null && !inout ? some(id) : none
    ),
    (xs) => new Set(xs)
  )
  return { insides, outsides }
}

function inRange(p: VecVec, r: Readonly<Range>): boolean {
  const { start: s, end: e } = r
  return p.x >= s.x && p.x <= e.x && p.y >= s.y && p.y <= e.y
}
