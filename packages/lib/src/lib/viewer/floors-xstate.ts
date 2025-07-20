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
import { floor_switch_duration } from '../css'

interface FloorsContext {
  fidx: number
  prevFidx: null | number
}

type Select = { type: 'SELECT'; fidx: number; force?: boolean }
type Done = { type: 'DONE'; fidx: number }
type FloorsEvents = Select | Done

const floorsMachine = setup({
  types: {
    context: {} as FloorsContext,
    events: {} as FloorsEvents,
  },
}).createMachine({
  id: 'floors1',
  context: {
    fidx: 0,
    prevFidx: null,
  },
  initial: 'Idle',
  states: {
    Idle: {
      on: {
        SELECT: [
          {
            guard: ({ event }) => event.force ?? false,
            actions: assign({
              fidx: ({ event }) => event.fidx,
            }),
          },
          {
            guard: ({ context, event }) => context.fidx !== event.fidx,
            actions: assign({
              fidx: ({ event }) => event.fidx,
              prevFidx: ({ context }) => context.fidx,
            }),
            target: 'Animating',
          },
        ],
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

const floorsActor = createActor(floorsMachine)

export function floorsActorStart(): void {
  floorsActor.start()
}

export function selectFloor(fidx: number): void {
  floorsActor.send({ type: 'SELECT', fidx, force: true })
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
  style: null | string
  fidxToOnAnimationEnd: FidxToOnAnimationEnd
  fidxToOnClick: FidxToOnClick
} {
  const { fidx, prevFidx } = useSelector(floorsActor, (state) => state.context)

  const style = makeStyle(fidx, prevFidx)

  // XXX receive only one (appearing) animationend event
  const fidxToOnAnimationEnd: FidxToOnAnimationEnd = useCallback(
    (idx: number) => (idx === fidx ? () => notifyFloorDone(idx) : undefined),
    [fidx]
  )

  const fidxToOnClick: FidxToOnClick = useCallback(
    (idx: number) =>
      prevFidx !== null || idx === fidx
        ? undefined
        : () => notifyFloorLock(idx),
    [fidx, prevFidx]
  )

  return { fidx, prevFidx, style, fidxToOnAnimationEnd, fidxToOnClick }
}

function makeStyle(fidx: number, prevFidx: null | number): null | string {
  const floorsConfig = svgMapViewerConfig.floorsConfig
  if (floorsConfig === undefined) {
    return null
  }
  const style = floorsConfig.floors
    .map((_, idx) =>
      idx === fidx || idx === prevFidx
        ? ``
        : `
.fidx-${idx} {
  display: none;
}
`
    )
    .join('')
  const animation =
    prevFidx === null
      ? ``
      : `
.fidx-${prevFidx} {
  will-change: opacity;
  animation: xxx-disappearing ${floor_switch_duration} linear;
}
.fidx-${fidx} {
  will-change: opacity;
  animation: xxx-appearing ${floor_switch_duration} linear;
}
@keyframes xxx-disappearing {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
@keyframes xxx-appearing {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
`
  return `
${style}
${animation}
`
}
