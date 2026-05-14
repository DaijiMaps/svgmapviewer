import type { OsmMapObjects } from 'svgmapviewer/carto'
import { objectNames } from 'svgmapviewer/carto-objects'

export const tree1: OsmMapObjects = {
  name: 'trees1',
  path: objectNames.tree_4x8,
  width: 0.15,
  pointsFilter: (p) => !!p.other_tags?.match(/"tree"/),
}
