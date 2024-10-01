import { ActorRefFrom, emit, setup, StateFrom } from 'xstate'
import { Info } from './types'
import { Vec } from './vec'

export type SearchEvent =
  | { type: 'SEARCH'; p: Vec; psvg: Vec }
  | { type: 'SEARCH.DONE'; p: Vec; psvg: Vec; info: Info }
  | { type: 'SEARCH.CANCEL' }

export type SearchEmitted =
  | { type: 'SEARCH'; p: Vec; psvg: Vec }
  | { type: 'SEARCH.DONE'; p: Vec; psvg: Vec; info: Info }

export const searchMachine = setup({
  types: {} as {
    context: object
    events: SearchEvent
    emitted: SearchEmitted
  },
  actions: {},
}).createMachine({
  id: 'search',
  context: {},
  initial: 'Idle',
  states: {
    Idle: {
      on: {
        SEARCH: {
          actions: emit(({ event }) => event),
          target: 'Searching',
        },
      },
    },
    Searching: {
      on: {
        'SEARCH.DONE': {
          actions: emit(({ event }) => event),
          target: 'Done',
        },
        'SEARCH.CANCEL': {
          target: 'Done',
        },
      },
    },
    Done: {
      always: 'Idle',
    },
  },
})

export type SearchMachine = typeof searchMachine

export type SearchState = StateFrom<typeof searchMachine>

export type SearchSend = (events: SearchEvent) => void

export type SearchRef = ActorRefFrom<typeof searchMachine>
