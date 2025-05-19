/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-throw-statements */
import { useSelector } from '@xstate/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { assign, createActor, setup, StateFrom } from 'xstate'
import './index.css'
import { Layout } from './lib'
import { Animation } from './lib/animation'
import { fromSvgToOuter } from './lib/coord'
import { cssMatrixToString, fixupCssString } from './lib/css'
import { emptyLayout } from './lib/layout'
import {
  MatrixMatrix as Matrix,
  matrixEmpty,
  matrixToString,
} from './lib/matrix/prefixed'

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
    </>
  )
}

function LayoutStyle() {
  const inited = useSelector(
    styleActor,
    (state: Readonly<StyleState>) => state.context.inited
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
.container {
  opacity: ${!inited ? 0 : 1};
  transition: opacity 1s;
}
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

////

export type StyleEvent =
  | { type: 'STYLE.LAYOUT'; layout: Layout }
  | { type: 'STYLE.DRAGGING'; dragging: boolean }
  | { type: 'STYLE.MODE'; mode: string }
  | { type: 'STYLE.ANIMATION'; animation: null | Animation } // null to stop animation

interface StyleContext {
  inited: boolean
  layout: Layout
  dragging: boolean
  mode: string
  animation: null | Animation
}

const styleMachine = setup({
  types: {
    events: {} as StyleEvent,
    context: {} as StyleContext,
  },
}).createMachine({
  id: 'style1',
  context: {
    inited: false,
    layout: emptyLayout,
    dragging: false,
    mode: 'pointing',
    animation: null,
  },
  initial: 'Idle',
  states: {
    Idle: {
      on: {
        'STYLE.LAYOUT': {
          actions: assign({
            inited: true,
            layout: ({ event }) => event.layout,
          }),
        },
        'STYLE.DRAGGING': {
          actions: assign({
            dragging: ({ event }) => event.dragging,
          }),
        },
        'STYLE.MODE': {
          actions: assign({
            mode: ({ event }) => event.mode,
          }),
        },
        'STYLE.ANIMATION': {
          actions: assign({
            animation: ({ event }) => event.animation,
          }),
        },
      },
    },
  },
})

export const styleActor = createActor(styleMachine, {
  systemId: 'system-pointer1',
})
styleActor.start()

export type StyleMachine = typeof styleMachine
export type StyleState = StateFrom<StyleMachine>
