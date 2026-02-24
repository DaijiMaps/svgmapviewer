import type { FloorAction } from '../../event-floor-types'

import { type ViewerAction } from '../../event-action-types'
import { type Mod } from './mod'

interface Context {
  mod: Mod
}

type Down = { type: 'DOWN'; key: string }
type Up = { type: 'UP'; key: string }

type Events = Down | Up

type Emits = ViewerAction | FloorAction | { type: 'NOP' }

export type {
  Context as KeyboardContext,
  Down as KeyboardDown,
  Up as KeyboardUp,
  Events as KeyboardEvents,
  Emits as KeyboardEmits,
}
