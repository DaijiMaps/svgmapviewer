/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-conditional-statements */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { svgMapViewerConfig } from '../../config'
import { notifySearchRequestDone } from '../event-search'
import { type SearchWorker, type SearchWorkerRes } from './search-worker-types'
import { type SearchPos } from './types'

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
    const fidx = res.fidx
    notifySearchRequestDone({ psvg, fidx, info })
  }
}

worker.onerror = (ev) => {
  console.error('search error', ev)
}

worker.onmessageerror = (ev) => {
  console.error('search messageerror', ev)
}

export { worker as searchWorker }
