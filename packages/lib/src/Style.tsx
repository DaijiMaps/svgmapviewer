/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-throw-statements */
import { useSelector } from '@xstate/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { assign, createActor, setup, StateFrom } from 'xstate'
import './index.css'
import { Layout } from './lib'
import { fromSvgToOuter } from './lib/coord'
import { cssMatrixToString, fixupCssString } from './lib/css'
import { emptyLayout } from './lib/layout'

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
    </>
  )
}

function LayoutStyle() {
  const layout = useSelector(
    styleActor,
    (state: Readonly<StyleState>) => state.context.layout
  )
  const { svg, svgOffset, svgScale } = layout
  const m = fromSvgToOuter({ svg, svgOffset, svgScale })
  const matrix = fixupCssString(cssMatrixToString(m))

  return (
    <style>{`
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

////

export type StyleEvent =
  | { type: 'STYLE.LAYOUT'; layout: Layout }
  | { type: 'STYLE.DRAGGING'; dragging: boolean }
  | { type: 'STYLE.MODE'; mode: string }

interface StyleContext {
  layout: Layout
  dragging: boolean
  mode: string
}

const styleMachine = setup({
  types: {
    events: {} as StyleEvent,
    context: {} as StyleContext,
  },
}).createMachine({
  id: 'style1',
  context: {
    layout: emptyLayout,
    dragging: false,
    mode: 'pointing',
  },
  initial: 'Idle',
  states: {
    Idle: {
      on: {
        'STYLE.LAYOUT': {
          actions: assign({
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
