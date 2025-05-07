import { useSelector } from '@xstate/react'
import { svgMapViewerConfig as cfg } from './config'
import { Matrix } from './matrix'
import { matrixEmpty, matrixToString } from './matrix/prefixed'
import {
  PointerRef,
  selectDragging,
  selectLayoutScroll,
  selectMode,
} from './pointer-xstate'

export function useScrollStyle(pointerRef: Readonly<PointerRef>) {
  const scroll = useSelector(pointerRef, selectLayoutScroll)

  return `
.content {
  width: ${scroll.width}px;
  height: ${scroll.height}px;
}
`
}

export function useModeStyle(pointerRef: Readonly<PointerRef>) {
  const mode = useSelector(pointerRef, selectMode)

  return mode === 'pointing'
    ? `
.container {
}
`
    : `
.container {
  cursor: move;
  overflow: scroll;
  will-change: scroll-position;
  touch-action: pan-x pan-y;
}
`
}

export function useDragStyle(pointerRef: Readonly<PointerRef>) {
  const dragging = useSelector(pointerRef, selectDragging)

  return !dragging
    ? ``
    : `
.container {
  cursor: grabbing;
  overflow: scroll;
}
`
}

export function useMoveStyle(pointerRef: Readonly<PointerRef>) {
  const context = useSelector(pointerRef, (s) => s.context)
  const { animation } = context

  const pointer = pointerRef.getSnapshot()

  if (!pointer.matches({ Animator: 'Busy' })) {
    return ''
  }

  if (animation === null || animation.move === null) {
    return ''
  }

  // XXX
  return css(animation.move.q as Matrix)
}

export function useZoomStyle(pointerRef: Readonly<PointerRef>) {
  const context = useSelector(pointerRef, (s) => s.context)
  const { animation } = context

  const pointer = pointerRef.getSnapshot()

  if (!pointer.matches({ Animator: 'Busy' })) {
    return ''
  }

  if (animation === null || animation.zoom === null) {
    return ''
  }

  // XXX
  return css(animation.zoom.q as Matrix)
}

export const css = (q: Matrix) => {
  const p = matrixEmpty

  return `
.content {
  will-change: transform;
  animation: xxx ${cfg.animationDuration}ms ease;
}
.content > .poi {
/*
  display: none;
*/
}
@keyframes xxx {
  from {
    transform-origin: left top;
    transform: ${matrixToString(p)};
  }
  to {
    transform-origin: left top;
    transform: ${matrixToString(q)};
  }
}
`
}
