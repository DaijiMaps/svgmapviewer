import { useSelector } from '@xstate/react'
import { useMemo } from 'react'
import { svgMapViewerConfig as cfg } from './config'
import { fromSvgToOuter } from './coord'
import { cssMatrixToString, fixupCssString } from './css'
import { Matrix } from './matrix'
import { matrixEmpty, matrixToString } from './matrix/prefixed'
import { openCloseIsVisible } from './openclose'
import {
  PointerRef,
  selectAnimating,
  selectAnimation,
  selectDragging,
  selectLayoutScroll,
  selectLayoutSvg,
  selectLayoutSvgOffset,
  selectLayoutSvgScaleS,
  selectMode,
  selectRendered,
} from './pointer-xstate'
import { selectOpenCloseDetail, UiRef } from './ui-xstate'

export function useMapHtmlMatrix(pointerRef: Readonly<PointerRef>) {
  const svgOffset = useSelector(pointerRef, selectLayoutSvgOffset)
  const svgScaleS = useSelector(pointerRef, selectLayoutSvgScaleS)
  const svg = useSelector(pointerRef, selectLayoutSvg)
  const m = useMemo(
    () => fromSvgToOuter({ svg, svgOffset, svgScale: { s: svgScaleS } }),
    [svg, svgOffset, svgScaleS]
  )
  return { m, svgScaleS }
}

export function useMapHtmlStyle(pointerRef: Readonly<PointerRef>) {
  const { m, svgScaleS } = useMapHtmlMatrix(pointerRef)
  const style = useMemo(
    () => `
.content.html {
  --svg-matrix: ${fixupCssString(cssMatrixToString(m))};
  --svg-scale: ${svgScaleS};
}
`,
    [m, svgScaleS]
  )
  return style
}

export function useInitStyle(pointerRef: Readonly<PointerRef>) {
  const rendered = useSelector(pointerRef, selectRendered)
  const style = useMemo(
    () =>
      !rendered
        ? `
.container {
  opacity: 0;
}`
        : `
.container {
  transition: opacity 1s;
  opacity: 1;
}
`,
    [rendered]
  )

  return style
}

export function useScrollStyle(pointerRef: Readonly<PointerRef>) {
  const scroll = useSelector(pointerRef, selectLayoutScroll)

  const style = useMemo(
    () => `
.container > .content {
  width: ${scroll.width}px;
  height: ${scroll.height}px;
}
`,
    [scroll]
  )
  return style
}

export function useModeStyle(
  pointerRef: Readonly<PointerRef>,
  uiRef: Readonly<UiRef>
) {
  const mode = useSelector(pointerRef, selectMode)
  const detail = useSelector(uiRef, selectOpenCloseDetail)
  const style = useMemo(
    () =>
      mode === 'pointing' || openCloseIsVisible(detail)
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
`,
    [mode, detail]
  )
  return style
}

export function useDragStyle(pointerRef: Readonly<PointerRef>) {
  const dragging = useSelector(pointerRef, selectDragging)

  const style = useMemo(
    () =>
      !dragging
        ? ``
        : `
.container {
  cursor: grabbing;
  overflow: scroll;
}
`,
    [dragging]
  )
  return style
}

export function useMoveStyle(pointerRef: Readonly<PointerRef>) {
  const animation = useSelector(pointerRef, selectAnimation)
  const animating = useSelector(pointerRef, selectAnimating)

  const style = useMemo(
    () =>
      animation === null || animation.move === null || !animating
        ? ''
        : css(animation.move.q as Matrix),
    [animation, animating]
  )
  return style
}

export function useZoomStyle(pointerRef: Readonly<PointerRef>) {
  const animation = useSelector(pointerRef, selectAnimation)
  const animating = useSelector(pointerRef, selectAnimating)

  const style = useMemo(
    () =>
      animation === null || animation.zoom === null || !animating
        ? ''
        : css(animation.zoom.q as Matrix),
    [animation, animating]
  )
  return style
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
