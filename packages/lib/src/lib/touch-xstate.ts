import { ActorRefFrom, assign, emit, setup } from 'xstate'

import {
  handleTouchEnd,
  handleTouchMove,
  handleTouchStart,
  isMultiTouch,
  isMultiTouchEnding,
  Touches,
} from './touch'

// XXX TouchEvent is DOM
type TouchEvent_ =
  | {
      type: 'TOUCH.START'
      ev: TouchEvent
    }
  | {
      type: 'TOUCH.MOVE'
      ev: TouchEvent
    }
  | {
      type: 'TOUCH.END'
      ev: TouchEvent
    }
  | {
      type: 'TOUCH.CANCEL'
      ev: TouchEvent
    }
  | {
      type: 'START'
    }
  | {
      type: 'STOP'
    }
type TouchEmit_ =
  | {
      type: 'EXPIRED'
      ev: TouchEvent
    }
  | { type: 'MULTI.START' }
  | { type: 'MULTI.END' }
  | { type: 'ZOOM' }
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
    isMultiTouch: ({ context: { touches } }) => isMultiTouch(touches),
    isMultiTouchEnding: ({ context: { touches } }) =>
      isMultiTouchEnding(touches),
  },
  actions: {},
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
  states: {
    Handler: {
      on: {
        'TOUCH.START': {
          actions: [
            assign({
              touches: ({ context, event }) =>
                handleTouchStart(context.touches, event.ev),
            }),
            // XXX
          ],
        },
        'TOUCH.MOVE': {
          actions: [
            assign({
              touches: ({ context, event }) =>
                handleTouchMove(context.touches, event.ev, 0),
            }),
            // XXX
          ],
        },
        'TOUCH.END': {
          actions: [
            assign({
              touches: ({ context, event }) =>
                handleTouchEnd(context.touches, event.ev),
            }),
            // XXX
          ],
        },
      },
    },
    Monitor: {
      states: {
        Idle: {
          on: {
            'TOUCH.START': {
              actions: assign({
                touches: ({ context, event }) =>
                  handleTouchStart(context.touches, event.ev),
              }),
              target: 'SingleTouching',
            },
            'TOUCH.MOVE': {},
            'TOUCH.END': {},
            'TOUCH.CANCEL': {},
          },
        },
        SingleTouching: {
          on: {
            'TOUCH.START': {
              actions: assign({
                touches: ({ context, event }) =>
                  handleTouchStart(context.touches, event.ev),
              }),
              target: 'DoubleTouching',
            },
            'TOUCH.MOVE': {
              actions: assign({
                touches: ({ context, event }) =>
                  handleTouchMove(context.touches, event.ev, 0),
              }),
            },
            'TOUCH.END': {
              actions: assign({
                touches: ({ context, event }) =>
                  handleTouchEnd(context.touches, event.ev),
              }),
              target: 'Idle',
            },
            'TOUCH.CANCEL': {},
          },
        },
        DoubleTouching: {
          entry: emit({ type: 'MULTI.START' }),
          exit: emit({ type: 'MULTI.END' }),
          on: {
            'TOUCH.START': {},
            'TOUCH.MOVE': {
              actions: assign({
                touches: ({ context, event }) =>
                  handleTouchMove(context.touches, event.ev, 0),
              }),
            },
            'TOUCH.END': {
              actions: assign({
                touches: ({ context, event }) =>
                  handleTouchEnd(context.touches, event.ev),
              }),
              target: 'SingleTouching',
            },
            'TOUCH.CANCEL': {},
          },
        },
      },
    },
  },
})

export type TouchRef = ActorRefFrom<typeof touchMachine>
