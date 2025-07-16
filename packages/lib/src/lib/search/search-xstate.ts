import { createActor, emit, setup } from 'xstate'
import { notifySearch, notifySearchEnd } from '../../event'
import { type Info, type SearchRes } from '../../types'
import { type Vec } from '../vec'

export type SearchEvent =
  | { type: 'SEARCH'; psvg: Vec }
  | { type: 'SEARCH.DONE'; psvg: Vec; info: Info }
  | { type: 'SEARCH.CANCEL' }

export type SearchEmitted =
  | { type: 'SEARCH'; psvg: Vec }
  | { type: 'SEARCH.DONE'; psvg: Vec; info: Info }

const searchMachine = setup({
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

//type SearchMachine = typeof searchMachine

//type SearchState = StateFrom<typeof searchMachine>

//type SearchSend = (events: SearchEvent) => void

//type SearchRef = ActorRefFrom<typeof searchMachine>

////

const searchRef = createActor(searchMachine)

searchRef.on('SEARCH', ({ psvg }) => notifySearch(psvg))
searchRef.on('SEARCH.DONE', ({ psvg, info }) => notifySearchEnd(psvg, info))

searchRef.start()

////

export function searchSearchStart(psvg: Vec): void {
  searchRef.send({ type: 'SEARCH', psvg })
}

export function searchSearchDone(res: Readonly<null | SearchRes>): void {
  searchRef.send(
    res === null ? { type: 'SEARCH.CANCEL' } : { type: 'SEARCH.DONE', ...res }
  )
}

export function searchActorStart(): void {
  searchRef.start()
}
