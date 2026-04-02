import { useSelector } from '@xstate/react'
import { and, assign, createActor, emit, raise, setup } from 'xstate'

import { actionCbs } from '../../event-action'
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
      touches: () => resetTouches(),
      mode: 'idle',
    }),
    enterPan: assign({
      mode: 'pan',
    }),
    enterPinch: assign({
      mode: 'pinch',
    }),
    emitMulti: emit(
      ({ context: { touches } }): TouchEmit_ => ({
        type: 'MULTI',
        touches,
      })
    ),
    emitZoom: emit(({ context: { touches } }) => ({
      type: 'ZOOM',
      touches,
    })),
  },
}).createMachine({
  id: 'touch1',
  initial: 'Idle',
  context: {
    touches: {
      vecs: new Map(),
      points: [],
      cursor: null,
      dists: [],
      z: null,
      horizontal: null,
    },
    mode: 'idle',
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
    CANCEL: {
      target: '.Canceling',
    },
  },
  states: {
    Idle: {
      tags: 'none',
      entry: 'resetTouches',
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
      on: {
        STARTED: [
          {
            guard: and(['isModeIdle', 'isDoubleTouching']),
            actions: 'enterPinch',
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
            target: 'Idle',
          },
        ],
      },
    },
    DoubleTouching: {
      tags: 'double',
      entry: 'emitMulti',
      exit: 'emitMulti',
      on: {
        STARTED: [
          {
            guard: and(['isManyTouching']),
            target: 'ManyTouching',
          },
        ],
        MOVED: {
          guard: and(['isModePinching', 'isZooming']),
          actions: 'emitZoom',
        },
        ENDED: [
          {
            guard: 'isAllEnding',
            target: 'Idle',
          },
          {
            guard: 'isSingleTouching',
            target: 'SingleTouching',
          },
        ],
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
            target: 'Idle',
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
            target: 'Idle',
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

touchActor.on('MULTI', ({ touches }) => {
  if (touches.vecs.size === 2) {
    touching = true
    notifyTouch.multiStart()
  } else {
    notifyTouch.multiEnd()
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

export function touchCbsStart(): void {
  actionCbs.reset.add(touchSendCancel)
  actionCbs.fullscreen.add(touchSendCancel)
  actionCbs.position.add(touchSendCancel)
  actionCbs.recenter.add(touchSendCancel)
  actionCbs.zoomOut.add(touchSendCancel)
  actionCbs.zoomIn.add(touchSendCancel)
}
