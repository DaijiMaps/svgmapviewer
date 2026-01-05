import { useCallback, useMemo } from 'react'

import type { FidxToOnAnimationEnd, FidxToOnClick } from './floors-types'

import { svgMapViewerConfig } from '../../../config'
import {
  FLOOR_APPEARING,
  floor_appearing_animation,
  FLOOR_DISAPPEARING,
  floor_switch_duration,
} from '../../css'
import { notifyFloor } from '../../event-floor'
import { useFloorsContext } from './floors-xstate'

export interface UseFloorsReturn {
  fidx: number
  prevFidx: null | number
  style: null | string
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

  const style = useMemo(
    () => makeStyle(fidx, prevFidx, urls.get(fidx) === undefined),
    [fidx, prevFidx, urls]
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
    style,
    fidxToOnAnimationEnd,
    fidxToOnClick,
    urls,
  }
}

function makeStyle(
  fidx: number,
  prevFidx: null | number,
  loading: boolean
): null | string {
  const floorsConfig = svgMapViewerConfig.floorsConfig
  if (floorsConfig === undefined) {
    return null
  }
  const style = floorsConfig.floors
    .map((_, idx) => idxToStyle(fidx, prevFidx, loading, idx))
    .join('')
  return `
${style}
${floor_appearing_animation}
`
}

function idxToStyle(
  fidx: number,
  prevFidx: null | number,
  loading: boolean,
  idx: number
) {
  return idx == fidx && !loading
    ? appearing(idx)
    : idx === prevFidx
      ? disappearing(idx)
      : hidden(idx)
}

function hidden(idx: number) {
  return `
.fidx-${idx} {
  visibility: hidden;
}
  `
}

function disappearing(idx: number) {
  return `
.fidx-${idx} {
  will-change: opacity;
  animation: ${FLOOR_DISAPPEARING} ${floor_switch_duration} linear;
}
`
}

function appearing(idx: number) {
  return `
.fidx-${idx} {
  will-change: opacity;
  animation: ${FLOOR_APPEARING} ${floor_switch_duration} linear;
}
`
}
