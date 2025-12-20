/* eslint-disable functional/no-conditional-statements */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
import { svgMapViewerConfig } from './config'
import { initCbs, notifySearchRequestDone, searchCbs } from './event'
import { type SearchPos } from './lib/search/types'
import {
  type SearchWorkerReq,
  type SearchWorkerRes,
} from './lib/search/search-worker-types'
import type { SearchReq, SvgMapViewerConfig } from './types'

const worker = new Worker(new URL('./search-worker.js', import.meta.url), {
  type: 'module',
})

worker.onmessage = (e: Readonly<MessageEvent<SearchWorkerRes>>) => {
  const ev = e.data
  switch (ev.type) {
    case 'INIT.DONE':
      // XXX
      break
    case 'SEARCH.DONE':
      handleSearchRes(ev.res)
      break
    case 'SEARCH.ERROR':
      console.log('search error!', ev.error)
      notifySearchRequestDone(null)
      break
  }
}

function handleSearchRes(res: Readonly<SearchPos>): void {
  const info = svgMapViewerConfig.getSearchInfo(
    res,
    svgMapViewerConfig.mapMap,
    svgMapViewerConfig.osmSearchEntries
  )
  if (info === null) {
    console.log('info not found!', res)
    notifySearchRequestDone(null)
  } else {
    const psvg = svgMapViewerConfig.mapCoord.matrix.transformPoint(res.coord)
    notifySearchRequestDone({ psvg, info })
  }
}

worker.onerror = (ev) => {
  console.log('error', ev)
}

worker.onmessageerror = (ev) => {
  console.log('messageerror', ev)
}

// eslint-disable-next-line functional/functional-parameters
export function searchWorkerCbsStart(): void {
  initCbs.add((cfg: Readonly<SvgMapViewerConfig>) => {
    if (cfg.getSearchEntries) {
      const entries = cfg.getSearchEntries(cfg)
      const req: SearchWorkerReq = { type: 'INIT', entries }
      worker.postMessage(req)
    }
  })
  searchCbs.request.add(({ psvg, fidx }: Readonly<SearchReq>) => {
    // XXX convert elsewhere
    const pgeo = svgMapViewerConfig.mapCoord.matrix
      .inverse()
      .transformPoint(psvg)
    const req: SearchWorkerReq = { type: 'SEARCH', greq: { pgeo, fidx } }
    worker.postMessage(req)
  })
}
