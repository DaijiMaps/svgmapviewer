import { useCallback } from 'react'
import { svgMapViewerConfig } from '../../config'
import { notifyFloorLock, notifyFloorSelectDone } from '../../event'
import { floor_switch_duration } from '../css'
import type {
  FidxToOnAnimationEnd,
  FidxToOnClick,
  FloorsContext,
} from './floors-types'
import { useFloorsContext } from './floors-xstate'

export function useFloors(): FloorsContext & {
  style: null | string
  fidxToOnAnimationEnd: FidxToOnAnimationEnd
  fidxToOnClick: FidxToOnClick
} {
  const { fidx, prevFidx } = useFloorsContext()

  const style = makeStyle(fidx, prevFidx)

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

  return { fidx, prevFidx, style, fidxToOnAnimationEnd, fidxToOnClick }
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
