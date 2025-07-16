/* eslint-disable functional/no-conditional-statements */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
import { svgMapViewerConfig } from '../../config'
import { notifySearchDone, searchCbs } from '../../event'
import type { Vec } from '../vec'
import { getAddressInfo } from './address-data'
import type { AddressEntries, SearchAddressRes } from './address-types'
import type { SearchWorkerRes } from './search-worker-types'

const worker = new Worker(new URL('./search-worker.js', import.meta.url), {
  type: 'module',
})

worker.onmessage = (e: Readonly<MessageEvent<SearchWorkerRes>>) => {
  const ev = e.data
  if (ev.type === 'INIT.DONE') {
    // XXX
  } else if (ev.type === 'SEARCH.DONE') {
    handleSearchRes(ev.res)
  }
}

function handleSearchRes(res: Readonly<SearchAddressRes>): void {
  const info = getAddressInfo(
    svgMapViewerConfig.mapMap,
    svgMapViewerConfig.searchEntries,
    res
  )
  if (info === null) {
    return
  }
  const psvg = svgMapViewerConfig.mapCoord.matrix.transformPoint(res.lonlat)
  notifySearchDone(psvg, info)
}

worker.onerror = (ev) => {
  console.log('error', ev)
}

worker.onmessageerror = (ev) => {
  console.log('messageerror', ev)
}

export function workerSearchInit(entries: Readonly<AddressEntries>): void {
  worker.postMessage({ type: 'INIT', entries })
}

function workerSearchStart(psvg: Readonly<Vec>): void {
  const pgeo = svgMapViewerConfig.mapCoord.matrix.inverse().transformPoint(psvg)
  worker.postMessage({ type: 'SEARCH', pgeo })
}

searchCbs.add(workerSearchStart)
