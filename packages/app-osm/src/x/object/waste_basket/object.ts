import type { OsmMapObjects } from 'svgmapviewer/carto'
import { objectNames } from 'svgmapviewer/carto-objects'

export const waste_basket: OsmMapObjects = {
  name: 'waste-basket',
  path: objectNames.waste_basket,
  width: 0.05,
  pointsFilter: (p) => !!p.other_tags?.match(/"amenity"=>"waste_basket"/),
}
