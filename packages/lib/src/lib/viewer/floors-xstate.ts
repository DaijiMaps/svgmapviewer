import { useSelector } from '@xstate/react'
import { assign, createActor, setup } from 'xstate'
import type { SvgMapViewerConfig } from '../../types'
import { floorCbs } from '../event-floor'
import { globalCbs } from '../event-global'
import type { FloorsContext, FloorsEvents } from './floors-types'
import type { Res } from './floors-worker-types'

const floorsMachine = setup({
  types: {
    context: {} as FloorsContext,
    events: {} as FloorsEvents,
    // XXX emitted
  },
}).createMachine({
  id: 'floors1',
  context: {
    fidx: 0,
    prevFidx: null,
  },
  initial: 'Idle',
  // XXX handle image download event
  // XXX on: {},
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

export function useFloorsContext<T>(f: (ctx: Readonly<FloorsContext>) => T): T {
  return useSelector(floorsActor, (state) => f(state.context))
}

// worker

const worker: Worker = new Worker(
  new URL('./floors-worker.js', import.meta.url),
  {
    type: 'module',
  }
)

worker.onmessage = (e: Readonly<MessageEvent<Res>>): void => {
  const ev = e.data
  // XXX floorsActor.send()
  switch (ev.type) {
    case 'INIT.DONE':
      console.log(ev)
      break
  }
}

worker.onerror = (ev) => {
  console.error('floors error', ev)
}

worker.onmessageerror = (ev) => {
  console.error('floors messageerror', ev)
}

// XXX
// floorsActor.on(..., () => {
//   worker.postMessage()
// })

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
