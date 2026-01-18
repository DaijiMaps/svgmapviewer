import type { OsmMapObjects } from 'svgmapviewer/carto'

import { objectNames } from 'svgmapviewer/carto-objects'

export const entrance: OsmMapObjects = {
  name: 'entrances',
  path: objectNames.entrance,
  width: 0.05,
  pointsFilter: (p) => !!p.other_tags?.match(/"entrance"/),
}
