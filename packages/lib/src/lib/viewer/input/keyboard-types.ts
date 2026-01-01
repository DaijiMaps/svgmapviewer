import { type ViewerAction } from '../../event-action-types'

type Down = { type: 'DOWN'; key: string }
type Up = { type: 'UP'; key: string }

type Events = Down | Up

type Emits = ViewerAction | { type: 'NOP' }

export type {
  Down as KeyboardDown,
  Up as KeyboardUp,
  Events as KeyboardEvents,
  Emits as KeyboardEmits,
}
