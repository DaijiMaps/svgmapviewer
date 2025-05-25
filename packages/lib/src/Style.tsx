/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-throw-statements */
import { useSelector } from '@xstate/react'
import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { fromSvgToOuter } from './lib/coord'
import { cssMatrixToString, fixupCssString } from './lib/css'
import {
  renderMapActor,
  selectLayoutConfig,
  selectLayoutSvgScaleS,
  selectZoom,
} from './lib/map-xstate'
import {
  MatrixMatrix as Matrix,
  matrixEmpty,
  matrixToString,
} from './lib/matrix/prefixed'
import { pointerActor } from './lib/pointer-react'
import { styleActor, StyleState } from './lib/style-xstate'

export function styleRoot() {
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

function Style() {
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

function LayoutStyle() {
  const rendered = useSelector(
    styleActor,
    (state: Readonly<StyleState>) => state.context.rendered
  )
  const animating = useSelector(
    styleActor,
    (state: Readonly<StyleState>) => state.context.animating
  )
  const { svg, svgOffset, svgScale, scroll } = useSelector(
    styleActor,
    (state: Readonly<StyleState>) => state.context.layout
  )
  const m = fromSvgToOuter({ svg, svgOffset, svgScale })
  const matrix = fixupCssString(cssMatrixToString(m))

  useEffect(() => {
    requestAnimationFrame(() => pointerActor.send({ type: 'RENDERED' }))
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

function DraggingStyle() {
  const dragging = useSelector(
    styleActor,
    (state: Readonly<StyleState>) => state.context.dragging
  )
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

function ModeStyle() {
  const mode = useSelector(
    styleActor,
    (state: Readonly<StyleState>) => state.context.mode
  )
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

function AnimationStyle() {
  const animation = useSelector(
    styleActor,
    (state: Readonly<StyleState>) => state.context.animation
  )
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

function css(q: Matrix) {
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

function SvgSymbolStyle() {
  const config = useSelector(renderMapActor, selectLayoutConfig)
  const s = useSelector(renderMapActor, selectLayoutSvgScaleS)
  const zoom = useSelector(renderMapActor, selectZoom)
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
