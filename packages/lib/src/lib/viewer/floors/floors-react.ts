import { useCallback, useMemo } from 'react'
import { svgMapViewerConfig } from '../../../config'
import { floor_switch_duration } from '../../css'
import { notifyFloorLock, notifyFloorSelectDone } from '../../event-floor'
import type { FidxToOnAnimationEnd, FidxToOnClick } from './floors-types'
import { useFloorsContext } from './floors-xstate'

export function useFloors(): {
  fidx: number
  prevFidx: null | number
  style: null | string
  fidxToOnAnimationEnd: FidxToOnAnimationEnd
  fidxToOnClick: FidxToOnClick
} {
  const { fidx, prevFidx } = useFloorsContext(({ fidx, prevFidx }) => ({
    fidx,
    prevFidx,
  }))

  const style = useMemo(() => makeStyle(fidx, prevFidx), [fidx, prevFidx])

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

function makeStyle(fidx: number, prevFidx: null | number): null | string {
  const floorsConfig = svgMapViewerConfig.floorsConfig
  if (floorsConfig === undefined) {
    return null
  }
  const style = floorsConfig.floors
    .map((_, idx) =>
      idx === fidx || idx === prevFidx
        ? ``
        : `
.fidx-${idx} {
  visibility: hidden;
}
`
    )
    .join('')
  const animation =
    prevFidx === null
      ? ``
      : `
.fidx-${prevFidx} {
  will-change: opacity;
  animation: xxx-disappearing ${floor_switch_duration} linear;
}
.fidx-${fidx} {
  will-change: opacity;
  animation: xxx-appearing ${floor_switch_duration} linear;
}
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
  return `
${style}
${animation}
`
}
