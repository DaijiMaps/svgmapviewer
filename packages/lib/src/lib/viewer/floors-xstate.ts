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
  prevFidx: null | number
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
  }),
  initial: 'Idle',
  states: {
    Idle: {
      on: {
        SELECT: {
          guard: ({ context, event }) => context.fidx !== event.fidx,
          actions: assign({
            fidx: ({ event }) => event.fidx,
            prevFidx: ({ context }) => context.fidx,
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
            prevFidx: null,
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
  const { fidx, prevFidx } = useSelector(floorsActor, (state) => state.context)
  const animating = prevFidx !== null

  // XXX receive only one (appearing) animationend event
  const fidxToOnAnimationEnd: FidxToOnAnimationEnd = useCallback(
    (idx: number) => (idx === fidx ? () => notifyFloorDone(idx) : undefined),
    [fidx]
  )

  const fidxToOnClick: FidxToOnClick = useCallback(
    (idx: number) =>
      animating || idx === fidx ? undefined : () => notifyFloorLock(idx),
    [animating, fidx]
  )

  return { fidx, prevFidx, fidxToOnAnimationEnd, fidxToOnClick }
}
