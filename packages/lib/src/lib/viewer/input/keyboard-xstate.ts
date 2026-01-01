import { assign, createActor, emit, setup } from 'xstate'
import { keyToZoom } from './key'
import {
  type KeyboardEmits as Emits,
  type KeyboardEvents as Events,
  type KeyboardContext as Context,
} from './keyboard-types'
import {
  notifyActionRecenter,
  notifyActionReset,
  notifyActionRotate,
  notifyActionZoomIn,
  notifyActionZoomOut,
} from '../../event-action'
import type { Dir } from '../../../types'
import { modClr, modSet } from './mod'

const keyboardMachine = setup({
  types: {
    context: {} as Context,
    events: {} as Events,
    emitted: {} as Emits,
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
    handleDown: assign({
      mod: ({ context, event }) => modSet(context.mod, event.key),
    }),
    handleUp: assign({
      mod: ({ context, event }) => modClr(context.mod, event.key),
    }),
  },
}).createMachine({
  id: 'keyboard1',
  context: {
    mod: {
      shift: false,
      alt: false,
      control: false,
    },
  },
  initial: 'Idle',
  states: {
    Idle: {
      on: {
        DOWN: {
          actions: 'handleDown',
        },
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
          {
            actions: 'handleUp',
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

export function keyboardSend(ev: Events): void {
  keyboardActor.send(ev)
}

keyboardActor.on('RESET', notifyActionReset)
keyboardActor.on('RECENTER', notifyActionRecenter)
keyboardActor.on('ROTATE', notifyActionRotate)
keyboardActor.on('ZOOM.IN', notifyActionZoomIn)
keyboardActor.on('ZOOM.OUT', notifyActionZoomOut)
