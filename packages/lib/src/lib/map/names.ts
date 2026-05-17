/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */
import { createStore } from '@xstate/store'
import { useSelector } from '@xstate/store/react'
import { Array, pipe, Result, Number } from 'effect'
import { useMemo } from 'react'

import { type POI, type Range, type SvgMapViewerConfig } from '../../types'
import { globalCbs } from '../event-global'
import { useLayoutSvgScaleS, useSvgRange } from '../style/style-react'
import { type VecVec } from '../vec/prefixed'

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
    return mapNames.flatMap(({ id, name, coord, area }) => {
      return id === undefined || area === undefined
        ? []
        : [
            {
              id,
              name,
              coord,
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
    Array.filterMap(({ id, size }) =>
      id === null ? Result.failVoid : Result.succeed({ id, size })
    ),
    Array.map(({ id, size }) => [id, Math.round(Math.log2(size))])
  )
  const sizeMap = new Map<number, number>(xs)
  const sizes = pipe(
    sizeMap.values(),
    (xs) => Array.fromIterable(xs),
    Array.sort(Number.Order),
    Array.dedupe
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
  const geoRange = useSvgRange()
  const s = useLayoutSvgScaleS()
  const { sizes, sizeMap, pointNames, areaNames } = useNames()

  const smallMap = pipe(
    sizes,
    Array.map((sz) => {
      // XXX
      // XXX
      // XXX
      const scale = Math.pow(2, sz) / 10 / 4
      // XXX
      // XXX
      // XXX
      return [sz, scale < s] as const
    }),
    (xs) => new Map(xs)
  )

  const pointRange = useMemo(
    () => namesToRange(pointNames, geoRange, sizeMap, smallMap),
    [pointNames, geoRange, sizeMap, smallMap]
  )
  const areaRange = useMemo(
    () => namesToRange(areaNames, geoRange, sizeMap, smallMap),
    [areaNames, geoRange, sizeMap, smallMap]
  )

  return { pointRange, areaRange }
}

function namesToRange(
  names: readonly POI[],
  geoRange: Readonly<Range>,
  sizeMap: Readonly<Map<number, number>>,
  smallMap: Readonly<Map<number, boolean>>
): NameRangeMap {
  const xs = pipe(
    names,
    Array.filterMap(({ id, coord }) => {
      if (id === null) {
        return Result.failVoid
      }
      const sz = sizeMap.get(id)
      if (sz === undefined) {
        return Result.failVoid
      }
      const small = smallMap.get(sz)
      if (small === undefined) {
        return Result.failVoid
      }
      const inout = inRange(coord, geoRange)
      return Result.succeed({
        id,
        inout,
        small,
      })
    })
  )
  const insides = pipe(
    xs,
    Array.filterMap(({ id, inout, small }) =>
      inout && !small ? Result.succeed(id) : Result.failVoid
    ),
    (xs) => new Set(xs)
  )
  const outsides = pipe(
    xs,
    Array.filterMap(({ id, inout, small }) =>
      !(inout && !small) ? Result.succeed(id) : Result.failVoid
    ),
    (xs) => new Set(xs)
  )
  return { insides, outsides }
}

function inRange(p: VecVec, r: Readonly<Range>): boolean {
  const { start: s, end: e } = r
  return between(s.x, p.x, e.x) && between(s.y, p.y, e.y)
}

function between(a: number, b: number, c: number): boolean {
  return (b - a) * (c - b) > 0
}

////

function initNames(cfg: Readonly<SvgMapViewerConfig>): void {
  // eslint-disable-next-line functional/no-conditional-statements
  if (cfg.getMapNames) {
    setNames(
      cfg.getMapNames({
        data: cfg,
        render: cfg,
        carto: cfg.cartoConfig,
        floors: cfg.floorsConfig,
      })
    )
  }
}

export function namesCbsStart(): void {
  // eslint-disable-next-line functional/immutable-data
  globalCbs.init.add(initNames)
}
