import { notifyFloor } from '../../event-floor'
import type { FidxToOnAnimationEnd, FidxToOnClick } from './floors-types'
import { useFloorsContext } from './floors-xstate'

export interface UseFloorsReturn {
  fidx: number
  prevFidx: null | number
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

  return {
    fidx,
    prevFidx,
    urls,
  }
}

export const fidxToOnAnimationEnd: FidxToOnAnimationEnd =
  (fidx: number, idx: number) => () =>
    idx !== fidx ? undefined : notifyFloor.selectDone(idx)

export const fidxToOnClick: FidxToOnClick =
  (fidx: number, prevFidx: null | number, idx: number) => () =>
    prevFidx !== null || idx === fidx ? undefined : notifyFloor.lock(idx)
