import { useCallback, useMemo } from 'react'
import { svgMapViewerConfig } from '../../../config'
import { floor_switch_duration } from '../../css'
import { notifyFloorLock, notifyFloorSelectDone } from '../../event-floor'
import type { FidxToOnAnimationEnd, FidxToOnClick } from './floors-types'
import { useFloorsContext } from './floors-xstate'

export interface UseFloorsReturn {
  fidx: number
  prevFidx: null | number
  style: null | string
  fidxToOnAnimationEnd: FidxToOnAnimationEnd
  fidxToOnClick: FidxToOnClick
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
    (idx: number) =>
      idx === fidx ? () => notifyFloorSelectDone(idx) : undefined,
    [fidx]
  )

  const fidxToOnClick: FidxToOnClick = useCallback(
    (idx: number) =>
      prevFidx !== null || idx === fidx
        ? undefined
        : () => notifyFloorLock(idx),
    [fidx, prevFidx]
  )

  return {
    fidx,
    prevFidx,
    style,
    fidxToOnAnimationEnd,
    fidxToOnClick,
  }
}

export function useFloorImageUrl(idx: number): undefined | string {
  const urls = useFloorsContext((context) => context.urls)

  return urls.get(idx)
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
${animation}
`
}

function idxToStyle(
  fidx: number,
  prevFidx: null | number,
  loading: boolean,
  idx: number
) {
  return idx == fidx
    ? loading
      ? hidden(idx)
      : appearing(idx)
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
  animation: xxx-disappearing ${floor_switch_duration} linear;
}
`
}

function appearing(idx: number) {
  return `
.fidx-${idx} {
  will-change: opacity;
  animation: xxx-appearing ${floor_switch_duration} linear;
}
`
}

const animation = `
@keyframes xxx-disappearing {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
@keyframes xxx-appearing {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
`
