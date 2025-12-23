import type { OsmMapObjects } from 'svgmapviewer/carto'
import { objectNames } from 'svgmapviewer/carto-objects'

export const torii: OsmMapObjects = {
  name: 'torii',
  path: objectNames.torii,
  width: 0.05,
  pointsFilter: (p) =>
    !!p.man_made?.match(/^torii$/) ||
    (!!p.other_tags?.match(/"amenity"=>"place_of_worship"/) &&
      !!p.other_tags?.match(/"religion"=>"shinto"/)),
}
