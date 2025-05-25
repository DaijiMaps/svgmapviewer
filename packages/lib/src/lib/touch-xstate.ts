import { ActorRefFrom, assign, enqueueActions, setup } from 'xstate'

import {
  handleTouchEnd,
  handleTouchMove,
  handleTouchStart,
  resetTouches,
  Touches,
} from './touch'
import { VecVec } from './vec/prefixed'

// XXX TouchEvent is DOM
type TouchEventStart = { type: 'TOUCH.START'; ev: React.TouchEvent }
type TouchEventMove = { type: 'TOUCH.MOVE'; ev: React.TouchEvent }
type TouchEventEnd = { type: 'TOUCH.END'; ev: React.TouchEvent }

type TouchEvent_ =
  | { type: 'CANCEL' }
  | TouchEventStart
  | TouchEventMove
  | TouchEventEnd
  | { type: 'STARTED' } // internal
  | { type: 'MOVED' } // internal
  | { type: 'ENDED' } // internal
type TouchEmit_ =
  | {
      type: 'EXPIRED'
      ev: React.TouchEvent
    }
  | { type: 'MULTI.START' }
  | { type: 'MULTI.END' }
  | { type: 'ZOOM'; p: VecVec; z: number }
type TouchContext_ = {
  touches: Touches
}

export const touchMachine = setup({
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
    handleTouchStart: enqueueActions(({ enqueue }) => {
      enqueue.assign({
        touches: ({ context: { touches }, event }) =>
          event.type !== 'TOUCH.START'
            ? touches
            : handleTouchStart(touches, event.ev),
      })
      enqueue.raise({ type: 'STARTED' })
    }),
    handleTouchMove: enqueueActions(({ enqueue }) => {
      enqueue.assign({
        touches: ({ context: { touches }, event }) =>
          event.type !== 'TOUCH.MOVE'
            ? touches
            : handleTouchMove(touches, event.ev, 0),
      })
      enqueue.raise({ type: 'MOVED' })
    }),
    handleTouchEnd: enqueueActions(({ enqueue }) => {
      enqueue.assign({
        touches: ({ context: { touches }, event }) =>
          event.type !== 'TOUCH.END'
            ? touches
            : handleTouchEnd(touches, event.ev),
      })
      enqueue.raise({ type: 'ENDED' })
    }),
    resetTouches: assign({
      touches: () => resetTouches(),
    }),
    notifyTouching: enqueueActions(({ enqueue, context }) =>
      enqueue.emit(
        context.touches.vecs.size === 2
          ? { type: 'MULTI.START' }
          : { type: 'MULTI.END' }
      )
    ),
    notifyZoom: enqueueActions(({ context, enqueue }) => {
      const p = context.touches.cursor
      const z = context.touches.z
      if (p !== null && z !== null) {
        enqueue.emit({ type: 'ZOOM', p, z })
      }
    }),
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
      actions: 'handleTouchStart',
    },
    'TOUCH.MOVE': {
      actions: 'handleTouchMove',
    },
    'TOUCH.END': {
      actions: 'handleTouchEnd',
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
        CANCEL: {
          target: 'Canceling',
        },
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
        CANCEL: {
          target: 'Canceling',
        },
      },
    },
    DoubleTouching: {
      entry: 'notifyTouching',
      exit: 'notifyTouching',
      on: {
        STARTED: [
          {
            guard: 'isManyTouching',
            target: 'ManyTouching',
          },
        ],
        MOVED: {
          guard: 'isZooming',
          actions: 'notifyZoom',
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
        CANCEL: {
          target: 'Canceling',
        },
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
        CANCEL: {
          target: 'Canceling',
        },
      },
    },
    Canceling: {
      on: {
        //STARTED: [],
        //MOVED: {},
        ENDED: [
          {
            guard: 'isAllEnding',
            target: 'Idle',
          },
        ],
      },
    },
  },
})

export type TouchRef = ActorRefFrom<typeof touchMachine>
