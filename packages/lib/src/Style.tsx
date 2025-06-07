/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-throw-statements */
import { type ReactNode, StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BalloonStyle } from './Balloon'
import { FooterStyle } from './Footer'
import { MeasurePath, MeasureStyle } from './Guides'
import { HeaderStyle } from './Header'
import { fixupCssString } from './lib/css'
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
  useSvgMatrix,
} from './lib/style-xstate'
import { useDetail } from './lib/ui-xstate'
import { viewerSend } from './lib/viewer-xstate'
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
    <style>
      <LayoutStyle />
      <DraggingStyle />
      <ModeStyle />
      <AnimationStyle />
    </style>
  )
}

function Defs(): ReactNode {
  return (
    <svg>
      <defs>
        <MeasureDefs />
      </defs>
    </svg>
  )
}

function LayoutStyle(): ReactNode {
  const rendered = useRendered()
  const animating = useAnimating()
  const { svg, svgScale, scroll } = useLayout()
  const svgMatrix = useSvgMatrix()
  const matrixString = fixupCssString(svgMatrix.toString())

  useEffect(() => {
    requestAnimationFrame(() => viewerSend({ type: 'RENDERED' }))
  }, [rendered])

  return (
    <>{`
/* layout */
.container, #ui { display: ${!rendered ? `none` : `initial`}; }
${!animating ? appearing_none : appearing}
.container > .content {
  width: ${scroll.width}px;
  height: ${scroll.height}px;
}
.container > .content.svg {
  --svg-viewbox: ${svg.x} ${svg.y} ${svg.width} ${svg.height};
}
.container > .content.html {
  --svg-matrix: ${matrixString};
  --svg-scale: ${svgScale.s};
}
`}</>
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
    <>
      <DetailStyle />
      <MeasureStyle />
      <HeaderStyle />
      <RightStyle />
      <FooterStyle />
      <ShadowStyle />
    </>
  )
}

function MeasureDefs() {
  return <MeasurePath />
}
