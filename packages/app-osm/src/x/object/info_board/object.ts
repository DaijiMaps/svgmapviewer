import type { OsmMapObjects } from 'svgmapviewer/carto'

import { objectNames } from 'svgmapviewer/carto-objects'

export const info_board: OsmMapObjects = {
  name: 'info-boards',
  path: objectNames.info_board,
  width: 0.05,
  pointsFilter: (p) => !!p.other_tags?.match(/"information"=>"(board|map)"/),
}
