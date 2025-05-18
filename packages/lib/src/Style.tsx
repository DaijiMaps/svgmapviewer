/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-throw-statements */
import { useSelector } from '@xstate/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { assign, createActor, setup, StateFrom } from 'xstate'
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
  const matrix = useSelector(
    styleActor,
    (state: Readonly<StyleState>) => state.context.matrix
  )

  return (
    <>
      <style id="style-matrix">{`
.container > .content.html {
  --svg-matrix: ${matrix}
}
`}</style>
    </>
  )
}

////

export type StyleEvent = { type: 'STYLE.MATRIX'; matrix: string }

interface StyleContext {
  matrix: string
}

const styleMachine = setup({
  types: {
    events: {} as StyleEvent,
    context: {} as StyleContext,
  },
}).createMachine({
  id: 'style1',
  context: {
    matrix: 'scale(1)',
  },
  initial: 'Idle',
  states: {
    Idle: {
      on: {
        'STYLE.MATRIX': {
          actions: assign({
            matrix: ({ event }) => event.matrix,
          }),
        },
      },
    },
  },
})

export const styleActor = createActor(styleMachine, {
  systemId: 'system-pointer1',
  inspect: (iev) => console.log(iev),
})
styleActor.start()

export type StyleMachine = typeof styleMachine
export type StyleState = StateFrom<StyleMachine>
