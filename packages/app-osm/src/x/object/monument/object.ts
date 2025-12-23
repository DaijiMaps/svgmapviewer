import type { OsmMapObjects } from 'svgmapviewer/carto'
import { objectNames } from 'svgmapviewer/carto-objects'

export const monument: OsmMapObjects = {
  name: 'monument',
  path: objectNames.monument,
  width: 0.05,
  pointsFilter: (p) =>
    !!p.other_tags?.match(/"historic"=>"(monument|memorial|tomb)"/),
}
