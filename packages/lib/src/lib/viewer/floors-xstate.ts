import { useSelector } from '@xstate/react'
import { assign, createActor, setup } from 'xstate'
import { floorCbs } from '../../event-floor'
import { globalCbs } from '../../event-global'
import type { SvgMapViewerConfig } from '../../types'
import type { FloorsContext, FloorsEvents } from './floors-types'

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
        'SELECT.DONE': {
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

export function useFloorsContext(): FloorsContext {
  return useSelector(floorsActor, (state) => state.context)
}

// handlers

export function floorsCbsStart(): void {
  globalCbs.init.add((cfg: Readonly<SvgMapViewerConfig>) => {
    if (cfg.floorsConfig) {
      const fidx = cfg.floorsConfig.fidx
      floorsActor.send({ type: 'SELECT', fidx, force: true })
    }
  })
  floorCbs.select.add((fidx: number) =>
    floorsActor.send({ type: 'SELECT', fidx })
  )
  floorCbs.selectDone.add((fidx: number) =>
    floorsActor.send({ type: 'SELECT.DONE', fidx })
  )
}
