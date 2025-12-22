import type { OsmMapObjects } from 'svgmapviewer/carto'
import { monumentPath } from 'svgmapviewer/carto-objects'

export const monument: OsmMapObjects = {
  name: 'monument',
  path: monumentPath,
  width: 0.05,
  pointsFilter: (p) =>
    !!p.other_tags?.match(/"historic"=>"(monument|memorial|tomb)"/),
}
