import { type OsmDataConfig } from 'svgmapviewer'
import {
  calcScale,
  mapMapFromMapData,
  type OsmMapData,
  type OsmMapMap,
} from 'svgmapviewer/geo'
import areas from './data/areas'
import internals from './data/internals'
import lines from './data/map-lines'
import multilinestrings from './data/map-multilinestrings'
import multipolygons from './data/map-multipolygons'
import points from './data/map-points'
import measures from './data/measures'
import origin from './data/origin'
import viewbox from './data/viewbox'

const mapData: OsmMapData = {
  areas,
  internals,
  origin,
  measures,
  viewbox,

  points,
  lines,
  multilinestrings,
  multipolygons,
}

const mapMap: OsmMapMap = mapMapFromMapData(mapData)

const { mapCoord, mapViewBox: origViewBox } = calcScale(mapData)

export const dataConfig: OsmDataConfig = {
  mapData,
  mapMap,
  mapCoord,
  origViewBox,
}
