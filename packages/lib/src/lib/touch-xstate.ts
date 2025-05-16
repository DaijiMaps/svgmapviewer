import { ActorRefFrom, assign, setup } from 'xstate'

import {
  handleTouchEnd,
  handleTouchMove,
  handleTouchStart,
  Touches,
} from './touch'

// XXX TouchEvent is DOM
type TouchEvent_ =
  | {
      type: 'TICK.TOUCH.START'
      ev: TouchEvent
    }
  | {
      type: 'TICK.TOUCH.MOVE'
      ev: TouchEvent
    }
  | {
      type: 'TICK.TOUCH.END'
      ev: TouchEvent
    }
  | {
      type: 'TICK.TOUCH.CANCEL'
      ev: TouchEvent
    }
  | {
      type: 'START'
    }
  | {
      type: 'STOP'
    }
type TouchEmit_ = {
  type: 'EXPIRED'
  ev: TouchEvent
}
type TouchContext_ = {
  touches: Touches
}

export const touchMachine = setup({
  types: {
    context: {} as TouchContext_,
    events: {} as TouchEvent_,
    emitted: {} as TouchEmit_,
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
  states: {
    Idle: {
      on: {
        'TICK.TOUCH.START': {
          actions: assign({
            touches: ({ context, event }) =>
              handleTouchStart(context.touches, event.ev),
          }),
          target: 'SingleTouching',
        },
        'TICK.TOUCH.MOVE': {},
        'TICK.TOUCH.END': {},
        'TICK.TOUCH.CANCEL': {},
      },
    },
    SingleTouching: {
      on: {
        'TICK.TOUCH.START': {
          actions: assign({
            touches: ({ context, event }) =>
              handleTouchStart(context.touches, event.ev),
          }),
          target: 'DoubleTouching',
        },
        'TICK.TOUCH.MOVE': {
          actions: assign({
            touches: ({ context, event }) =>
              handleTouchMove(context.touches, event.ev, 0),
          }),
        },
        'TICK.TOUCH.END': {
          actions: assign({
            touches: ({ context, event }) =>
              handleTouchEnd(context.touches, event.ev),
          }),
          target: 'Idle',
        },
        'TICK.TOUCH.CANCEL': {},
      },
    },
    DoubleTouching: {
      on: {
        'TICK.TOUCH.START': {},
        'TICK.TOUCH.MOVE': {
          actions: assign({
            touches: ({ context, event }) =>
              handleTouchMove(context.touches, event.ev, 0),
          }),
        },
        'TICK.TOUCH.END': {
          actions: assign({
            touches: ({ context, event }) =>
              handleTouchEnd(context.touches, event.ev),
          }),
          target: 'SingleTouching',
        },
        'TICK.TOUCH.CANCEL': {},
      },
    },
  },
})

export type TouchRef = ActorRefFrom<typeof touchMachine>
