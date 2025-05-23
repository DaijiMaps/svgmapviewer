/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-throw-statements */
import { useSelector } from '@xstate/react'
import { StrictMode } from 'react'
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
    <>
      <LayoutStyle />
      <DraggingStyle />
      <ModeStyle />
      <AnimationStyle />
      <SvgSymbolStyle />
    </>
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
  const layout = useSelector(
    styleActor,
    (state: Readonly<StyleState>) => state.context.layout
  )
  const { svg, svgOffset, svgScale, scroll } = layout
  const m = fromSvgToOuter({ svg, svgOffset, svgScale })
  const matrix = fixupCssString(cssMatrixToString(m))

  return (
    <style>{`
.container { display: ${!rendered ? `none` : `initial`}; }
${!animating ? appearing_none : appearing}
.container > .content {
  width: ${scroll.width}px;
  height: ${scroll.height}px;
}
.container > .content.html {
  --svg-matrix: ${matrix};
  --svg-scale: ${svgScale.s};
}
`}</style>
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
    <style>
      {!dragging
        ? ``
        : `
.container {
  cursor: grabbing;
  overflow: scroll;
}
`}
    </style>
  )
}

function ModeStyle() {
  const mode = useSelector(
    styleActor,
    (state: Readonly<StyleState>) => state.context.mode
  )
  return (
    <style>
      {mode === 'pointing' || mode === 'locked'
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
`}
    </style>
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
  return <style>{style}</style>
}

function css(q: Matrix) {
  return `
.container {
  will-change: transform;
  animation: container-zoom ${500}ms ease;
}
@keyframes container-zoom {
  from {
    transform-origin: left top;
    transform: ${matrixToString(matrixEmpty)};
  }
  to {
    transform-origin: left top;
    transform: ${matrixToString(q)};
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
    <style>
      {`
.map-symbols {
  --map-symbol-size: ${sz / 72};
}
.map-markers {
}
`}
    </style>
  )
}
