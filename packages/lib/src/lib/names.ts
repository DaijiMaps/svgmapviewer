import { useMemo } from 'react'
import { useConfigMapNames } from './config-xstate'
import { type POI } from './geo'

// XXX
// XXX
// XXX
export function useNames(): Readonly<{
  readonly pointNames: readonly POI[]
  readonly areaNames: readonly POI[]
}> {
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

  return { pointNames, areaNames }
}
// XXX
// XXX
// XXX
