/* eslint-disable functional/no-conditional-statements */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
import { svgMapViewerConfig } from '@daijimaps/svgmapviewer'
import { VecVec as Vec } from '@daijimaps/svgmapviewer/vec'
import { addressEntries, getAddressInfo } from './address-data'
import { SearchWorkerRes } from './search-worker'
import SearchWorker from './search-worker?worker'

const worker = new SearchWorker()

worker.onmessage = (e: Readonly<MessageEvent<SearchWorkerRes>>) => {
  const ev = e.data
  if (ev.type === 'INIT.DONE') {
    // XXX
  } else if (ev.type === 'SEARCH.DONE') {
    const res = ev.res
    const info = getAddressInfo(res)
    if (info === null) {
      return
    }
    const psvg = svgMapViewerConfig.mapCoord.fromGeo(res.lonlat)
    svgMapViewerConfig.searchDoneCbs.forEach((cb) => cb({ psvg, info }))
  }
}

worker.onerror = (ev) => {
  console.log('error', ev)
}

worker.onmessageerror = (ev) => {
  console.log('messageerror', ev)
}

export function workerSearchInit() {
  const entries = addressEntries()
  worker.postMessage({ type: 'INIT', entries })
}

export function workerSearchStart(psvg: Vec) {
  const pgeo = svgMapViewerConfig.mapCoord.toGeo(psvg)
  worker.postMessage({ type: 'SEARCH', pgeo })
}
