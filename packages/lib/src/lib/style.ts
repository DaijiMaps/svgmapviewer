import { useSelector } from '@xstate/react'
import { svgMapViewerConfig } from './config'
import { Matrix } from './matrix'
import { matrixEmpty, matrixToString } from './matrix/prefixed'
import { PointerRef, PointerState } from './pointer-xstate'

export function scrollStyle(pointer: Readonly<PointerState>) {
  const layout = pointer.context.layout

  return `
.content {
  width: ${layout.scroll.width}px;
  height: ${layout.scroll.height}px;
}
`
}

export function modeStyle(pointer: Readonly<PointerState>) {
  return pointer.context.mode === 'pointing'
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

export function dragStyle(pointer: Readonly<PointerState>) {
  if (!pointer.matches({ Pointer: 'Dragging' })) {
    return ''
  }

  return `
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
  animation: xxx ${svgMapViewerConfig.animationDuration}ms ease;
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
