import { type OsmDataConfig } from 'svgmapviewer'
import { calcScale, mapMapFromMapData, type OsmMapMap } from 'svgmapviewer/geo'
import { all as mapData } from './data/all'

const mapMap: OsmMapMap = mapMapFromMapData(mapData)

const { mapCoord, mapViewBox: origViewBox } = calcScale(mapData)

export const dataConfig: OsmDataConfig = {
  mapData,
  mapMap,
  mapCoord,
  origViewBox,
}
