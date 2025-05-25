import { ActorRefFrom, assign, enqueueActions, raise, setup } from 'xstate'

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
  | TouchEventStart
  | TouchEventMove
  | TouchEventEnd
  | { type: 'STARTED' }
  | { type: 'MOVED' }
  | { type: 'ENDED' }
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
  },
  actions: {
    handleTouchStart: assign({
      touches: ({ context: { touches }, event }) =>
        event.type !== 'TOUCH.START'
          ? touches
          : handleTouchStart(touches, event.ev),
    }),
    handleTouchMove: assign({
      touches: ({ context: { touches }, event }) =>
        event.type !== 'TOUCH.MOVE'
          ? touches
          : handleTouchMove(touches, event.ev, 0),
    }),
    handleTouchEnd: assign({
      touches: ({ context: { touches }, event }) =>
        event.type !== 'TOUCH.END'
          ? touches
          : handleTouchEnd(touches, event.ev),
    }),
    resetTouches: assign({
      touches: () => resetTouches(),
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
  type: 'parallel',
  on: {
    'TOUCH.START': {
      actions: ['handleTouchStart', raise({ type: 'STARTED' })],
    },
    'TOUCH.MOVE': {
      actions: ['handleTouchMove', raise({ type: 'MOVED' })],
    },
    'TOUCH.END': {
      actions: ['handleTouchEnd', raise({ type: 'ENDED' })],
    },
  },
  states: {
    Idle: {
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
        MOVED: {},
        ENDED: [
          {
            guard: 'isAllEnding',
            actions: 'resetTouches',
          },
        ],
      },
    },
    DoubleTouching: {
      on: {
        STARTED: [
          {
            guard: 'isManyTouching',
            target: 'ManyTouching',
          },
        ],
        MOVED: {
          guard: ({ context: { touches } }) => touches.z !== null,
          actions: enqueueActions(({ context, enqueue }) => {
            const p = context.touches.cursor
            const z = context.touches.z
            if (p !== null && z !== null) {
              enqueue.emit({ type: 'ZOOM', p, z })
            }
          }),
        },
        ENDED: [
          {
            guard: 'isSingleTouching',
            target: 'Idle',
          },
          {
            guard: 'isAllEnding',
            actions: 'resetTouches',
            target: 'Idle',
          },
        ],
      },
    },
    ManyTouching: {
      on: {
        STARTED: [],
        MOVED: [],
        ENDED: [
          {
            guard: 'isDoubleTouching',
            target: 'DoubleTouching',
          },
          {
            guard: 'isSingleTouching',
            target: 'Idle',
          },
          {
            guard: 'isAllEnding',
            actions: 'resetTouches',
            target: 'Idle',
          },
        ],
      },
    },
  },
})

export type TouchRef = ActorRefFrom<typeof touchMachine>
