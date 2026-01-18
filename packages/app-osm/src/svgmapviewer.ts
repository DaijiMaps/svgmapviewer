/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-throw-statements */
import {
  svgmapviewer,
  type OsmDataConfig,
  type SvgMapViewerConfigUser,
} from 'svgmapviewer'
import { calcScale, mapMapFromMapData, type OsmMapMap } from 'svgmapviewer/geo'

import { renderConfig, searchConfig } from './main'

// eslint-disable-next-line functional/no-return-void
export function svgmapviewerOsm(cfg: Readonly<SvgMapViewerConfigUser>): void {
  const mapData = cfg.mapData

  if (mapData === undefined) {
    throw new Error('')
  }

  const mapMap: OsmMapMap = mapMapFromMapData(mapData)

  const { mapCoord, mapViewBox: origViewBox } = calcScale(mapData)

  const dataConfig: OsmDataConfig = {
    mapData,
    mapMap,
    mapCoord,
    origViewBox,
  }

  svgmapviewer({
    ...renderConfig,
    ...searchConfig,

    ...cfg,

    ...dataConfig,
  })
}
