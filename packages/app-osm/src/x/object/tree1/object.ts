import type { OsmMapObjects } from 'svgmapviewer/carto'
import { tree4x8Path } from 'svgmapviewer/carto-objects'

export const tree1: OsmMapObjects = {
  name: 'trees1',
  path: tree4x8Path,
  width: 0.15,
  pointsFilter: (p) => !!p.other_tags?.match(/"tree"/),
}
