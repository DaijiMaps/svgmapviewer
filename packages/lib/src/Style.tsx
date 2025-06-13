/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-throw-statements */
import { type ReactNode, StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { useLayoutConfig, useLayoutSvgScaleS, useZoom } from './lib/map-xstate'
import {
  type MatrixMatrix as Matrix,
  matrixEmpty,
  matrixToString,
} from './lib/matrix/prefixed'
import { useAnimation, useLayoutScroll, useRendered } from './lib/style-xstate'
import { trunc2 } from './lib/utils'
import { viewerSend } from './lib/viewer-xstate'

export function styleRoot(): void {
  const e = document.getElementById('style-root')

  if (e === null) {
    throw new Error('#style-root not found!')
  }

  createRoot(e).render(
    <StrictMode>
      <Style />
      <style>{style}</style>
    </StrictMode>
  )
}

const style = `
#style-svg-defs {
  display: none;
}
`

function Style(): ReactNode {
  return (
    <>
      <LayoutStyle />
    </>
  )
}

export function ContainerStyle(): ReactNode {
  return (
    <>
      <AnimationStyle />
    </>
  )
}

function LayoutStyle(): ReactNode {
  const rendered = useRendered()
  const scroll = useLayoutScroll()

  useEffect(() => {
    requestAnimationFrame(() => viewerSend({ type: 'RENDERED' }))
  }, [rendered])

  const style = `
/* layout */
${!rendered ? `#viewer, #ui { display: none; }` : ``}
.content {
  width: ${trunc2(scroll.width)}px;
  height: ${trunc2(scroll.height)}px;
}
`

  return <style>{style}</style>
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
  return <style>{style}</style>
}

function css(q: Matrix): string {
  return `
#viewer {
  will-change: transform;
  animation: container-zoom ${500}ms ease;
  --matrix-a: ${matrixToString(matrixEmpty)};
  --matrix-b: ${matrixToString(q)};
}
@keyframes container-zoom {
  from {
    transform-origin: left top;
    transform: var(--matrix-a) translate3d(0px, 0px, 0px);
  }
  to {
    transform-origin: left top;
    transform: var(--matrix-b) translate3d(0px, 0px, 0px);
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

  const style = `
use,
.map-symbols,
.map-markers {
  --map-symbol-size: ${sz / 72};
}
`

  return <>{style}</>
}
