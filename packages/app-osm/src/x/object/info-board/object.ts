import type { OsmMapObjects } from 'svgmapviewer/carto'
import { infoBoardPath } from 'svgmapviewer/carto-objects'

export const info_board: OsmMapObjects = {
  name: 'info-boards',
  path: infoBoardPath,
  width: 0.05,
  pointsFilter: (p) => !!p.other_tags?.match(/"information"=>"(board|map)"/),
}
