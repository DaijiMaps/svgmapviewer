/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
import { useSelector } from '@xstate/react'
import { assign, createActor, setup } from 'xstate'
import { svgMapViewerConfig } from '../../config'
import { floorCbs, floorDoneCbs } from '../../event'

interface FloorsInput {
  fidx: number
}
interface FloorsContext {
  fidx: number
  prevFidx: null | number
  nextFidx: null | number
  animating: boolean
  changing: Set<number>
  changed: Set<number>
}

type Select = { type: 'SELECT'; fidx: number }
type Done = { type: 'DONE'; fidx: number }
type FloorsEvents = Select | Done

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
    changing: new Set(),
    changed: new Set(),
  }),
  initial: 'Idle',
  states: {
    Idle: {
      on: {
        SELECT: {
          guard: ({ context, event }) => context.fidx !== event.fidx,
          actions: assign({
            prevFidx: ({ context }) => context.fidx,
            nextFidx: ({ event }) => event.fidx,
            changing: ({ context, event }) =>
              new Set([context.fidx, event.fidx]),
            changed: new Set(),
          }),
          target: 'Animating',
        },
      },
    },
    Animating: {
      on: {
        DONE: {
          actions: assign({
            changed: ({ context, event }) => context.changed.add(event.fidx),
          }),
          target: 'Checking',
        },
      },
    },
    Checking: {
      always: [
        {
          guard: ({ context }) =>
            context.changing.difference(context.changed).size > 0,
          target: 'Animating',
        },
        {
          actions: assign({
            fidx: ({ context: { fidx, nextFidx } }) =>
              nextFidx === null ? fidx : nextFidx,
            prevFidx: null,
            nextFidx: null,
          }),
          target: 'Idle',
        },
      ],
    },
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
function handleFloorDone(fidx: number): void {
  floorsActor.send({ type: 'DONE', fidx })
}

floorCbs.add(handleFloor)
floorDoneCbs.add(handleFloorDone)

// selectors

export function useFloors(): FloorsContext {
  return useSelector(floorsActor, (state) => state.context)
}
