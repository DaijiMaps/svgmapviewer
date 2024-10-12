import { Info, svgMapViewerConfig } from '@daijimaps/svgmapviewer'
import { VecVec as Vec } from '@daijimaps/svgmapviewer/vec'
import SearchWorker from './search-worker?worker'

const worker = new SearchWorker()

worker.onmessage = (
  e: Readonly<MessageEvent<null | { p: Vec; pgeo: Vec; info: Info }>>
) => {
  svgMapViewerConfig.searchDoneCbs.forEach((cb) =>
    cb(
      e.data === null
        ? null
        : {
            p: e.data.p,
            psvg: svgMapViewerConfig.mapCoord.fromGeo(e.data.pgeo),
            info: e.data.info,
          }
    )
  )
}

worker.onerror = (ev) => {
  console.log('error', ev)
}

worker.onmessageerror = (ev) => {
  console.log('messageerror', ev)
}

export function workerSearchStart(p: Vec, psvg: Vec) {
  const pgeo = svgMapViewerConfig.mapCoord.toGeo(psvg)
  worker.postMessage({ p, pgeo })
}
