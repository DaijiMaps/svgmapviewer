// XXX
// XXX elsewhere

import { useSelector } from '@xstate/react'
import { useMemo } from 'react'
import { configActor, selectMapNames } from './config-xstate'

export function useNames() {
  const mapNames = useSelector(configActor, selectMapNames)

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
