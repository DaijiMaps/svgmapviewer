/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */
import { createStore } from '@xstate/store'
import { useSelector } from '@xstate/store/react'
import { number, option, readonlyArray } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'
import { none, some } from 'fp-ts/lib/Option'
import { useMemo } from 'react'
import { type POI } from '../geo'
import { useLayoutSvgScaleS, useSvgRange } from '../style-xstate'
import type { Range } from '../types'
import type { VecVec } from '../vec/prefixed'

export interface Names {
  readonly pointNames: readonly POI[]
  readonly areaNames: readonly POI[]
  readonly sizeMap: Readonly<Map<number, number>>
  readonly sizes: readonly number[]
}

const namesStore = createStore({
  context: {
    names: [] as readonly POI[],
  },
  on: {
    set: (_, { names }: Readonly<{ names: readonly POI[] }>) => ({
      names,
    }),
  },
})

export function setNames(names: readonly POI[]): void {
  namesStore.trigger.set({ names })
}

// XXX
// XXX
// XXX
export function useNames(): Readonly<Names> {
  const mapNames = useSelector(namesStore, (state) => state.context.names)

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
  const s = useLayoutSvgScaleS()
  const { sizes, sizeMap, pointNames, areaNames } = useNames()

  const smallMap = pipe(
    sizes,
    readonlyArray.map<number, [number, boolean]>((sz) => {
      // XXX
      // XXX
      // XXX
      const scale = Math.pow(2, sz) / 10 / 4
      // XXX
      // XXX
      // XXX
      return [sz, scale < s]
    }),
    (xs) => new Map(xs)
  )

  const pointRange = useMemo(
    () => namesToRange(pointNames, svgRange, sizeMap, smallMap),
    [pointNames, svgRange, sizeMap, smallMap]
  )
  const areaRange = useMemo(
    () => namesToRange(areaNames, svgRange, sizeMap, smallMap),
    [areaNames, svgRange, sizeMap, smallMap]
  )

  return { pointRange, areaRange }
}

function namesToRange(
  names: readonly POI[],
  svgRange: Readonly<Range>,
  sizeMap: Readonly<Map<number, number>>,
  smallMap: Readonly<Map<number, boolean>>
): NameRangeMap {
  const xs = pipe(
    names,
    readonlyArray.filterMap(({ id, pos }) => {
      if (id === null) {
        return none
      }
      const sz = sizeMap.get(id)
      if (sz === undefined) {
        return none
      }
      const small = smallMap.get(sz)
      if (small === undefined) {
        return none
      }
      return some({
        id,
        inout: inRange(pos, svgRange),
        small,
      })
    })
  )
  const insides = pipe(
    xs,
    readonlyArray.filterMap(({ id, inout, small }) =>
      inout && !small ? some(id) : none
    ),
    (xs) => new Set(xs)
  )
  const outsides = pipe(
    xs,
    readonlyArray.filterMap(({ id, inout, small }) =>
      !(inout && !small) ? some(id) : none
    ),
    (xs) => new Set(xs)
  )
  return { insides, outsides }
}

function inRange(p: VecVec, r: Readonly<Range>): boolean {
  const { start: s, end: e } = r
  return p.x >= s.x && p.x <= e.x && p.y >= s.y && p.y <= e.y
}
