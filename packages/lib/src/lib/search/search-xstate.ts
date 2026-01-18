import { createActor, emit, setup } from 'xstate'

import type {
  SearchWorker,
  SearchWorkerReq,
  SearchWorkerRes,
} from './search-worker-types'
import type { SearchPos } from './types'

import { svgMapViewerConfig } from '../../config'
import {
  type SearchGeoReq,
  type SearchSvgReq,
  type SearchRes,
  type SvgMapViewerConfig,
} from '../../types'
import { globalCbs } from '../event-global'
import { notifySearch, searchCbs } from '../event-search'
import { currentFidxAtom } from '../viewer/floors/floors-xstate'

export type SearchEvent =
  | { type: 'INIT.DONE' }
  | { type: 'SEARCH'; req: SearchSvgReq }
  | { type: 'SEARCH.DONE'; res: null | SearchRes }

export type SearchEmitted =
  | { type: 'SEARCH'; req: SearchSvgReq }
  | { type: 'SEARCH.DONE'; res: null | SearchRes }

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
  initial: 'Uninited',
  states: {
    Uninited: {
      on: {
        'INIT.DONE': {
          target: 'Idle',
        },
      },
    },
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

function searchSend(ev: SearchEvent): void {
  searchActor.send(ev)
}

searchActor.on('SEARCH', ({ req: { psvg } }) => {
  const pgeo = svgMapViewerConfig.mapCoord.matrix.inverse().transformPoint(psvg)
  const fidx = currentFidxAtom.get()
  const greq: SearchGeoReq = {
    pgeo,
    fidx,
  }
  const req: SearchWorkerReq = { type: 'SEARCH', greq }
  worker.postMessage(req)
})
searchActor.on('SEARCH.DONE', ({ res }) => notifySearch.end(res))

////

const worker: SearchWorker = new Worker(
  new URL('./search-worker.js', import.meta.url),
  {
    type: 'module',
  }
)

worker.onmessage = (e: Readonly<MessageEvent<SearchWorkerRes>>) => {
  const ev = e.data
  switch (ev.type) {
    case 'INIT.DONE':
      searchSend({ type: 'INIT.DONE' })
      break
    case 'SEARCH.DONE':
      handleSearchRes(ev.res)
      break
    case 'SEARCH.ERROR':
      console.log('search error!', ev.error)
      searchSend({ type: 'SEARCH.DONE', res: null })
      break
  }
}

worker.onerror = (ev) => {
  console.error('search error', ev)
}

worker.onmessageerror = (ev) => {
  console.error('search messageerror', ev)
}

function handleSearchRes(res: Readonly<SearchPos>): void {
  const info = svgMapViewerConfig.getSearchInfo(
    res,
    svgMapViewerConfig.mapMap,
    svgMapViewerConfig.osmSearchEntries
  )
  if (info === null) {
    console.log('info not found!', res)
    searchSend({ type: 'SEARCH.DONE', res: null })
  } else {
    const psvg = svgMapViewerConfig.mapCoord.matrix.transformPoint(res.coord)
    const fidx = res.fidx
    searchSend({ type: 'SEARCH.DONE', res: { psvg, fidx, info } })
  }
}

////

export function searchCbsStart(): void {
  globalCbs.init.add((cfg: Readonly<SvgMapViewerConfig>) => {
    if (cfg.getSearchEntries) {
      const entries = cfg.getSearchEntries(cfg)
      const req: SearchWorkerReq = { type: 'INIT', entries }
      worker.postMessage(req)
    }
  })
  searchCbs.start.add(function (req: Readonly<SearchSvgReq>): void {
    searchActor.send({ type: 'SEARCH', req })
  })
}
