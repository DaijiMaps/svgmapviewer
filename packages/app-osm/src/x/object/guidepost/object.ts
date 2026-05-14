import type { OsmMapObjects } from 'svgmapviewer/carto'
import { objectNames } from 'svgmapviewer/carto-objects'

export const guidepost: OsmMapObjects = {
  name: 'guide-posts',
  path: objectNames.guide_post,
  width: 0.05,
  pointsFilter: (p) => !!p.other_tags?.match(/"guidepost"/),
}
