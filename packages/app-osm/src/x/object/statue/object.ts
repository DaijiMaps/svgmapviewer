import type { OsmMapObjects } from 'svgmapviewer/carto'
import { statuePath } from 'svgmapviewer/carto-objects'

export const status: OsmMapObjects = {
  name: 'statue',
  path: statuePath,
  width: 0.05,
  pointsFilter: (p) => !!p.other_tags?.match(/"artwork_type"=>"statue"/),
}
