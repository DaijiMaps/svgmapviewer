import { assign, createActor, enqueueActions, setup } from 'xstate'

import { useSelector } from '@xstate/react'
import {
  uiActionFullscreenCbs,
  uiActionPositionCbs,
  uiActionRecenterCbs,
  uiActionResetCbs,
  uiActionZoomInCbs,
  uiActionZoomOutCbs,
} from '../../event'
import {
  handleTouchEnd,
  handleTouchMove,
  handleTouchStart,
  resetTouches,
  type Vecs,
} from './touch'
import {
  type TouchContext_,
  type TouchEmit_,
  type TouchEvent_,
} from './touch-types'
import { viewerSend } from './viewer-xstate'

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

export let touching: boolean = false

touchActor.on('MULTI.START', () => {
  touching = true
  viewerSend({ type: 'TOUCH.LOCK' })
})

touchActor.on('MULTI.END', () => {
  viewerSend({ type: 'TOUCH.UNLOCK' })
  touching = false
})
touchActor.on('ZOOM', ({ z, p }) => {
  viewerSend({ type: 'ZOOM.ZOOM', z: z > 0 ? 1 : -1, p })
})

touchActor.start()

////

export function touchActorStart(): void {
  touchActor.start()
}

export function touchSendTouchStart(ev: React.TouchEvent): void {
  touchActor.send({ type: 'TOUCH.START', ev })
}
export function touchSendTouchMove(ev: React.TouchEvent): void {
  touchActor.send({ type: 'TOUCH.MOVE', ev })
}
export function touchSendTouchEnd(ev: React.TouchEvent): void {
  touchActor.send({ type: 'TOUCH.END', ev })
}
export function touchSendCancel(): void {
  touchActor.send({ type: 'CANCEL' })
}

export function useTouchesVecs(): Vecs {
  return useSelector(touchActor, (s) => s.context.touches.vecs)
}
export function useTouchesZ(): null | number {
  return useSelector(touchActor, (s) => s.context.touches.z)
}

uiActionResetCbs.add(touchSendCancel)
uiActionFullscreenCbs.add(touchSendCancel)
uiActionPositionCbs.add(touchSendCancel)
uiActionRecenterCbs.add(touchSendCancel)
uiActionZoomOutCbs.add(touchSendCancel)
uiActionZoomInCbs.add(touchSendCancel)
