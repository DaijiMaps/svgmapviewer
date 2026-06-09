import { useCallback, useEffect } from 'react'

import {
  FLOOR_APPEARING,
  FLOOR_DISAPPEARING,
  floor_switch_duration,
} from '../../css'
import { notifyFloor } from '../../event-floor'
import type { FidxToOnAnimationEnd, FidxToOnClick } from './floors-types'
import { useFloorsContext } from './floors-xstate'

export interface UseFloorsReturn {
  fidx: number
  prevFidx: null | number
  fidxToOnAnimationEnd: FidxToOnAnimationEnd
  fidxToOnClick: FidxToOnClick
  urls: Map<number, string>
}

export const floorRefs: Map<number, SVGGElement> = new Map()

export function registerFloorRef(e: SVGGElement | null, idx: number): void {
  if (e) floorRefs.set(idx, e)
  else floorRefs.delete(idx)
}

export function updateFloorRefs(
  fidx: number,
  prevFidx: number | null,
  urls: Map<number, string>
): void {
  Array.from(floorRefs, ([idx, e]) => {
    const loading = urls.get(fidx) === undefined
    const s = e.style.setProperty.bind(e.style)
    if (idx == fidx && !loading) {
      s(`will-change`, `opacity`)
      s(`animation`, `${FLOOR_APPEARING} ${floor_switch_duration} linear`)
      s(`visibility`, null)
    } else if (idx === prevFidx) {
      s(`will-change`, `opacity`)
      s(`animation`, `${FLOOR_DISAPPEARING} ${floor_switch_duration} linear`)
      s(`visibility`, null)
    } else {
      s(`will-change`, null)
      s(`animation`, null)
      s(`visibility`, `hidden`)
    }
  })
}

////

export function useFloors(): UseFloorsReturn {
  const { fidx, prevFidx, urls } = useFloorsContext(
    ({ fidx, prevFidx, urls }) => ({
      fidx,
      prevFidx,
      urls,
    })
  )

  // XXX receive only one (appearing) animationend event
  const fidxToOnAnimationEnd: FidxToOnAnimationEnd = useCallback(
    (idx: number) => () =>
      idx !== fidx ? undefined : notifyFloor.selectDone(idx),
    [fidx]
  )

  const fidxToOnClick: FidxToOnClick = useCallback(
    (idx: number) => () =>
      prevFidx !== null || idx === fidx ? undefined : notifyFloor.lock(idx),
    [fidx, prevFidx]
  )

  useEffect(() => {
    updateFloorRefs(fidx, prevFidx, urls)
  }, [fidx, prevFidx, urls])

  return {
    fidx,
    prevFidx,
    fidxToOnAnimationEnd,
    fidxToOnClick,
    urls,
  }
}
