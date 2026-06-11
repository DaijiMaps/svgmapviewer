import { useCallback } from 'react'

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

export const floorRefs: Map<string, SVGGElement | HTMLDivElement> = new Map()

export function registerFloorRef(
  e: SVGGElement | HTMLDivElement | null,
  name: string
): void {
  if (e) floorRefs.set(name, e)
  else floorRefs.delete(name)
}

export function updateFloorRefsAtLoad(fidx: number): void {
  const re = new RegExp(`^.*-${fidx}$`)
  Array.from(floorRefs, ([name, e]) => {
    const s = e.style.setProperty.bind(e.style)
    if (re.test(name)) {
      s(`will-change`, `opacity`)
      s(`animation`, `${FLOOR_APPEARING} ${floor_switch_duration} linear`)
      s(`visibility`, null)
    }
  })
}

export function updateFloorRefsAtSwitch(
  fidx: number,
  prevFidx: number | null
): void {
  const re = new RegExp(`^.*-${fidx}$`)
  Array.from(floorRefs, ([name, e]) => {
    const s = e.style.setProperty.bind(e.style)
    if (prevFidx === null) {
      const visibility = re.test(name) ? null : 'hidden'
      s(`will-change`, null)
      s(`animation`, null)
      s(`visibility`, visibility)
    } else {
      const animation = `${re.test(name) ? FLOOR_APPEARING : FLOOR_DISAPPEARING} ${floor_switch_duration} linear`
      s(`will-change`, `opacity`)
      s(`animation`, animation)
      s(`visibility`, null)
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

  return {
    fidx,
    prevFidx,
    fidxToOnAnimationEnd,
    fidxToOnClick,
    urls,
  }
}
