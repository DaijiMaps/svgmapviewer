/* eslint-disable functional/no-conditional-statements */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
import { svgMapViewerConfig } from './config'
import { notifySearchDone, searchCbs } from './event'
import {
  type AddressEntries,
  type SearchAddressRes,
} from './lib/search/address-types'
import {
  type SearchWorkerReq,
  type SearchWorkerRes,
} from './lib/search/search-worker-types'
import type { SearchReq } from './types'

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
      notifySearchDone(null)
      break
  }
}

function handleSearchRes(res: Readonly<SearchAddressRes>): void {
  const info = svgMapViewerConfig.getAddressInfo(
    svgMapViewerConfig.mapMap,
    svgMapViewerConfig.searchEntries,
    res
  )
  if (info === null) {
    console.log('info not found!', res)
    notifySearchDone(null)
  } else {
    const psvg = svgMapViewerConfig.mapCoord.matrix.transformPoint(res.coord)
    notifySearchDone({ psvg, info })
  }
}

worker.onerror = (ev) => {
  console.log('error', ev)
}

worker.onmessageerror = (ev) => {
  console.log('messageerror', ev)
}

export function workerSearchInit(entries: Readonly<AddressEntries>): void {
  const req: SearchWorkerReq = { type: 'INIT', entries }
  worker.postMessage(req)
}

function workerSearchStart({ psvg, fidx }: Readonly<SearchReq>): void {
  const pgeo = svgMapViewerConfig.mapCoord.matrix.inverse().transformPoint(psvg)
  const req: SearchWorkerReq = { type: 'SEARCH', pgeo, fidx }
  worker.postMessage(req)
}

searchCbs.add(workerSearchStart)
