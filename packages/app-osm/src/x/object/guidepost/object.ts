import type { OsmMapObjects } from 'svgmapviewer/carto'
import { guidePostPath } from 'svgmapviewer/carto-objects'

export const guidepost: OsmMapObjects = {
  name: 'guide-posts',
  path: guidePostPath,
  width: 0.05,
  pointsFilter: (p) => !!p.other_tags?.match(/"guidepost"/),
}
