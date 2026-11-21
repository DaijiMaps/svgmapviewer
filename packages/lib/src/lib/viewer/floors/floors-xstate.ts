import { useSelector } from '@xstate/react'
import { createAtom, type Atom } from '@xstate/store'
import { assign, createActor, emit, setup } from 'xstate'

import type { SvgMapViewerConfig } from '../../../types'
import { floorCbs, notifyFloor } from '../../event-floor'
import { globalCbs } from '../../event-global'
import type {
  FloorsContext,
  FloorsEmits,
  FloorsEvents,
  Init,
} from './floors-types'
import type { FloorsWorker, Res } from './floors-worker-types'
import {
  updateFloorRefsInit,
  updateFloorRefsLoad,
  updateFloorRefsSwitch,
} from './style'

export const currentFidxAtom: Atom<number> = createAtom<number>(0)

const floorsMachine = setup({
  types: {
    context: {} as FloorsContext,
    events: {} as FloorsEvents,
    emitted: {} as FloorsEmits,
  },
  actions: {
    updateInit: () => updateFloorRefsInit(),
    emitInitDone: emit((_, params: Init) => ({ ...params, type: 'INIT.DONE' })),
    updateLoad: ({ context: { fidx } }) => updateFloorRefsLoad(fidx),
    updateSwitch: ({ context: { fidx, prevFidx } }) =>
      updateFloorRefsSwitch(fidx, prevFidx),
  },
}).createMachine({
  id: 'floors1',
  context: {
    nurls: 0,
    urls: new Map(),
    fidx: 0,
    prevFidx: null,
  },
  initial: 'Uninited',
  states: {
    Uninited: {
      on: {
        INIT: {
          actions: [
            assign({
              nurls: ({ event }) => event.floorsConfig.floors.length,
              fidx: ({ event }) => event.floorsConfig.initialFidx,
            }),
            ({ event }) => currentFidxAtom.set(event.floorsConfig.initialFidx),
            'updateInit',
            {
              type: 'emitInitDone',
              params: ({ event }) => event,
            },
          ],
          target: 'Loading',
        },
      },
    },
    Loading: {
      on: {
        IMAGE: {
          actions: assign({
            urls: ({ context, event: { fidx, url } }) =>
              // XXX when to call URL.revokeObjectURL?
              new Map(context.urls.set(fidx, url)),
          }),
          target: 'Loaded',
        },
      },
    },
    Loaded: {
      always: [
        {
          guard: ({ context }) => context.nurls === context.urls.size,
          actions: 'updateLoad',
          target: 'Idle',
        },
        'Loading',
      ],
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
            'updateSwitch',
          ],
          target: 'Animating',
        },
        'LEVEL.UP': [
          {
            guard: ({ context }) => context.fidx === context.nurls - 1,
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
          actions: [
            assign({
              prevFidx: null,
            }),
            'updateSwitch',
          ],
          target: 'Idle',
        },
      },
    },
  },
})

const floorsActor = createActor(floorsMachine)

floorsActor.on('INIT.DONE', ({ base, floorsConfig }) => {
  worker.postMessage({
    type: 'INIT',
    cfg: floorsConfig,
    base: base,
  })
})
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
      floorsActor.send({ type: 'IMAGE', fidx, url: URL.createObjectURL(blob) })
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
      floorsActor.send({
        type: 'INIT',
        base: cfg.base,
        floorsConfig: cfg.floorsConfig,
      })
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
