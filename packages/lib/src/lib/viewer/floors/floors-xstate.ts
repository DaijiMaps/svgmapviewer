import { useSelector } from '@xstate/react'
import { createAtom, type Atom } from '@xstate/store'
import { assign, createActor, emit, setup } from 'xstate'

import type { SvgMapViewerConfig } from '../../../types'
import type { FloorsContext, FloorsEmits, FloorsEvents } from './floors-types'
import type { FloorsWorker, Res } from './floors-worker-types'

import { floorCbs, notifyFloor } from '../../event-floor'
import { globalCbs } from '../../event-global'

export const currentFidxAtom: Atom<number> = createAtom<number>(0)

const floorsMachine = setup({
  types: {
    context: {} as FloorsContext,
    events: {} as FloorsEvents,
    emitted: {} as FloorsEmits,
  },
}).createMachine({
  id: 'floors1',
  context: {
    nfloors: 0,
    blobs: new Map(),
    urls: new Map(),
    fidx: 0,
    prevFidx: null,
  },
  initial: 'Uninited',
  on: {
    IMAGE: {
      actions: assign({
        blobs: ({ context, event: { fidx, blob } }) =>
          new Map(context.blobs.set(fidx, blob)),
        urls: ({ context, event: { fidx, blob } }) =>
          // XXX when to call URL.revokeObjectURL?
          new Map(context.urls.set(fidx, URL.createObjectURL(blob))),
      }),
    },
  },
  states: {
    Uninited: {
      on: {
        INIT: {
          actions: [
            assign({
              nfloors: ({ event }) => event.nfloors,
              fidx: ({ event }) => event.fidx,
            }),
            ({ event }) => currentFidxAtom.set(event.fidx),
          ],
          target: 'Idle',
        },
      },
    },
    Idle: {
      on: {
        SELECT: {
          guard: ({ context, event }) => context.fidx !== event.fidx,
          actions: [
            assign({
              fidx: ({ event }) => event.fidx,
              prevFidx: ({ context }) => context.fidx,
            }),
            ({ event }) => currentFidxAtom.set(event.fidx),
          ],
          target: 'Animating',
        },
        'LEVEL.UP': [
          {
            guard: ({ context }) => context.fidx === context.nfloors - 1,
          },
          {
            actions: emit(({ context }) => ({
              type: 'LOCK',
              fidx: context.fidx + 1,
            })),
          },
        ],
        'LEVEL.DOWN': [
          {
            guard: ({ context }) => context.fidx === 0,
          },
          {
            actions: emit(({ context }) => ({
              type: 'LOCK',
              fidx: context.fidx - 1,
            })),
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

floorsActor.on('LOCK', ({ fidx }) => notifyFloor.lock(fidx))

export function floorsActorStart(): void {
  floorsActor.start()
}

export function useFloorsContext<T>(f: (ctx: Readonly<FloorsContext>) => T): T {
  return useSelector(floorsActor, (state) => f(state.context))
}

// worker

const worker: FloorsWorker = new Worker(
  new URL('./floors-worker.js', import.meta.url),
  { type: 'module' }
) as unknown as FloorsWorker

worker.onmessage = (e: Readonly<MessageEvent<Res>>): void => {
  const ev = e.data
  switch (ev.type) {
    case 'INIT.DONE': {
      break
    }
    case 'FETCH.DONE': {
      const { fidx, blob } = ev
      floorsActor.send({ type: 'IMAGE', fidx, blob })
      break
    }
  }
}

worker.onerror = (ev) => {
  console.error('floors error', ev)
}

worker.onmessageerror = (ev) => {
  console.error('floors messageerror', ev)
}

// handlers

export function floorsCbsStart(): void {
  globalCbs.init.add((cfg: Readonly<SvgMapViewerConfig>) => {
    if (cfg.floorsConfig) {
      const nfloors = cfg.floorsConfig.floors.length
      const fidx = cfg.floorsConfig.initialFidx
      floorsActor.send({ type: 'INIT', nfloors, fidx })
      worker.postMessage({ type: 'INIT', cfg: cfg.floorsConfig })
    }
  })
  floorCbs.select.add((fidx: number) =>
    floorsActor.send({ type: 'SELECT', fidx })
  )
  floorCbs.levelUp.add(() => floorsActor.send({ type: 'LEVEL.UP' }))
  floorCbs.levelDown.add(() => floorsActor.send({ type: 'LEVEL.DOWN' }))
  floorCbs.selectDone.add((fidx: number) =>
    floorsActor.send({ type: 'SELECT.DONE', fidx })
  )
}
