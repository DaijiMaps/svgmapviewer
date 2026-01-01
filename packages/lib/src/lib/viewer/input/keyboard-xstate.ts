import { createActor, emit, setup } from 'xstate'
import { keyToZoom } from '../key'
import { type ViewerAction } from '../../event-action-types'

type DOWN = { type: 'DOWN'; key: string }
type UP = { type: 'UP'; key: string }

type Events = DOWN | UP

type Emits = ViewerAction

const keyboardMachine = setup({
  types: {
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
    zoomIn: emit({ type: 'ZOOM.IN' }),
    zoomOut: emit({ type: 'ZOOM.OUT' }),
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
          },
          {
            guard: 'shouldRecenter',
          },
          {
            guard: 'shouldRotate',
          },
          {
            guard: 'shouldZoom',
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

keyboardActor.on('RESET', () => {})
keyboardActor.on('RECENTER', () => {})
keyboardActor.on('ROTATE', () => {})
keyboardActor.on('ZOOM.IN', () => {})
keyboardActor.on('ZOOM.OUT', () => {})
