import { createActor, emit, setup } from 'xstate'
import {
  type SearchGeoReq,
  type SearchSvgReq,
  type SearchRes,
  type SvgMapViewerConfig,
} from '../../types'
import { globalCbs } from '../event-global'
import {
  notifySearchEnd,
  notifySearchRequest,
  searchCbs,
} from '../event-search'
import { searchWorker } from './search-main'
import type { SearchWorkerReq } from './search-worker-types'
import { svgMapViewerConfig } from '../../config'
import { currentFidxAtom } from '../viewer/floors/floors-xstate'

export type SearchEvent =
  | { type: 'SEARCH'; req: SearchSvgReq }
  | { type: 'SEARCH.DONE'; res: SearchRes }
  | { type: 'SEARCH.CANCEL' }

export type SearchEmitted =
  | { type: 'SEARCH'; req: SearchSvgReq }
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

const searchActor = createActor(searchMachine)

export function searchActorStart(): void {
  searchActor.start()
}

searchActor.on('SEARCH', ({ req }) => notifySearchRequest(req))
searchActor.on('SEARCH.DONE', ({ res }) => notifySearchEnd(res))
searchActor.on('SEARCH.CANCEL', () => notifySearchEnd(null))

////

export function searchCbsStart(): void {
  globalCbs.init.add((cfg: Readonly<SvgMapViewerConfig>) => {
    if (cfg.getSearchEntries) {
      const entries = cfg.getSearchEntries(cfg)
      const req: SearchWorkerReq = { type: 'INIT', entries }
      searchWorker.postMessage(req)
    }
  })
  searchCbs.start.add(function (req: Readonly<SearchSvgReq>): void {
    searchActor.send({ type: 'SEARCH', req })
  })
  searchCbs.request.add(({ psvg }: Readonly<SearchSvgReq>) => {
    const pgeo = svgMapViewerConfig.mapCoord.matrix
      .inverse()
      .transformPoint(psvg)
    const fidx = currentFidxAtom.get()
    const greq: SearchGeoReq = {
      pgeo,
      fidx,
    }
    const req: SearchWorkerReq = { type: 'SEARCH', greq }
    searchWorker.postMessage(req)
  })
  searchCbs.requestDone.add(function (res: Readonly<null | SearchRes>): void {
    searchActor.send(
      res === null ? { type: 'SEARCH.CANCEL' } : { type: 'SEARCH.DONE', res }
    )
  })
}
