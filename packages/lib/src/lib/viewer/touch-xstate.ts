import { useSelector } from '@xstate/react'
import { assign, createActor, emit, raise, setup } from 'xstate'
import { actionCbs } from '../event-action'
import {
  notifyTouchMultiEnd,
  notifyTouchMultiStart,
  notifyTouchZoom,
} from '../event-touch'
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
} from './touch-types'

const touchMachine = setup({
  types: {
    context: {} as TouchContext_,
    events: {} as TouchEvent_,
    emitted: {} as TouchEmit_,
  },
  guards: {
    isAllEnding: ({ context: { touches } }) => touches.vecs.size === 0,
    isSingleTouching: ({ context: { touches } }) => touches.vecs.size === 1,
    isDoubleTouching: ({ context: { touches } }) => touches.vecs.size === 2,
    isManyTouching: ({ context: { touches } }) => touches.vecs.size > 2,
    isZooming: ({ context: { touches } }) => touches.z !== null,
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
    raiseStarted: raise({ type: 'STARTED' }),
    raiseMoved: raise({ type: 'MOVED' }),
    raiseEnded: raise({ type: 'ENDED' }),
    resetTouches: assign({
      touches: () => resetTouches(),
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
  },
  on: {
    'TOUCH.START': {
      actions: ['updateTouches', 'raiseStarted'],
    },
    'TOUCH.MOVE': {
      actions: ['updateTouches', 'raiseMoved'],
    },
    'TOUCH.END': {
      actions: ['updateTouches', 'raiseEnded'],
    },
    CANCEL: {
      target: '.Canceling',
    },
  },
  states: {
    Idle: {
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
      on: {
        STARTED: [
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
        ENDED: [
          {
            guard: 'isAllEnding',
            target: 'Idle',
          },
        ],
      },
    },
    DoubleTouching: {
      entry: 'emitMulti',
      exit: 'emitMulti',
      on: {
        STARTED: [
          {
            guard: 'isManyTouching',
            target: 'ManyTouching',
          },
        ],
        MOVED: {
          guard: 'isZooming',
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

export let touching: boolean = false

touchActor.on('MULTI', ({ touches }) => {
  if (touches.vecs.size === 2) {
    touching = true
    notifyTouchMultiStart()
  } else {
    notifyTouchMultiEnd()
    touching = false
  }
})
touchActor.on('ZOOM', ({ touches }) => {
  const p = touches.cursor
  const z = touches.z
  if (p !== null && z !== null) {
    notifyTouchZoom({ z: z > 0 ? 1 : -1, p })
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
