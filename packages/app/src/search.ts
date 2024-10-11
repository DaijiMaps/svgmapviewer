import { Info, svgMapViewerConfig } from '@daijimaps/svgmapviewer'
import { VecVec as Vec } from '@daijimaps/svgmapviewer/vec'
import SearchWorker from './search-worker?worker&inline'

const worker = new SearchWorker()

worker.onmessage = (
  e: Readonly<MessageEvent<null | { p: Vec; pgeo: Vec; info: Info }>>
) => {
  // XXX from geo
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

export function workerSearchStart(p: Vec, psvg: Vec) {
  // XXX to geo
  const pgeo = svgMapViewerConfig.mapCoord.toGeo(psvg)
  worker.postMessage({ p, pgeo })
}
