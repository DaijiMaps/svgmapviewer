/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-throw-statements */
import { type ReactNode, StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BalloonStyle } from './Balloon'
import { FooterStyle } from './Footer'
import { HeaderStyle } from './Header'
import { diag } from './lib/diag'
import { useLayoutConfig, useLayoutSvgScaleS, useZoom } from './lib/map-xstate'
import {
  type MatrixMatrix as Matrix,
  matrixEmpty,
  matrixToString,
} from './lib/matrix/prefixed'
import {
  useAnimating,
  useAnimation,
  useDragging,
  useLayout,
  useMode,
  useRendered,
} from './lib/style-xstate'
import { useDetail } from './lib/ui-xstate'
import { trunc2 } from './lib/utils'
import { viewerSend } from './lib/viewer-xstate'
import { MeasurePath, MeasureStyle } from './Measure'
import { RightStyle } from './Right'
import { ShadowStyle } from './Shadow'

export function styleRoot(): void {
  const e = document.getElementById('style-root')

  if (e === null) {
    throw new Error('#style-root not found!')
  }

  createRoot(e).render(
    <StrictMode>
      <Style />
      <Defs />
    </StrictMode>
  )
}

function Style(): ReactNode {
  return (
    <>
      <LayoutStyle />
      <DraggingStyle />
      <ModeStyle />
      <AnimationStyle />
    </>
  )
}

function Defs(): ReactNode {
  return (
    <svg id="style-svg-defs">
      <defs>
        <MeasureDefs />
      </defs>
    </svg>
  )
}

function LayoutStyle(): ReactNode {
  const rendered = useRendered()
  const animating = useAnimating()
  const { scroll } = useLayout()

  useEffect(() => {
    requestAnimationFrame(() => viewerSend({ type: 'RENDERED' }))
  }, [rendered])

  return (
    <style>{`
/* layout */
.container, #ui { display: ${!rendered ? `none` : `initial`}; }
${!animating ? appearing_none : appearing}
.container > .content {
  width: ${trunc2(scroll.width)}px;
  height: ${trunc2(scroll.height)}px;
}
`}</style>
  )
}

const appearing_none = `
.container, #ui {
  animation: none;
}
@keyframes container-appearing {
}
`
const appearing = `
.container, #ui {
  will-change: opacity transform;
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
    <style>
      {!dragging
        ? ``
        : `
/* dragging */
.container {
  cursor: grabbing;
  overflow: scroll;
}
`}
    </style>
  )
}

// XXX .container should always have `transform: translate3d(0px, 0px, 0px);`
// XXX define this statically elsewhere

function ModeStyle(): ReactNode {
  const mode = useMode()
  return (
    <style>
      {mode === 'pointing' || mode === 'locked'
        ? `
/* mode */
.container {
  transform: translate3d(0px, 0px, 0px);
}
`
        : `
/* mode */
.container {
  cursor: move;
  overflow: scroll;
  will-change: scroll-position transform;
  touch-action: pan-x pan-y;
  transform: translate3d(0px, 0px, 0px);
}
`}
    </style>
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
    <style>
      {'/* animation */'}
      {style}
    </style>
  )
}

function css(q: Matrix): string {
  return `
.container {
  will-change: transform;
  /*
  overflow: hidden;
  */
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

export function SvgMarkerStyle(): ReactNode {
  return <></>
}

export function SvgSymbolStyle(): ReactNode {
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

function DetailStyle() {
  const detail = useDetail()

  const p = detail.p
  const layout = detail.layout

  const dir = diag(detail.layout.container, p)

  const W = layout.container.width
  const H = layout.container.height

  return <BalloonStyle _detail={detail} _p={p} _dir={dir} _W={W} _H={H} />
}

export function UiStyle(): ReactNode {
  return (
    <style>
      <DetailStyle />
      <MeasureStyle />
      <HeaderStyle />
      <RightStyle />
      <FooterStyle />
      <ShadowStyle />
    </style>
  )
}

function MeasureDefs() {
  return <MeasurePath />
}
