/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-throw-statements */
import { useActor } from '@xstate/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { assign, setup, StateFrom } from 'xstate'
import './index.css'

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
  const [state] = useActor(styleMachine, {
    systemId: 'system-style1',
  })
  const { scroll } = state.context

  return (
    <>
      <style id="style-scroll">{scroll}</style>
    </>
  )
}

////

export type StyleEvent = { type: 'STYLE.SCROLL'; scroll: string }

interface StyleContext {
  scroll: string
}

const styleMachine = setup({
  types: {
    events: {} as StyleEvent,
    context: {} as StyleContext,
  },
}).createMachine({
  id: 'style1',
  context: {
    scroll: '',
  },
  initial: 'Idle',
  states: {
    Idle: {
      on: {
        'STYLE.SCROLL': {
          actions: assign({
            scroll: ({ event }) => event.scroll,
          }),
        },
      },
    },
  },
})

export type StyleMachine = typeof styleMachine
export type StyleState = StateFrom<StyleMachine>
