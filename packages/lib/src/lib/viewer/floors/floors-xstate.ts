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

export const currentFidxAtom: Atom<number> = createAtom(0)
export const urlsAtom: Atom<Map<number, string>> = createAtom(new Map())

const floorsMachine = setup({
  types: {
    context: {} as FloorsContext,
    events: {} as FloorsEvents,
    emitted: {} as FloorsEmits,
  },
  actions: {
    init: assign({
      nurls: (_, { floorsConfig }: Init) => floorsConfig.floors.length,
      fidx: (_, { floorsConfig }: Init) => floorsConfig.initialFidx,
    }),
    load: assign({
      urls: ({ context }, { idx }: { idx: number }) =>
        new Set(context.urls.add(idx)),
    }),
    updateInit: () => updateFloorRefsInit(),
    emitInitDone: emit((_, params: Init) => ({ ...params, type: 'INIT.DONE' })),
    updateLoad: ({ context: { fidx } }) => updateFloorRefsLoad(fidx),
    updateSwitch: ({ context: { fidx, prevFidx } }) =>
      updateFloorRefsSwitch(fidx, prevFidx),
    saveFidx: ({ context: { fidx } }) => currentFidxAtom.set(fidx),
    saveUrl: (_, { idx, url }: { idx: number; url: string }) =>
      urlsAtom.set((prev) => new Map(prev.set(idx, url))),
    select: assign({
      fidx: (_, { idx }: { idx: number }) => idx,
      prevFidx: ({ context }) => context.fidx,
    }),
    selectDone: assign({
      prevFidx: null,
    }),
    notifyLock: emit((_, { idx }: { idx: number }) => ({
      type: 'LOCK',
      idx,
    })),
    notifySelectDoneu: emit((_, { idx }: { idx: number }) => ({
      type: 'SELECT.DONE',
      idx,
    })),
  },
}).createMachine({
  id: 'floors1',
  context: {
    nurls: 0,
    urls: new Set(),
    fidx: 0,
    prevFidx: null,
  },
  initial: 'Uninited',
  on: {
    'ANIMATION.END': {
      guard: ({ context, event }) => context.fidx === event.idx,
      actions: {
        type: 'notifySelectDoneu',
        params: ({ event }) => event,
      },
    },
    CLICK: {
      guard: ({ context, event }) =>
        !(context.prevFidx !== null || context.fidx === event.idx),
      actions: {
        type: 'notifyLock',
        params: ({ event }) => event,
      },
    },
  },
  states: {
    Uninited: {
      on: {
        INIT: {
          actions: [
            { type: 'init', params: ({ event }) => event },
            'saveFidx',
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
          actions: [
            {
              type: 'load',
              params: ({ event }) => event,
            },
            {
              type: 'saveUrl',
              params: ({ event: { idx, url } }) => ({ idx, url }),
            },
          ],
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
          guard: ({ context, event }) => context.fidx !== event.idx,
          actions: [
            {
              type: 'select',
              params: ({ event }) => event,
            },
            'saveFidx',
            'updateSwitch',
          ],
          target: 'Animating',
        },
        'LEVEL.UP': [
          {
            guard: ({ context }) => context.fidx === context.nurls - 1,
          },
          {
            actions: {
              type: 'notifyLock',
              params: ({ context }) => ({ idx: context.fidx + 1 }),
            },
          },
        ],
        'LEVEL.DOWN': [
          {
            guard: ({ context }) => context.fidx === 0,
          },
          {
            actions: {
              type: 'notifyLock',
              params: ({ context }) => ({ idx: context.fidx - 1 }),
            },
          },
        ],
      },
    },
    Animating: {
      on: {
        // XXX receive one DONE event
        // XXX (receiving two without race is difficult/complex)
        'SELECT.DONE': {
          actions: ['selectDone', 'updateSwitch'],
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
floorsActor.on('LOCK', ({ idx }) => notifyFloor.lock(idx))
floorsActor.on('SELECT.DONE', ({ idx }) => notifyFloor.selectDone(idx))

export function floorsActorStart(): void {
  floorsActor.start()
}

export function useFloorsContext<T>(f: (ctx: Readonly<FloorsContext>) => T): T {
  return useSelector(floorsActor, (state) => f(state.context))
}

export function floorsSend(ev: FloorsEvents): void {
  floorsActor.send(ev)
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
      floorsActor.send({
        type: 'IMAGE',
        idx: fidx,
        url: URL.createObjectURL(blob),
      })
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
  floorCbs.select.add((idx: number) =>
    floorsActor.send({ type: 'SELECT', idx })
  )
  floorCbs.levelUp.add(() => floorsActor.send({ type: 'LEVEL.UP' }))
  floorCbs.levelDown.add(() => floorsActor.send({ type: 'LEVEL.DOWN' }))
  floorCbs.selectDone.add((idx: number) =>
    floorsActor.send({ type: 'SELECT.DONE', idx })
  )
}
