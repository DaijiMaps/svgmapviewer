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
  changing: number[]
  changed: number[]
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
    changing: [],
    changed: [],
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
              makeSet([context.fidx, event.fidx]),
            changed: [],
          }),
          target: 'Animating',
        },
      },
    },
    Animating: {
      on: {
        DONE: {
          actions: assign({
            fidx: ({ context: { fidx, newFidx } }) =>
              newFidx === null ? fidx : newFidx,
            oldFidx: null,
            newFidx: null,
            changing: [],
            changed: [],
          }),
          target: 'Idle',
        },
      },
    },
  },
})

function makeSet(xs: number[]): number[] {
  return Array.from(new Set(xs))
}

function addSet(xs: number[], x: number): number[] {
  const s = new Set(xs)
  return Array.from(s.add(x))
}

function compareSet(xs: number[], ys: number[]): boolean {
  const sxs = new Set(xs)
  const sys = new Set(ys)
  return sxs.difference(sys).size === 0
}

const floorsActor = createActor(floorsMachine, {
  input: { fidx: svgMapViewerConfig.floorsConfig?.fidx ?? 0 },
  /*
  inspect: (iev) =>
    console.log(
      iev.type,
      JSON.stringify(iev?.event),
      JSON.stringify(iev?.snapshot?.context),
      iev
    ),
    */
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
