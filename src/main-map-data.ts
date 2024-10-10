import areas from './data/areas.json'
import centroids from './data/centroids.json'
import lines from './data/lines.json'
import measures from './data/measures.json'
import multipolygons from './data/multipolygons.json'
import multilinestrings from './data/multistrings.json'
import origin from './data/origin.json'
import points from './data/points.json'
import viewbox from './data/viewbox.json'
import { MapData } from './lib/map/data'
import { calcScale } from './lib/map/geojson'

export const mapData: MapData = {
  areas,
  origin,
  measures,
  viewbox,

  points,
  lines,
  multilinestrings,
  multipolygons,
  centroids,
}

export const { mapConv, mapViewBox } = calcScale(mapData)
