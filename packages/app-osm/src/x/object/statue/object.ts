import type { OsmMapObjects } from 'svgmapviewer/carto'

import { objectNames } from 'svgmapviewer/carto-objects'

export const statue: OsmMapObjects = {
  name: 'statue',
  path: objectNames.statue,
  width: 0.05,
  pointsFilter: (p) => !!p.other_tags?.match(/"artwork_type"=>"statue"/),
}
