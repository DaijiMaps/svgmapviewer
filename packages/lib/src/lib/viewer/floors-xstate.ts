import { useSelector } from '@xstate/react'
import { assign, createActor, setup } from 'xstate'
import { svgMapViewerConfig } from '../../config'
import { floorCbs, floorDoneCbs } from '../../event'

interface FloorsInput {
  fidx: number
}
interface FloorsContext {
  fidx: number
  oldFidx: null | number
  newFidx: null | number
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
    oldFidx: null,
    newFidx: null,
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
            oldFidx: ({ context }) => context.fidx,
            newFidx: ({ event }) => event.fidx,
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
            fidx: ({ context: { fidx, newFidx } }) =>
              newFidx === null ? fidx : newFidx,
            oldFidx: null,
            newFidx: null,
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

export function floorsActorStart(): void {
  floorsActor.start()
}

floorsActorStart()

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
