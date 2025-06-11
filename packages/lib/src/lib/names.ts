/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */
import { number, option, readonlyArray } from 'fp-ts'
import { pipe } from 'fp-ts/lib/function'
import { useMemo } from 'react'
import { useConfigMapNames } from './config-xstate'
import { type POI } from './geo'

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
