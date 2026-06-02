import { createActor, emit, setup } from 'xstate'

import { svgMapViewerConfig } from '../../config'
import {
  type SearchGeoReq,
  type SearchSvgReq,
  type SearchRes,
  type SvgMapViewerConfig,
} from '../../types'
import type { SearchAddress } from '../address'
import { globalCbs } from '../event-global'
import { notifySearch, searchCbs } from '../event-search'
import { currentFidxAtom } from '../viewer/floors/floors-xstate'
import { getSearchInfoCommon } from './info'
import type {
  SearchWorker,
  SearchWorkerReq,
  SearchWorkerRes,
} from './search-worker-types'

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

worker.onmessage = async (
  e: Readonly<MessageEvent<SearchWorkerRes>>
): Promise<void> => {
  const ev = e.data
  switch (ev.type) {
    case 'INIT.DONE':
      return searchSend({ type: 'INIT.DONE' })
    case 'SEARCH.DONE':
      return handleSearchRes(ev.res).catch((e) => console.log(`SEARCH.DONE`, e))
    case 'SEARCH.ERROR':
      console.log('search error!', ev.error)
      return searchSend({ type: 'SEARCH.DONE', res: null })
  }
}

worker.onerror = (ev) => {
  console.error('search error', ev)
}

worker.onmessageerror = (ev) => {
  console.error('search messageerror', ev)
}

function handleSearchRes(res: Readonly<SearchAddress>): Promise<void> {
  const info = Promise.resolve(getSearchInfoCommon(res)).then((tmp) =>
    tmp !== null
      ? tmp
      : svgMapViewerConfig.getSearchInfo(
          res,
          svgMapViewerConfig.mapMap,
          svgMapViewerConfig.osmSearchEntries
        )
  )
  return info.then((info) => {
    if (info === null) {
      console.log('info not found!', res)
      return searchSend({ type: 'SEARCH.DONE', res: null })
    } else {
      const psvg = svgMapViewerConfig.mapCoord.matrix.transformPoint(
        res.floorPos.coord
      )
      const fidx = res.floorPos.fidx
      return searchSend({ type: 'SEARCH.DONE', res: { psvg, fidx, info } })
    }
  })
}

////

export function searchCbsStart(): void {
  globalCbs.init.add((cfg: Readonly<SvgMapViewerConfig>) => {
    if (cfg.searchAddresses) {
      return Promise.resolve(cfg.searchAddresses).then((xs) => {
        const entries = xs.map((x) => ({ ...x, pos: x.floorPos }))
        const req: SearchWorkerReq = { type: 'INIT', entries }
        worker.postMessage(req)
      })
    }
    if (cfg.getSearchEntries) {
      return Promise.resolve(cfg.getSearchEntries(cfg)).then((entries) => {
        const req: SearchWorkerReq = { type: 'INIT', entries }
        worker.postMessage(req)
      })
    }
  })
  searchCbs.start.add(function (req: Readonly<SearchSvgReq>): void {
    searchActor.send({ type: 'SEARCH', req })
  })
}
