import { createActor, emit, setup } from 'xstate'
import { keyToZoom } from './key'
import { type KeyboardEmits, type KeyboardEvents } from './keyboard-types'
import {
  notifyActionRecenter,
  notifyActionReset,
  notifyActionRotate,
  notifyActionZoomIn,
  notifyActionZoomOut,
} from '../../event-action'
import type { Dir } from '../../../types'

const keyboardMachine = setup({
  types: {
    events: {} as KeyboardEvents,
    emitted: {} as KeyboardEmits,
  },
  guards: {
    shouldReset: ({ event: { key } }) => key === 'r',
    shouldRecenter: ({ event: { key } }) => key === 'c',
    shouldRotate: ({ event: { key } }) => key === 't',
    shouldZoom: ({ event: { key } }) => keyToZoom(key) !== 0,
  },
  actions: {
    reset: emit({ type: 'RESET' }),
    recenter: emit({ type: 'RECENTER' }),
    rotate: emit({ type: 'ROTATE' }),
    zoom: emit((_, { z }: { z: Dir }) => ({
      type: z > 0 ? 'ZOOM.IN' : z < 0 ? 'ZOOM.OUT' : 'NOP',
    })),
  },
}).createMachine({
  id: 'keyboard1',
  initial: 'Idle',
  states: {
    Idle: {
      on: {
        DOWN: {},
        UP: [
          {
            guard: 'shouldReset',
            actions: 'reset',
          },
          {
            guard: 'shouldRecenter',
            actions: 'recenter',
          },
          {
            guard: 'shouldRotate',
            actions: 'rotate',
          },
          {
            guard: 'shouldZoom',
            actions: {
              type: 'zoom',
              params: ({ event: { key } }): { z: Dir } => ({
                z: keyToZoom(key),
              }),
            },
          },
        ],
      },
    },
  },
})

const keyboardActor = createActor(keyboardMachine)

export function keyboardActorStart(): void {
  keyboardActor.start()
}

export function keyboardSend(ev: KeyboardEvents): void {
  keyboardActor.send(ev)
}

keyboardActor.on('RESET', notifyActionReset)
keyboardActor.on('RECENTER', notifyActionRecenter)
keyboardActor.on('ROTATE', notifyActionRotate)
keyboardActor.on('ZOOM.IN', notifyActionZoomIn)
keyboardActor.on('ZOOM.OUT', notifyActionZoomOut)
