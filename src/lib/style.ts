import { useSelector } from '@xstate/react'
import { svgMapViewerConfig } from './config'
import { Matrix } from './matrix'
import { matrixEmpty, matrixMatrix, matrixToString } from './matrix/prefixed'
import { PointerRef, PointerState } from './xstate-pointer'

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

export function moveStyle(pointer: Readonly<PointerState>) {
  const { animation } = pointer.context

  if (!pointer.matches({ Animator: 'Busy' })) {
    return ''
  }

  if (animation === null || animation.move === null) {
    return ''
  }

  // XXX immutability
  const [[a, b], [c, d], [e, f]] = animation.move.q

  return css(matrixMatrix(a, b, c, d, e, f))
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

  // XXX immutability
  const [[a, b], [c, d], [e, f]] = animation.zoom.q

  return css(matrixMatrix(a, b, c, d, e, f))
}

export const css = (q: Readonly<Matrix>) => {
  const p = matrixEmpty

  return `
.svg {
  will-change: transform;
  animation: xxx ${svgMapViewerConfig.animationDuration}ms ease;
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
