/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-throw-statements */
import { type ReactNode, StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { fromSvgToOuter } from './lib/coord'
import { cssMatrixToString, fixupCssString } from './lib/css'
import { useLayoutConfig, useLayoutSvgScaleS, useZoom } from './lib/map-xstate'
import {
  type MatrixMatrix as Matrix,
  matrixEmpty,
  matrixToString,
} from './lib/matrix/prefixed'
import { pointerSend } from './lib/pointer-xstate'
import {
  useAnimating,
  useAnimation,
  useDragging,
  useLayout,
  useMode,
  useRendered,
} from './lib/style-xstate'

export function styleRoot(): void {
  const e = document.getElementById('style-root')

  if (e === null) {
    throw new Error('#style-root not found!')
  }

  createRoot(e).render(
    <StrictMode>
      <Style />
    </StrictMode>
  )
}

function Style(): ReactNode {
  return (
    <style>
      <LayoutStyle />
      <DraggingStyle />
      <ModeStyle />
      <AnimationStyle />
      <SvgSymbolStyle />
    </style>
  )
}

function LayoutStyle(): ReactNode {
  const rendered = useRendered()
  const animating = useAnimating()
  const { svg, svgOffset, svgScale, scroll } = useLayout()
  const m = fromSvgToOuter({ svg, svgOffset, svgScale })
  const matrix = fixupCssString(cssMatrixToString(m))

  useEffect(() => {
    requestAnimationFrame(() => pointerSend({ type: 'RENDERED' }))
  }, [rendered])

  return (
    <>{`
/* layout */
.container { display: ${!rendered ? `none` : `initial`}; }
${!animating ? appearing_none : appearing}
.container > .content {
  width: ${scroll.width}px;
  height: ${scroll.height}px;
}
.container > .content.svg {
  --svg-viewbox: ${svg.x} ${svg.y} ${svg.width} ${svg.height};
}
.container > .content.html {
  --svg-matrix: ${matrix};
  --svg-scale: ${svgScale.s};
}
`}</>
  )
}

const appearing_none = `
.container {
  animation: none;
}
@keyframes container-appearing {
}
`
const appearing = `
.container {
  will-change: opacity;
  animation: container-appearing ${1000}ms ease;
}
@keyframes container-appearing {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
`

function DraggingStyle(): ReactNode {
  const dragging = useDragging()

  return (
    <>
      {!dragging
        ? ``
        : `
/* dragging */
.container {
  cursor: grabbing;
  overflow: scroll;
}
`}
    </>
  )
}

function ModeStyle(): ReactNode {
  const mode = useMode()
  return (
    <>
      {mode === 'pointing' || mode === 'locked'
        ? `
/* mode */
.container {
  --mode: ${mode};
}
`
        : `
/* mode */
.container {
  --mode: ${mode};
  cursor: move;
  overflow: scroll;
  will-change: scroll-position;
  touch-action: pan-x pan-y;
  transform: translate3d(0px, 0px, 0px);
}
`}
    </>
  )
}

function AnimationStyle(): ReactNode {
  const animation = useAnimation()
  const style =
    animation === null
      ? ''
      : animation.move !== null
        ? css(animation.move.q)
        : animation.zoom !== null
          ? css(animation.zoom.q)
          : ''
  return (
    <>
      {'/* animation */'}
      {style}
    </>
  )
}

function css(q: Matrix): string {
  return `
.container {
  will-change: transform;
  overflow: hidden;
  animation: container-zoom ${500}ms ease;
}
@keyframes container-zoom {
  from {
    transform-origin: left top;
    transform: ${matrixToString(matrixEmpty)} translate3d(0px, 0px, 0px);
  }
  to {
    transform-origin: left top;
    transform: ${matrixToString(q)} translate3d(0px, 0px, 0px);
  }
}
`
}

function SvgSymbolStyle(): ReactNode {
  const config = useLayoutConfig()
  const s = useLayoutSvgScaleS()
  const zoom = useZoom()
  const sz =
    config.fontSize *
    // display symbol slightly larger as zoom goes higher
    (0.5 + 0.5 * Math.log2(Math.max(1, zoom))) *
    s

  return (
    <>
      {`
.map-symbols {
  --map-symbol-size: ${sz / 72};
}
.map-markers {
}
`}
    </>
  )
}
