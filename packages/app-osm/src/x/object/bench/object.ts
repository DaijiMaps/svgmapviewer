import type { OsmMapObjects } from 'svgmapviewer/carto'
import { benchPath } from 'svgmapviewer/carto-objects'

export const bench: OsmMapObjects = {
  name: 'benches',
  path: benchPath,
  width: 0.05,
  pointsFilter: (p) => !!p.other_tags?.match(/"bench"/),
}
