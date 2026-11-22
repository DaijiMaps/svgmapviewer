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
import {
  updateFloorRefsInit,
  updateFloorRefsLoad,
  updateFloorRefsSwitch,
} from './style'

export const fidxAtom: Atom<number> = createAtom(0)
export const urlsAtom: Atom<Map<number, string>> = createAtom(new Map())

const floorsMachine = setup({
  types: {
    context: {} as FloorsContext,
    events: {} as FloorsEvents,
    emitted: {} as FloorsEmits,
  },
  actions: {
    // assign
    init: assign({
      nurls: (_, { fcfg }: Init) => fcfg.floors.length,
      fidx: (_, { fcfg }: Init) => fcfg.initialFidx,
    }),
    load: assign({
      urls: ({ context }, { idx }: { idx: number }) =>
        new Set(context.urls.add(idx)),
    }),
    select: assign({
      fidx: (_, { idx }: { idx: number }) => idx,
      prevFidx: ({ context }) => context.fidx,
    }),
    selectDone: assign({
      prevFidx: null,
    }),
    // emit
    notifyInitDone: emit((_, params: Init) => ({
      ...params,
      type: 'INIT.DONE',
    })),
    notifyLock: emit((_, { idx }: { idx: number }) => ({
      type: 'LOCK',
      idx,
    })),
    notifySelectDone: emit((_, { idx }: { idx: number }) => ({
      type: 'SELECT.DONE',
      idx,
    })),
    // others
    saveFidx: ({ context: { fidx } }) => fidxAtom.set(fidx),
    saveUrl: (_, { idx, url }: { idx: number; url: string }) =>
      urlsAtom.set((prev) => new Map(prev.set(idx, url))),
    updateInit: () => updateFloorRefsInit(),
    updateLoad: ({ context: { fidx } }) => updateFloorRefsLoad(fidx),
    updateSwitch: ({ context: { fidx, prevFidx } }) =>
      updateFloorRefsSwitch(fidx, prevFidx),
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
    CLICK: {
      guard: ({ context, event }) =>
        !(context.prevFidx !== null || context.fidx === event.idx),
      actions: {
        type: 'notifyLock',
        params: ({ event }) => event,
      },
    },
    'LEVEL.UP': {
      guard: ({ context }) => context.fidx + 1 <= context.nurls - 1,
      actions: {
        type: 'notifyLock',
        params: ({ context }) => ({ idx: context.fidx + 1 }),
      },
    },
    'LEVEL.DOWN': {
      guard: ({ context }) => context.fidx - 1 >= 0,
      actions: {
        type: 'notifyLock',
        params: ({ context }) => ({ idx: context.fidx - 1 }),
      },
    },
    'ANIMATION.END': {
      guard: ({ context, event }) => context.fidx === event.idx,
      actions: {
        type: 'notifySelectDone',
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
              type: 'notifyInitDone',
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

floorsActor.on('INIT.DONE', ({ base, fcfg }) =>
  notifyFloor.init({ fcfg, base })
)
floorsActor.on('LOCK', ({ idx }) => {
  notifyFloor.lock(idx)
})
floorsActor.on('SELECT.DONE', ({ idx }) => {
  notifyFloor.selectDone(idx)
})

export function floorsActorStart(): void {
  floorsActor.start()
}

export function useFloorsContext<T>(f: (ctx: Readonly<FloorsContext>) => T): T {
  return useSelector(floorsActor, (state) => f(state.context))
}

export function floorsSend(ev: FloorsEvents): void {
  floorsActor.send(ev)
}

// handlers

export function floorsCbsStart(): void {
  globalCbs.init.add((cfg: Readonly<SvgMapViewerConfig>) => {
    if (cfg.floorsConfig) {
      floorsSend({
        type: 'INIT',
        fcfg: cfg.floorsConfig,
        base: cfg.base,
      })
    }
  })
  floorCbs.select.add((idx: number) => floorsSend({ type: 'SELECT', idx }))
  floorCbs.levelUp.add(() => floorsSend({ type: 'LEVEL.UP' }))
  floorCbs.levelDown.add(() => floorsSend({ type: 'LEVEL.DOWN' }))
  floorCbs.selectDone.add((idx: number) =>
    floorsSend({ type: 'SELECT.DONE', idx })
  )
}
