import { useSelector } from '@xstate/react'
import { useMemo } from 'react'
import { svgMapViewerConfig as cfg } from './config'
import { fromSvgToOuter } from './coord'
import { cssMatrixToString } from './css'
import { Matrix } from './matrix'
import { matrixEmpty, matrixToString } from './matrix/prefixed'
import { openCloseIsVisible } from './openclose'
import {
  PointerRef,
  selectDragging,
  selectLayoutScroll,
  selectLayoutSvg,
  selectLayoutSvgOffset,
  selectLayoutSvgScale,
  selectMode,
  selectRendered,
} from './pointer-xstate'
import { selectOpenCloseDetail, UiRef } from './ui-xstate'

export function useMapHtmlMatrix(pointerRef: Readonly<PointerRef>) {
  const svgOffset = useSelector(pointerRef, selectLayoutSvgOffset)
  const svgScale = useSelector(pointerRef, selectLayoutSvgScale)
  const svg = useSelector(pointerRef, selectLayoutSvg)
  const m = useMemo(
    () => fromSvgToOuter({ svg, svgOffset, svgScale }),
    [svg, svgOffset, svgScale]
  )
  return m
}

export function useMapHtmlStyle(pointerRef: Readonly<PointerRef>) {
  const m = useMapHtmlMatrix(pointerRef)
  return `
.content.html {
  transform: ${cssMatrixToString(m)};
}
`
}

export function useInitStyle(pointerRef: Readonly<PointerRef>) {
  const rendered = useSelector(pointerRef, selectRendered)

  return !rendered
    ? `
.container {
  opacity: 0;
}`
    : `
.container {
  transition: opacity 1s;
  opacity: 1;
}
`
}

export function useScrollStyle(pointerRef: Readonly<PointerRef>) {
  const scroll = useSelector(pointerRef, selectLayoutScroll)

  return `
.content {
  width: ${scroll.width}px;
  height: ${scroll.height}px;
}
`
}

export function useModeStyle(
  pointerRef: Readonly<PointerRef>,
  uiRef: Readonly<UiRef>
) {
  const mode = useSelector(pointerRef, selectMode)
  const detail = useSelector(uiRef, selectOpenCloseDetail)

  return mode === 'pointing' || openCloseIsVisible(detail)
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
.container {
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
