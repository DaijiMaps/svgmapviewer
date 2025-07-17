/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
import { useSelector } from '@xstate/react'
import { assign, createActor, setup } from 'xstate'
import { svgMapViewerConfig } from '../../config'
import { floorCbs } from '../../event'

interface FloorsInput {
  fidx: number
}
interface FloorsContext {
  fidx: number
  prevFidx: null | number
  nextFidx: null | number
  animating: boolean
}

type Select = { type: 'SELECT'; fidx: number }
type FloorsEvents = Select

const floorsMachine = setup({
  types: {
    input: {} as FloorsInput,
    context: {} as FloorsContext,
    events: {} as FloorsEvents,
  },
}).createMachine({
  id: 'floors1',
  context: ({ input: { fidx } }) => ({
    fidx,
    prevFidx: null,
    nextFidx: null,
    animating: false,
  }),
  initial: 'Idle',
  on: {
    SELECT: {
      actions: assign({
        fidx: ({ event }) => event.fidx,
      }),
    },
  },
  states: {
    Idle: {},
    Animating: {},
    Done: {},
  },
})

const floorsActor = createActor(floorsMachine, {
  input: { fidx: svgMapViewerConfig.floorsConfig?.fidx ?? 0 },
})

floorsActor.start()

// handlers

function handleFloor(fidx: number): void {
  floorsActor.send({ type: 'SELECT', fidx })
}

floorCbs.add(handleFloor)

// selectors

export function useFloors(): FloorsContext {
  return useSelector(floorsActor, (state) => state.context)
}
