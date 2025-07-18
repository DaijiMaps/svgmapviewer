import { useSelector } from '@xstate/react'
import { useCallback } from 'react'
import { assign, createActor, setup } from 'xstate'
import { svgMapViewerConfig } from '../../config'
import {
  floorCbs,
  floorDoneCbs,
  notifyFloorDone,
  notifyFloorLock,
} from '../../event'

interface FloorsInput {
  fidx: number
}
interface FloorsContext {
  fidx: number
  oldFidx: null | number
  newFidx: null | number
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
          }),
          target: 'Animating',
        },
      },
    },
    Animating: {
      on: {
        // XXX receive one DONE event
        // XXX (receiving two without race is difficult/complex)
        DONE: {
          actions: assign({
            fidx: ({ context: { fidx, newFidx } }) =>
              newFidx === null ? fidx : newFidx,
            oldFidx: null,
            newFidx: null,
          }),
          target: 'Idle',
        },
      },
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

export type FidxToOnAnimationEnd = (idx: number) => undefined | (() => void)
export type FidxToOnClick = (idx: number) => undefined | (() => void)

export function useFloors(): FloorsContext & {
  fidxToOnAnimationEnd: FidxToOnAnimationEnd
  fidxToOnClick: FidxToOnClick
} {
  const context = useSelector(floorsActor, (state) => state.context)
  const animating = isAnimating(context.oldFidx, context.newFidx)

  const fidxToOnAnimationEnd: FidxToOnAnimationEnd = useCallback(
    (idx: number) =>
      idx === context.oldFidx || idx === context.newFidx
        ? () => notifyFloorDone(idx)
        : undefined,
    [context.newFidx, context.oldFidx]
  )

  const fidxToOnClick: FidxToOnClick = useCallback(
    (idx: number) =>
      animating ||
      isSelected(idx, context.fidx, context.oldFidx, context.newFidx)
        ? undefined
        : () => notifyFloorLock(idx),
    [animating, context.fidx, context.newFidx, context.oldFidx]
  )

  return { ...context, fidxToOnAnimationEnd, fidxToOnClick }
}

export function isAnimating(
  oldFidx: null | number,
  newFidx: null | number
): boolean {
  return oldFidx !== null || newFidx !== null
}

export function isSelected(
  idx: number,
  fidx: number,
  oldFidx: null | number,
  newFidx: null | number
): boolean {
  return oldFidx === null && newFidx === null ? idx === fidx : idx === newFidx
}
