import { MapData } from '@daijimaps/svgmapviewer'
import areas from './data/areas.json'
import centroids from './data/map-centroids.json'
import lines from './data/map-lines.json'
import multipolygons from './data/map-multipolygons.json'
import multilinestrings from './data/map-multistrings.json'
import points from './data/map-points.json'
import measures from './data/measures.json'
import origin from './data/origin.json'
import viewbox from './data/viewbox.json'

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
