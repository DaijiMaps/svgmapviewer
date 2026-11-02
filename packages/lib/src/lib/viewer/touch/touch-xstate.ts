import { useSelector } from '@xstate/react'
import { createAtom, type Atom } from '@xstate/store'
import { and, assign, createActor, emit, raise, setup } from 'xstate'

import { actionCbs } from '../../event-action'
import { scrollCbs } from '../../event-scroll'
import { notifyTouch } from '../../event-touch'
import {
  handleTouchEnd,
  handleTouchMove,
  handleTouchStart,
  resetTouches,
} from './touch'
import {
  type TouchContext_,
  type TouchEmit_,
  type TouchEvent_,
  type TouchTags_,
} from './touch-types'

export const touchLock: Atom<boolean> = createAtom<boolean>(false)

const touchMachine = setup({
  types: {
    context: {} as TouchContext_,
    events: {} as TouchEvent_,
    emitted: {} as TouchEmit_,
    tags: {} as TouchTags_,
  },
  guards: {
    isAllEnding: ({ context: { touches } }) => touches.vecs.size === 0,
    isSingleTouching: ({ context: { touches } }) => touches.vecs.size === 1,
    isDoubleTouching: ({ context: { touches } }) => touches.vecs.size === 2,
    isManyTouching: ({ context: { touches } }) => touches.vecs.size > 2,
    isZooming: ({ context: { touches } }) => touches.z !== null,
    isModeIdle: ({ context: { mode } }) => mode === 'idle',
    isModePanning: ({ context: { mode } }) => mode === 'pan',
    isModePinching: ({ context: { mode } }) => mode === 'pinch',
    isScrolling: ({ context: { scrolling } }) => scrolling,
  },
  actions: {
    updateTouches: assign({
      touches: ({ context: { touches }, event }) =>
        event.type === 'TOUCH.START'
          ? handleTouchStart(touches, event.ev)
          : event.type === 'TOUCH.MOVE'
            ? handleTouchMove(touches, event.ev, 0)
            : event.type === 'TOUCH.END'
              ? handleTouchEnd(touches, event.ev)
              : touches,
    }),
    raiseOp: raise(({ event }) =>
      event.type === 'TOUCH.START'
        ? { type: 'STARTED' }
        : event.type === 'TOUCH.MOVE'
          ? { type: 'MOVED' }
          : event.type === 'TOUCH.END'
            ? { type: 'ENDED' }
            : { type: 'NONE' }
    ),
    resetTouches: assign({
      mode: 'idle',
      touches: () => resetTouches(),
      center: null,
      scale: null,
    }),
    enterPan: assign({
      mode: 'pan',
      center: null,
      scale: null,
    }),
    enterPinch: assign({
      mode: 'pinch',
      center: ({ context }) => context.touches.cursor,
    }),
    emitMulti: emit(({ context: { touches, center, scale } }): TouchEmit_ => ({
      type: 'MULTI',
      touches,
      center,
      scale,
    })),
    emitZoom: emit(({ context: { touches } }) => ({
      type: 'ZOOM',
      touches,
    })),
    emitZoomSync: emit(({ context: { touches, center } }) => ({
      type: 'ZOOM.SYNC',
      touches,
      center,
    })),
    emitZoomSyncDone: emit(({ context: { touches } }) => ({
      type: 'ZOOM.SYNC',
      touches,
      center: null,
      end: true,
    })),
    saveScale: assign({
      scale: ({ context: { touches } }) => {
        const d0 = touches.dists[touches.dists.length - 1]
        const d = touches.dists[0]
        const s = d / d0
        return s
      },
    }),
    setScroll: assign({
      scrolling: true,
    }),
    clearScroll: assign({
      scrolling: false,
    }),
    lock: () => touchLock.set(() => true),
    unlock: () => touchLock.set(() => false),
  },
}).createMachine({
  id: 'touch1',
  initial: 'Idle',
  context: {
    mode: 'idle',
    touches: {
      vecs: new Map(),
      points: [],
      cursor: null,
      dists: [],
      z: null,
      horizontal: null,
    },
    active: true,
    center: null,
    scale: null,
    scrolling: false,
  },
  on: {
    'TOUCH.START': {
      actions: ['updateTouches', 'raiseOp'],
    },
    'TOUCH.MOVE': {
      actions: ['updateTouches', 'raiseOp'],
    },
    'TOUCH.END': {
      actions: ['updateTouches', 'raiseOp'],
    },
  },
  states: {
    Resetting: {
      after: {
        100: {
          actions: 'unlock',
          target: 'Idle',
        },
      },
    },
    Idle: {
      tags: 'none',
      entry: ['resetTouches', 'clearScroll'],
      on: {
        STARTED: [
          {
            guard: 'isSingleTouching',
            target: 'SingleTouching',
          },
          {
            guard: 'isDoubleTouching',
            target: 'DoubleTouching',
          },
          {
            guard: 'isManyTouching',
            target: 'ManyTouching',
          },
        ],
        //MOVED: {},
        //ENDED: [],
      },
    },
    SingleTouching: {
      tags: 'single',
      entry: 'enterPan',
      on: {
        STARTED: [
          {
            guard: and(['isModePanning', 'isDoubleTouching', 'isScrolling']),
            // skip emitMulti
            target: 'DoubleTouching',
          },
          {
            guard: and(['isModePanning', 'isDoubleTouching']),
            actions: 'emitMulti',
            target: 'DoubleTouching',
          },
          {
            guard: 'isManyTouching',
            target: 'ManyTouching',
          },
        ],
        MOVED: {
          guard: 'isModeIdle',
          actions: 'enterPan',
        },
        ENDED: [
          {
            guard: 'isAllEnding',
            target: 'Resetting',
          },
        ],
        CANCEL: {
          target: 'Canceling',
        },
        SCROLL: {
          actions: 'setScroll',
        },
      },
    },
    DoubleTouching: {
      tags: 'double',
      entry: ['enterPinch', 'lock'],
      on: {
        STARTED: [
          {
            guard: and(['isManyTouching']),
            target: 'ManyTouching',
          },
        ],
        MOVED: [
          {
            guard: 'isScrolling',
          },
          {
            guard: and(['isModePinching']),
            actions: ['saveScale', 'emitZoomSync'],
          },
        ],
        ENDED: [
          {
            guard: and(['isAllEnding', 'isScrolling']),
            //actions: ['emitZoomSyncDone', 'emitMulti'],
            target: 'Resetting',
          },
          {
            guard: and(['isSingleTouching', 'isScrolling']),
            //actions: ['emitZoomSyncDone', 'emitMulti'],
            target: 'SingleTouching',
          },
          {
            guard: 'isAllEnding',
            actions: ['emitZoomSyncDone', 'emitMulti'],
            target: 'Resetting',
          },
          {
            guard: 'isSingleTouching',
            actions: ['emitZoomSyncDone', 'emitMulti'],
            target: 'SingleTouching',
          },
        ],
        CANCEL: {
          target: 'Canceling',
        },
      },
    },
    ManyTouching: {
      tags: 'many',
      on: {
        //STARTED: [],
        //MOVED: {},
        ENDED: [
          {
            guard: 'isAllEnding',
            target: 'Resetting',
          },
          {
            guard: 'isSingleTouching',
            target: 'SingleTouching',
          },
          {
            guard: 'isDoubleTouching',
            target: 'DoubleTouching',
          },
        ],
        CANCEL: {
          target: 'Canceling',
        },
      },
    },
    Canceling: {
      tags: 'cancel',
      on: {
        //STARTED: [],
        //MOVED: {},
        ENDED: [
          {
            //guard: 'isAllEnding',
            target: 'Resetting',
          },
        ],
      },
    },
  },
})

////

const touchActor = createActor(touchMachine)

export function touchActorStart(): void {
  touchActor.start()
}

export function useTouchContext(): TouchContext_ {
  return useSelector(touchActor, (s) => s.context)
}

/*
export function useTouchTags(): {
  none: boolean
  single: boolean
  double: boolean
  many: boolean
  cancel: boolean
} {
  const none = useSelector(touchActor, (s) => s.hasTag('none'))
  const single = useSelector(touchActor, (s) => s.hasTag('single'))
  const double = useSelector(touchActor, (s) => s.hasTag('double'))
  const many = useSelector(touchActor, (s) => s.hasTag('many'))
  const cancel = useSelector(touchActor, (s) => s.hasTag('cancel'))
  return {
    none,
    single,
    double,
    many,
    cancel,
  }
}
*/

export let touching: boolean = false

touchActor.on('MULTI', ({ touches, center, scale }) => {
  if (touches.vecs.size === 2) {
    touching = true
    notifyTouch.multiStart()
  } else {
    // XXX only when viewer is in Touching
    const p = center === null ? undefined : center
    const s = scale === null ? undefined : scale
    notifyTouch.multiEnd({ p, s })
    touching = false
  }
})
touchActor.on('ZOOM', ({ touches }) => {
  const p = touches.cursor
  const z = touches.z
  if (p !== null && z !== null) {
    notifyTouch.zoom({ z: z > 0 ? 1 : -1, p })
  }
})
touchActor.on('ZOOM.SYNC', ({ touches, center, end }) => {
  if (end === true) {
    notifyTouch.zoom({ z: 1, p: null, sync: true })
  } else if (touches.dists.length > 1 && center !== null) {
    const p0 = center
    const d0 = touches.dists[touches.dists.length - 1]
    const d = touches.dists[0]
    const s = d / d0
    notifyTouch.zoom({ z: 1, p: p0, s, sync: true })
  }
})

////

export function touchSendTouchStart(ev: React.TouchEvent): void {
  touchActor.send({ type: 'TOUCH.START', ev })
}
export function touchSendTouchMove(ev: React.TouchEvent): void {
  touchActor.send({ type: 'TOUCH.MOVE', ev })
}
export function touchSendTouchEnd(ev: React.TouchEvent): void {
  touchActor.send({ type: 'TOUCH.END', ev })
}

function touchSendCancel(): void {
  touchActor.send({ type: 'CANCEL' })
}

function touchSendScrollTick(): void {
  touchActor.send({ type: 'SCROLL' })
}

export function touchCbsStart(): void {
  actionCbs.reset.add(touchSendCancel)
  actionCbs.fullscreen.add(touchSendCancel)
  actionCbs.position.add(touchSendCancel)
  actionCbs.recenter.add(touchSendCancel)
  actionCbs.zoomOut.add(touchSendCancel)
  actionCbs.zoomIn.add(touchSendCancel)
  scrollCbs.eventTick.add(touchSendScrollTick)
}

export function useTouchValue(): string {
  return useSelector(touchActor, (s) => JSON.stringify(s.value))
}

export function useTouchIsScrolling(): boolean {
  return useSelector(touchActor, (s) => s.context.scrolling)
}
