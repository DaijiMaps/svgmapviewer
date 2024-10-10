/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
import {
  SearchRes,
  svgMapViewerConfig,
  VecVec as Vec,
} from '@daijimaps/svgmapviewer'
import SearchWorker from './main-search-worker?worker&inline'

const worker = new SearchWorker()

worker.onmessage = (e: Readonly<MessageEvent<null | SearchRes>>) => {
  svgMapViewerConfig.searchDoneCbs.forEach((cb) =>
    cb(
      e.data === null
        ? null
        : { p: e.data.p, psvg: e.data.psvg, info: e.data.info }
    )
  )
}

export function workerSearchStart(p: Vec, psvg: Vec) {
  worker.postMessage({ p, psvg })
}
