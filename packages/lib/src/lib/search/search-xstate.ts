import { createActor, emit, setup } from 'xstate'
import {
  notifySearch,
  notifySearchEnd,
  searchDoneCbs,
  searchStartCbs,
} from '../../event'
import { type SearchReq, type SearchRes } from '../../types'

export type SearchEvent =
  | { type: 'SEARCH'; req: SearchReq }
  | { type: 'SEARCH.DONE'; res: SearchRes }
  | { type: 'SEARCH.CANCEL' }

export type SearchEmitted =
  | { type: 'SEARCH'; req: SearchReq }
  | { type: 'SEARCH.DONE'; res: SearchRes }
  | { type: 'SEARCH.CANCEL' }

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
          actions: emit(({ event }) => event),
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

searchRef.on('SEARCH', ({ req }) => notifySearch(req))
searchRef.on('SEARCH.DONE', ({ res }) => notifySearchEnd(res))
searchRef.on('SEARCH.CANCEL', () => notifySearchEnd(null))

searchRef.start()

////

function searchSearchStart(req: Readonly<SearchReq>): void {
  searchRef.send({ type: 'SEARCH', req })
}

function searchSearchDone(res: Readonly<null | SearchRes>): void {
  searchRef.send(
    res === null ? { type: 'SEARCH.CANCEL' } : { type: 'SEARCH.DONE', res }
  )
}

export function searchActorStart(): void {
  searchRef.start()
}

export function searchCbsStart(): void {
  searchStartCbs.add(searchSearchStart)
  searchDoneCbs.add(searchSearchDone)
}
