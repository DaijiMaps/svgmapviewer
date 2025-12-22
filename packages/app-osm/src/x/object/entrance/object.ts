import type { OsmMapObjects } from 'svgmapviewer/carto'
import { entrancePath } from 'svgmapviewer/carto-objects'

export const entrance: OsmMapObjects = {
  name: 'entrances',
  path: entrancePath,
  width: 0.05,
  pointsFilter: (p) => !!p.other_tags?.match(/"entrance"/),
}
