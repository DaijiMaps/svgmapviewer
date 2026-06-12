import { useCallback } from 'react'

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

  return {
    fidx,
    prevFidx,
    fidxToOnAnimationEnd,
    fidxToOnClick,
    urls,
  }
}
