import type { OsmMapObjects } from 'svgmapviewer/carto'

import { objectNames } from 'svgmapviewer/carto-objects'

export const bench: OsmMapObjects = {
  name: 'benches',
  path: objectNames.bench,
  width: 0.05,
  pointsFilter: (p) => !!p.other_tags?.match(/"bench"/),
}
