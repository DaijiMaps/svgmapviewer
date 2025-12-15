import { createActor, emit, setup } from 'xstate'
import {
  notifySearch,
  notifySearchEnd,
  searchDoneCbs,
  searchStartCbs,
} from '../../event'
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

////

const searchRef = createActor(searchMachine)

searchRef.on('SEARCH', ({ psvg }) => notifySearch(psvg))
searchRef.on('SEARCH.DONE', ({ psvg, info }) => notifySearchEnd(psvg, info))

searchRef.start()

////

function searchSearchStart(psvg: Vec): void {
  searchRef.send({ type: 'SEARCH', psvg })
}

function searchSearchDone(res: Readonly<null | SearchRes>): void {
  searchRef.send(
    res === null ? { type: 'SEARCH.CANCEL' } : { type: 'SEARCH.DONE', ...res }
  )
}

searchStartCbs.add(searchSearchStart)
searchDoneCbs.add(searchSearchDone)

export function searchActorStart(): void {
  searchRef.start()
}
