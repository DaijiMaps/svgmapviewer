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

////

export type StyleEvent =
  | { type: 'STYLE.LAYOUT'; layout: Layout }
  | { type: 'STYLE.DRAGGING'; dragging: boolean }

interface StyleContext {
  layout: Layout
  dragging: boolean
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
